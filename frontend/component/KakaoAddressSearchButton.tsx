"use client";

import Script from "next/script";
import { useState } from "react";

type KakaoPostcodeData = {
  zonecode: string;
  roadAddress: string;
  jibunAddress: string;
  buildingName?: string;
  apartment?: string;
};

type KakaoAddressSearchButtonProps = {
  onSelect: (address: {
    zipCode: string;
    address1: string;
    address2: string;
  }) => void;
};

declare global {
  interface Window {
    daum?: {
      Postcode: new (options: {
        oncomplete: (data: KakaoPostcodeData) => void;
      }) => {
        open: () => void;
      };
    };
  }
}

const hasPostcode = () =>
  typeof window !== "undefined" && Boolean(window.daum?.Postcode);

export default function KakaoAddressSearchButton({
  onSelect,
}: KakaoAddressSearchButtonProps) {
  const [isScriptReady, setIsScriptReady] = useState(hasPostcode);

  const handleScriptReady = () => {
    setIsScriptReady(hasPostcode());
  };

  const handleOpenPostcode = () => {
    if (!window.daum?.Postcode) {
      setIsScriptReady(false);
      return;
    }

    new window.daum.Postcode({
      oncomplete: (data) => {
        const address = data.roadAddress || data.jibunAddress;

        onSelect({
          zipCode: data.zonecode,
          address1: address,
          address2: "",
        });
      },
    }).open();
  };

  return (
    <>
      <Script
        src="https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js"
        strategy="afterInteractive"
        onLoad={handleScriptReady}
        onReady={handleScriptReady}
      />
      <button
        type="button"
        onClick={handleOpenPostcode}
        disabled={!isScriptReady}
        className="h-12 whitespace-nowrap rounded-lg bg-[#130805] px-5 text-sm font-semibold text-white shadow-sm shadow-[#130805]/10 transition-colors hover:bg-[#7d562d] disabled:cursor-not-allowed disabled:bg-[#e3e2df] disabled:text-[#817471]"
      >
        주소 찾기
      </button>
    </>
  );
}
