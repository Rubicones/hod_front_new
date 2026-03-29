import { getRequestConfig } from "next-intl/server";

export default getRequestConfig(async ({ locale }) => {
  const supported = ["en", "ru"] as const;
  const normalizedLocale = supported.includes(
    (locale ?? "en") as (typeof supported)[number],
  )
    ? (locale ?? "en")
    : "en";

  const messages = (await import(`../messages/${normalizedLocale}.json`))
    .default;

  return {
    locale: normalizedLocale,
    messages,
  };
});

