"use client";

import { useEffect, useState } from "react";

// Blocked country codes
const BLOCKED_COUNTRIES = ["IL"]; // Israel

export function IsraelBlocker() {
  const [blocked, setBlocked] = useState(false);

  useEffect(() => {
    // Check Cloudflare country header (passed to client)
    const checkCountry = async () => {
      try {
        // Method 1: Try Cloudflare's trace endpoint (free, no auth)
        const response = await fetch("https://1.1.1.1/cdn-cgi/trace", {
          method: "GET",
        });
        const text = await response.text();
        const countryMatch = text.match(/loc=(\w+)/);
        const country = countryMatch?.[1];

        if (country && BLOCKED_COUNTRIES.includes(country)) {
          setBlocked(true);
          return;
        }
      } catch {
        // Fallback to ipapi
        try {
          const res = await fetch("https://ipapi.co/country/", {
            // Cache for 1 hour to avoid rate limits
            cache: "force-cache",
          });
          const country = await res.text();
          if (BLOCKED_COUNTRIES.includes(country.trim())) {
            setBlocked(true);
          }
        } catch {
          // Fail open - don't block if we can't detect
        }
      }
    };

    checkCountry();
  }, []);

  if (blocked) {
    return (
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "#000",
          color: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 99999,
          fontSize: "24px",
          fontWeight: "bold",
        }}
      >
        Access denied from your region.
      </div>
    );
  }

  return null;
}
