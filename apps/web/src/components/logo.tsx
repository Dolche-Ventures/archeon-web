import Image from "next/image";
import Link from "next/link";

import type { Maybe, SanityImageProps } from "@/types";
import { SanityImage } from "./elements/sanity-image";

const LOGO_URL =
  "https://cdn.sanity.io/images/s6kuy1ts/production/68c438f68264717e93c7ba1e85f1d0c4b58b33c2-1200x621.svg";

type LogoProps = {
  src?: Maybe<string>;
  image?: Maybe<SanityImageProps>;
  alt?: Maybe<string>;
  priority?: boolean;
};

export function Logo({
  src,
  alt = "logo",
  image,
  priority = true,
}: LogoProps) {
  return (
    <Link href="/" className="inline-flex items-center transition-transform duration-200 hover:scale-105">
      {image ? (
        <div className="max-h-12 max-w-[180px]">
          <SanityImage
            alt={alt ?? "logo"}
            className="h-auto w-auto max-h-12 max-w-[180px] object-contain dark:invert"
            decoding="sync"
            image={image}
            loading="eager"
          />
        </div>
      ) : (
        <Image
          alt={alt ?? "logo"}
          className="h-auto w-auto max-h-12 max-w-[180px] object-contain dark:invert"
          decoding="sync"
          height={40}
          loading="eager"
          priority={priority}
          src={src ?? LOGO_URL}
          width={120}
        />
      )}
    </Link>
  );
}