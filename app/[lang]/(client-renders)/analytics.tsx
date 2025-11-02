"use client";

import { Analytics } from "@vercel/analytics/next";
import { useEffect, useState } from "react";

export default function ClientAnalytics() {
  const [cookiesAccepted, setCookiesAccepted] = useState<boolean>(false);

  useEffect(() => {
    const accepted = localStorage.getItem("cookie-consent");
    if (accepted === "false") {
      setCookiesAccepted(false);
    } else {
      setCookiesAccepted(true);
    }
  }, []);
  
  if (!cookiesAccepted) {
    return (
      <div className="hidden" id="cookies-rejected">Cookies rejected.</div>
    );
  }

  return (
    <Analytics />
  );
}