"use client";

import { useEffect, useState } from "react";
import Script from "next/script";

export default function GoogleAds() {
    const [consentGiven, setConsentGiven] = useState(false);

    useEffect(() => {
        // Check initial consent
        const checkConsent = () => {
            const consent = localStorage.getItem("cookieConsent");
            setConsentGiven(consent === "true");
        };

        checkConsent();

        // Listen for updates
        window.addEventListener("cookie_consent_updated", checkConsent);

        return () => {
            window.removeEventListener("cookie_consent_updated", checkConsent);
        };
    }, []);

    if (!consentGiven) return null;

    return (
        <Script
            async
            src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2773187784082106"
            crossOrigin="anonymous"
            strategy="afterInteractive"
        />
    );
}
