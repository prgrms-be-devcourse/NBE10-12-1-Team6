const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME || "Team6";

export default function Footer() {
  return (
    <footer className="border-t border-[#d2c3bf]/40 bg-[#e3e2df] px-5 py-12 md:px-16">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 md:flex-row">
        <div>
          <p className="font-bold text-[#130805]">{SITE_NAME}</p>
          <p className="mt-2 text-sm text-[#4f4542]">
            Fresh roasted coffee for everyday rituals.
          </p>
        </div>
        <div className="flex gap-6 text-sm font-medium text-[#4f4542]">
          <span>이용약관</span>
          <span>개인정보처리방침</span>
          <span>고객센터</span>
        </div>
      </div>
    </footer>
  );
}
