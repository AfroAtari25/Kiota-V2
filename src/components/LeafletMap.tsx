import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { Listing } from '../types';
import { useApp } from '../context/AppContext';

interface LeafletMapProps {
  listings: Listing[];
  onSelectListing?: (id: string) => void;
  singleListing?: Listing;
  isLocked?: boolean;
}

export const LeafletMap: React.FC<LeafletMapProps> = ({
  listings,
  onSelectListing,
  singleListing,
  isLocked = false,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const { openListingDetail, isUnlockedBySeeker, currentUser } = useApp();

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Destroy existing map if already created
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    // Default center: Nairobi or Single listing
    const centerLat = singleListing ? singleListing.gps_lat : -1.286389;
    const centerLng = singleListing ? singleListing.gps_lng : 36.817223;
    const defaultZoom = singleListing ? (isLocked ? 13 : 16) : 12;

    const map = L.map(mapContainerRef.current, {
      center: [centerLat, centerLng],
      zoom: defaultZoom,
      zoomControl: !isLocked,
      attributionControl: false,
    });

    mapInstanceRef.current = map;

    // Add OpenStreetMap tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map);

    // Single listing mode (e.g. in Detail screen)
    if (singleListing) {
      if (isLocked) {
        // Approximate Circle area with radius 500m for locked listings
        const circle = L.circle([singleListing.gps_lat, singleListing.gps_lng], {
          color: '#C1440E',
          fillColor: '#E8A33D',
          fillOpacity: 0.35,
          radius: 600,
          weight: 2,
          dashArray: '6, 6',
        }).addTo(map);

        const popupContent = document.createElement('div');
        popupContent.className = 'p-1 text-center font-sans';
        popupContent.innerHTML = `
          <div style="font-size: 11px; font-weight: bold; color: #C1440E; margin-bottom: 2px;">
            🔒 Approximate Area: ${singleListing.area.split(',')[0]}
          </div>
          <div style="font-size: 10px; color: #2B2118;">
            Exact pin & landlord contact locked
          </div>
        `;
        circle.bindPopup(popupContent).openPopup();
      } else {
        // Exact pin for unlocked
        const exactIcon = L.divIcon({
          className: 'custom-pin-unlocked',
          html: `
            <div style="
              background-color: #1B4332;
              color: #FBF3E7;
              padding: 4px 8px;
              border-radius: 9999px;
              font-weight: 800;
              font-size: 11px;
              box-shadow: 0 4px 12px rgba(0,0,0,0.3);
              border: 2px solid #FBF3E7;
              white-space: nowrap;
              display: flex;
              align-items: center;
              gap: 4px;
            ">
              <span style="display:inline-block; width:6px; height:6px; border-radius:50%; background:#E8A33D;"></span>
              Exact Pin: ${singleListing.title.slice(0, 18)}...
            </div>
          `,
          iconSize: [120, 30],
          iconAnchor: [60, 15],
        });

        const marker = L.marker([singleListing.gps_lat, singleListing.gps_lng], {
          icon: exactIcon,
        }).addTo(map);

        marker.bindPopup(`
          <div style="font-family: system-ui; padding: 4px;">
            <b style="color: #1B4332; font-size: 12px;">✅ Exact Landmark</b>
            <p style="font-size: 11px; margin-top: 2px; color: #2B2118;">${singleListing.exact_landmark || singleListing.area}</p>
          </div>
        `).openPopup();
      }
    } else {
      // Multiple listings view (Browse mode)
      const bounds = L.latLngBounds([]);

      listings.forEach((listing) => {
        if (!listing.gps_lat || !listing.gps_lng) return;

        const isItemUnlocked = isUnlockedBySeeker(listing.id, currentUser.id);
        const priceLabel =
          listing.price >= 1000
            ? `KSh ${(listing.price / 1000).toFixed(listing.price % 1000 !== 0 ? 1 : 0)}k`
            : `KSh ${listing.price}`;

        const bgCol = isItemUnlocked ? '#1B4332' : '#C1440E';

        const customIcon = L.divIcon({
          className: 'custom-map-price-marker',
          html: `
            <div style="
              background-color: ${bgCol};
              color: #FBF3E7;
              padding: 4px 8px;
              border-radius: 12px;
              font-weight: 800;
              font-size: 11px;
              border: 2px solid #FFFFFF;
              box-shadow: 0 4px 10px rgba(0,0,0,0.25);
              white-space: nowrap;
              cursor: pointer;
              transition: transform 0.15s ease;
              text-align: center;
            ">
              ${priceLabel}
            </div>
          `,
          iconSize: [70, 28],
          iconAnchor: [35, 14],
        });

        const marker = L.marker([listing.gps_lat, listing.gps_lng], {
          icon: customIcon,
        }).addTo(map);

        // Click popup
        const container = document.createElement('div');
        container.style.fontFamily = 'system-ui, sans-serif';
        container.style.width = '190px';
        container.innerHTML = `
          <div style="font-weight: 800; font-size: 12px; color: #2B2118; margin-bottom: 2px; line-height: 1.2;">
            ${listing.title}
          </div>
          <div style="font-weight: 700; color: #C1440E; font-size: 11px; margin-bottom: 4px;">
            KSh ${listing.price.toLocaleString()} / ${listing.price_period}
          </div>
          <div style="font-size: 10px; color: #666; margin-bottom: 6px;">
            📍 ${listing.area}
          </div>
          <button
            id="map-btn-view-${listing.id}"
            style="
              width: 100%;
              padding: 5px 8px;
              background-color: #C1440E;
              color: white;
              border: none;
              border-radius: 8px;
              font-size: 11px;
              font-weight: bold;
              cursor: pointer;
            "
          >
            ${isItemUnlocked ? 'View Unlocked Keja' : `Unlock for KSh ${listing.unlock_price}`}
          </button>
        `;

        marker.bindPopup(container);

        marker.on('popupopen', () => {
          const btn = document.getElementById(`map-btn-view-${listing.id}`);
          if (btn) {
            btn.onclick = () => {
              if (onSelectListing) {
                onSelectListing(listing.id);
              } else {
                openListingDetail(listing.id);
              }
            };
          }
        });

        bounds.extend([listing.gps_lat, listing.gps_lng]);
      });

      if (listings.length > 0 && bounds.isValid()) {
        map.fitBounds(bounds, { padding: [30, 30], maxZoom: 14 });
      }
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [listings, singleListing, isLocked, currentUser.id]);

  return (
    <div className="relative w-full h-full rounded-3xl overflow-hidden border border-[#2B2118]/15 shadow-inner">
      <div ref={mapContainerRef} className="w-full h-full min-h-[380px]" />
    </div>
  );
};
