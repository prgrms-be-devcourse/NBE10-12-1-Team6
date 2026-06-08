type ManagerPageHeaderProps = {
  eyebrow?: string;
  title: string;
  description: string;
};

export default function ManagerPageHeader({
  eyebrow = "Admin",
  title,
  description,
}: ManagerPageHeaderProps) {
  return (
    <header className="mb-10">
      <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-[#7d562d]">
        {eyebrow}
      </p>
      <h1 className="text-3xl font-bold leading-tight text-[#130805] md:text-4xl">
        {title}
      </h1>
      <p className="mt-3 max-w-2xl leading-7 text-[#4f4542]">
        {description}
      </p>
    </header>
  );
}
