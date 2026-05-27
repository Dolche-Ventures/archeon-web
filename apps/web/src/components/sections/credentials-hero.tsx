import type { PagebuilderType } from "@/types";

type CredentialsHeroProps = PagebuilderType<"credentialsHero">;

type Stat = NonNullable<CredentialsHeroProps["stats"]>[number];

export function CredentialsHero({
  eyebrow,
  title,
  subtitle,
  stats,
}: CredentialsHeroProps) {
  return (
    <section className="relative overflow-hidden py-20 md:py-32">
      <div className="container relative z-10 mx-auto px-4 md:px-6">
        <div className="mx-auto max-w-3xl text-center">
          {eyebrow && (
            <span className="mb-4 inline-block text-sm font-medium uppercase tracking-wider text-foreground">
              {eyebrow}
            </span>
          )}
          <h1 className="mb-6 text-4xl font-semibold leading-tight md:text-6xl">
            {title}
          </h1>
          {subtitle && (
            <p className="mb-8 text-lg text-muted-foreground md:text-xl">
              {subtitle}
            </p>
          )}
        </div>
        {stats && stats.length > 0 && (
          <div className="mt-12 grid grid-cols-2 gap-8 md:grid-cols-4">
            {stats.map((stat, index) => (
              <StatItem key={index} stat={stat} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function StatItem({ stat }: { stat: Stat }) {
  return (
    <div className="text-center">
      <div className="text-3xl font-bold text-foreground md:text-5xl">
        {stat?.number}
      </div>
      <div className="mt-2 text-sm text-muted-foreground md:text-base">
        {stat?.label}
      </div>
    </div>
  );
}
