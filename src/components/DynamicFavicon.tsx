'use client';

import { useEffect } from 'react';

export default function DynamicFavicon() {
  useEffect(() => {
    const fetchFavicon = async () => {
      try {
        const response = await fetch('/api/favicon');
        if (response.ok) {
          const data = await response.json();
          if (data.faviconUrl) {
            // Remove existing favicon links
            const existingLinks = document.querySelectorAll("link[rel*='icon']");
            existingLinks.forEach(link => link.remove());

            // Add new favicon links
            const link32 = document.createElement('link');
            link32.rel = 'icon';
            link32.type = 'image/png';
            link32.sizes = '32x32';
            link32.href = data.faviconUrl;
            document.head.appendChild(link32);

            const link16 = document.createElement('link');
            link16.rel = 'icon';
            link16.type = 'image/png';
            link16.sizes = '16x16';
            link16.href = data.faviconUrl;
            document.head.appendChild(link16);

            const appleLink = document.createElement('link');
            appleLink.rel = 'apple-touch-icon';
            appleLink.sizes = '180x180';
            appleLink.href = data.faviconUrl;
            document.head.appendChild(appleLink);
          }
        }
      } catch (error) {
        console.error('Error fetching favicon:', error);
      }
    };

    fetchFavicon();
  }, []);

  return null;
}
