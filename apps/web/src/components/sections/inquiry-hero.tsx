import type { PagebuilderType } from "@/types";

type InquiryHeroProps = PagebuilderType<"inquiryHero">;

type ContactInfo = NonNullable<InquiryHeroProps["contactInfo"]>[number];

export function InquiryHero({
  eyebrow,
  title,
  subtitle,
  contactInfo,
}: InquiryHeroProps) {
  return (
    <section className="relative overflow-hidden py-20 md:py-32 bg-white dark:bg-[#0a0a0a]">
      <div className="container relative z-10 mx-auto px-4 md:px-6">
        <div className="mx-auto max-w-3xl text-center">
          {eyebrow && (
            <span className="mb-4 inline-block text-sm font-medium uppercase tracking-wider text-foreground">
              {eyebrow}
            </span>
          )}
          <h1 className="mb-6 text-4xl font-semibold leading-tight text-gray-900 dark:text-white md:text-6xl">
            {title}
          </h1>
          {subtitle && (
            <p className="mb-8 text-lg text-gray-600 dark:text-muted-foreground md:text-xl">
              {subtitle}
            </p>
          )}
          {contactInfo && contactInfo.length > 0 && (
            <div className="mt-8 flex flex-col items-center gap-4">
              {contactInfo.map((info, index) => (
                <ContactItem key={index} info={info} />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function ContactItem({ info }: { info: ContactInfo }) {
  return (
    <div className="flex items-center gap-3 text-muted-foreground">
      <span className="font-medium">{info?.label}:</span>
      <span>{info?.value}</span>
    </div>
  );
}
