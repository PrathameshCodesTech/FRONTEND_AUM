import React, { useEffect, useRef } from 'react';

const PropertyMap = ({ latitude, longitude, propertyName, address }) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);

  useEffect(() => {
    if (!latitude || !longitude || mapInstanceRef.current) return;

    const loadLeaflet = async () => {
      // Add Leaflet CSS
      if (!document.getElementById('leaflet-css')) {
        const link = document.createElement('link');
        link.id = 'leaflet-css';
        link.rel = 'stylesheet';
        link.href = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.css';
        document.head.appendChild(link);
      }

      // Load Leaflet JS
      if (!window.L) {
        await new Promise((resolve, reject) => {
          const script = document.createElement('script');
          script.src = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.js';
          script.onload = resolve;
          script.onerror = reject;
          document.head.appendChild(script);
        });
      }

      // Initialize map
      if (mapRef.current && !mapInstanceRef.current) {
        const L = window.L;
        
        const map = L.map(mapRef.current).setView([latitude, longitude], 15);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors',
          maxZoom: 19
        }).addTo(map);

        const customIcon = L.divIcon({
          className: 'custom-marker',
          html: `
            <div style="
              background: #2563eb;
              width: 40px;
              height: 40px;
              border-radius: 50% 50% 50% 0;
              transform: rotate(-45deg);
              border: 3px solid white;
              box-shadow: 0 3px 10px rgba(0,0,0,0.3);
              display: flex;
              align-items: center;
              justify-content: center;
            ">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="white" style="transform: rotate(45deg)">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
              </svg>
            </div>
          `,
          iconSize: [40, 40],
          iconAnchor: [20, 40],
          popupAnchor: [0, -40]
        });

        const marker = L.marker([latitude, longitude], { icon: customIcon }).addTo(map);
        
        marker.bindPopup(`
          <div style="font-family: system-ui, -apple-system, sans-serif; min-width: 200px;">
            <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: 600; color: #1f2937;">
              ${propertyName}
            </h3>
            <p style="margin: 0; font-size: 13px; color: #6b7280; line-height: 1.4;">
              ${address}
            </p>
            <a 
              href="https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}" 
              target="_blank"
              rel="noopener noreferrer"
              style="
                display: inline-block;
                margin-top: 8px;
                padding: 6px 12px;
                background: #2563eb;
                color: white;
                text-decoration: none;
                border-radius: 4px;
                font-size: 12px;
                font-weight: 500;
              "
            >
              Get Directions
            </a>
          </div>
        `).openPopup();

        mapInstanceRef.current = map;
      }
    };

    loadLeaflet().catch(console.error);

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [latitude, longitude, propertyName, address]);

  if (!latitude || !longitude) {
    return (
      <div className="map-placeholder">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
          <path d="M21 10C21 17 12 23 12 23C12 23 3 17 3 10C3 7.61305 3.94821 5.32387 5.63604 3.63604C7.32387 1.94821 9.61305 1 12 1C14.3869 1 16.6761 1.94821 18.364 3.63604C20.0518 5.32387 21 7.61305 21 10Z" stroke="currentColor" strokeWidth="2" />
          <circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="2" />
        </svg>
        <p>Location coordinates not available</p>
      </div>
    );
  }

  return (
    <div className="property-map-container">
      <div ref={mapRef} className="property-map" />
    </div>
  );
};

export default PropertyMap;