import type { ChangeEvent } from "react";
import KakaoAddressSearchButton from "../KakaoAddressSearchButton";
import type { DeliveryFormState } from "./types";

type DeliveryFormProps = {
  form: DeliveryFormState;
  onChange: (
    field: keyof DeliveryFormState,
  ) => (event: ChangeEvent<HTMLInputElement>) => void;
  onAddressSelect: (address: Pick<
    DeliveryFormState,
    "zipCode" | "address1" | "address2"
  >) => void;
};

const inputClassName =
  "h-12 w-full rounded-lg border border-[#d2c3bf] bg-[#faf9f5] px-4 outline-none transition-all focus:border-[#7d562d] focus:ring-2 focus:ring-[#ffca98]";
const addressInputClassName =
  "h-12 w-full cursor-not-allowed rounded-lg border border-[#d2c3bf] bg-[#eee9e2] px-4 text-[#4f4542] outline-none transition-all placeholder:text-[#9b8f8b] focus:border-[#d2c3bf] focus:ring-0";

export default function DeliveryForm({
  form,
  onChange,
  onAddressSelect,
}: DeliveryFormProps) {
  return (
    <section className="rounded-xl border border-[#d2c3bf]/50 bg-white p-6 md:p-8">
      <h2 className="mb-8 text-2xl font-semibold text-[#130805]">배송 정보</h2>

      <div className="grid grid-cols-1 gap-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <label className="space-y-2">
            <span className="block text-sm font-semibold text-[#4f4542]">
              받는 분 성함
            </span>
            <input
              value={form.recipientName}
              onChange={onChange("recipientName")}
              className={inputClassName}
              placeholder="이름을 입력하세요"
              type="text"
            />
          </label>
          <label className="space-y-2">
            <span className="block text-sm font-semibold text-[#4f4542]">
              연락처
            </span>
            <input
              value={form.phone}
              onChange={onChange("phone")}
              className={inputClassName}
              placeholder="010-0000-0000"
              type="tel"
            />
          </label>
        </div>

        <label className="space-y-2">
          <span className="block text-sm font-semibold text-[#4f4542]">
            이메일
          </span>
          <input
            value={form.email}
            onChange={onChange("email")}
            className={inputClassName}
            placeholder="example@artisan.coffee"
            type="email"
          />
        </label>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-[1fr_auto]">
          <label className="space-y-2">
            <span className="block text-sm font-semibold text-[#4f4542]">
              우편번호
            </span>
            <input
              value={form.zipCode}
              readOnly
              className={addressInputClassName}
              placeholder="주소 찾기를 눌러 입력하세요"
              type="text"
            />
          </label>
          <div className="flex items-end">
            <KakaoAddressSearchButton onSelect={onAddressSelect} />
          </div>
        </div>

        <label className="space-y-2">
          <span className="block text-sm font-semibold text-[#4f4542]">
            기본 주소
          </span>
          <input
            value={form.address1}
            readOnly
            className={addressInputClassName}
            placeholder="주소 찾기를 눌러 입력하세요"
            type="text"
          />
        </label>

        <label className="space-y-2">
          <span className="block text-sm font-semibold text-[#4f4542]">
            상세 주소
          </span>
          <input
            value={form.address2}
            onChange={onChange("address2")}
            className={inputClassName}
            placeholder="나머지 주소를 입력하세요"
            type="text"
          />
        </label>
      </div>
    </section>
  );
}
