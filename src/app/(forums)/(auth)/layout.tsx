"use client";

import Breadcrumb from "@/components/forums/Breadcrumb";
import { Card } from "@/components/ui/card";
import { usePreventRoute } from "@/hooks/usePreventRoute";
import { useAuthStore } from "@/lib/store/authStore";
import React from "react";
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const preventRoute = usePreventRoute();
  const { cardDisableStatus, authTitle } = useAuthStore();

  if (preventRoute) return preventRoute;
  return (
    <GoogleReCaptchaProvider
      reCaptchaKey={process.env.NEXT_PUBLIC_GOOGLE_RECAPTCHA_V3_SITE_KEY || ""}
    >
      <Breadcrumb title={authTitle} />
      <Card
        className={`w-[90%] lg:w-[30%] mx-auto my-10 ${
          cardDisableStatus && "pointer-events-none opacity-50"
        }`}
      >
        {children}
      </Card>
    </GoogleReCaptchaProvider>
  );
}
