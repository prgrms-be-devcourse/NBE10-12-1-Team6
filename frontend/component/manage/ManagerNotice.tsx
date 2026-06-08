type ManagerNoticeProps = {
  message: string;
  tone?: "success" | "error";
  className?: string;
};

export default function ManagerNotice({
  message,
  tone = "success",
  className = "",
}: ManagerNoticeProps) {
  if (!message) {
    return null;
  }

  const toneClass =
    tone === "error"
      ? "bg-[#ffdad6] text-[#93000a]"
      : "bg-[#1e3932]/10 text-[#1e3932]";

  return (
    <p
      className={`rounded-lg px-4 py-3 text-sm font-semibold ${toneClass} ${className}`}
    >
      {message}
    </p>
  );
}
