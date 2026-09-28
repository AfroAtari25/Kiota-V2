// supabase/functions/send-sms-hook/index.ts
//
// Supabase "Send SMS Hook" endpoint. Supabase Auth calls this instead of
// Twilio/MessageBird/Vonage whenever it needs to deliver a phone OTP —
// letting us route through Africa's Talking instead, which is dramatically
// cheaper for Kenyan numbers (~KES 0.50–1.00/SMS vs Twilio's ~KES 6–15).
//
// Deploy:   supabase functions deploy send-sms-hook --no-verify-jwt
// Secrets:  supabase secrets set SEND_SMS_HOOK_SECRET=v1,whsec_xxxxx
//           supabase secrets set AT_USERNAME=your_africastalking_username
//           supabase secrets set AT_API_KEY=your_africastalking_api_key
//           supabase secrets set AT_SENDER_ID=KIOTA          (optional, once approved)
//           supabase secrets set AT_USE_SANDBOX=true          (set to "false" for real SMS)
//
// Then in Supabase Dashboard → Authentication → Hooks → Send SMS hook:
//   enable it, paste this function's URL, and paste the SAME secret you
//   used for SEND_SMS_HOOK_SECRET above (Supabase generates it for you —
//   copy Supabase's generated secret into SEND_SMS_HOOK_SECRET, not the
//   other way around).

interface SendSmsPayload {
  user: { id: string; phone: string };
  sms: { otp: string };
}

/**
 * Verifies a Standard Webhooks signature.
 * Secret format from Supabase: "v1,whsec_<base64>".
 * Signed content: "{webhook-id}.{webhook-timestamp}.{raw_body}"
 * Header "webhook-signature" may contain multiple space-separated
 * "v1,<base64sig>" values — a match on any one is valid.
 */
async function verifySignature(
  rawBody: string,
  webhookId: string,
  webhookTimestamp: string,
  webhookSignatureHeader: string,
  secret: string
): Promise<boolean> {
  const secretB64 = secret.replace(/^v1,whsec_/, '');
  const keyBytes = Uint8Array.from(atob(secretB64), (c) => c.charCodeAt(0));

  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    keyBytes,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );

  const signedContent = `${webhookId}.${webhookTimestamp}.${rawBody}`;
  const sigBytes = await crypto.subtle.sign(
    'HMAC',
    cryptoKey,
    new TextEncoder().encode(signedContent)
  );
  const expectedSig = btoa(String.fromCharCode(...new Uint8Array(sigBytes)));

  const providedSigs = webhookSignatureHeader
    .split(' ')
    .map((s) => s.split(',')[1])
    .filter(Boolean);

  return providedSigs.includes(expectedSig);
}

/** Normalizes to E.164 for Africa's Talking (expects a leading +). */
function toE164(phone: string): string {
  const digits = phone.replace(/[^\d]/g, '');
  if (phone.startsWith('+')) return phone;
  if (digits.startsWith('254')) return `+${digits}`;
  if (digits.startsWith('0')) return `+254${digits.slice(1)}`;
  return `+254${digits}`;
}

async function sendViaAfricasTalking(phone: string, otp: string): Promise<void> {
  const username = Deno.env.get('AT_USERNAME')!;
  const apiKey = Deno.env.get('AT_API_KEY')!;
  const senderId = Deno.env.get('AT_SENDER_ID'); // optional until Sender ID is approved
  const useSandbox = Deno.env.get('AT_USE_SANDBOX') !== 'false';

  const baseUrl = useSandbox
    ? 'https://api.sandbox.africastalking.com/version1/messaging'
    : 'https://api.africastalking.com/version1/messaging';

  const body = new URLSearchParams({
    username,
    to: toE164(phone),
    message: `Your Kiota verification code is ${otp}. Valid for 10 minutes. Pata Kiota Chako.`,
  });
  if (senderId) body.set('from', senderId);

  const res = await fetch(baseUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Accept: 'application/json',
      apiKey,
    },
    body: body.toString(),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Africa's Talking send failed (${res.status}): ${errText}`);
  }

  const result = await res.json();
  const recipients = result?.SMSMessageData?.Recipients ?? [];
  const failed = recipients.find((r: { status: string }) => r.status !== 'Success');
  if (failed) {
    throw new Error(`Africa's Talking rejected the message: ${JSON.stringify(failed)}`);
  }
}

Deno.serve(async (req: Request) => {
  const rawBody = await req.text();

  const webhookId = req.headers.get('webhook-id') ?? '';
  const webhookTimestamp = req.headers.get('webhook-timestamp') ?? '';
  const webhookSignature = req.headers.get('webhook-signature') ?? '';
  const hookSecret = Deno.env.get('SEND_SMS_HOOK_SECRET') ?? '';

  if (!webhookId || !webhookTimestamp || !webhookSignature || !hookSecret) {
    return new Response(
      JSON.stringify({ error: { http_code: 401, message: 'Missing webhook signature headers.' } }),
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const isValid = await verifySignature(
    rawBody,
    webhookId,
    webhookTimestamp,
    webhookSignature,
    hookSecret
  );

  if (!isValid) {
    return new Response(
      JSON.stringify({ error: { http_code: 401, message: 'Invalid webhook signature.' } }),
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    );
  }

  let payload: SendSmsPayload;
  try {
    payload = JSON.parse(rawBody);
  } catch {
    return new Response(
      JSON.stringify({ error: { http_code: 400, message: 'Invalid JSON payload.' } }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  try {
    await sendViaAfricasTalking(payload.user.phone, payload.sms.otp);
  } catch (err) {
    console.error('SMS send failed:', err);
    return new Response(
      JSON.stringify({
        error: { http_code: 500, message: 'SMS provider failed to send the code. Please try again.' },
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }

  return new Response(JSON.stringify({}), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
});
