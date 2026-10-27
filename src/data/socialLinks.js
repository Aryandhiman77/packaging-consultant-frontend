export const defaultSocialLinks = {
  x: "#social-x",
  facebook: "#social-facebook",
  youtube: "#social-youtube",
  linkedin: "#social-linkedin",
};

export function resolveSocialLinks(payload) {
  const provided = payload?.data?.socialLinks ?? payload?.socialLinks;

  if (!provided || typeof provided !== "object") {
    return defaultSocialLinks;
  }

  return Object.fromEntries(
    Object.entries(defaultSocialLinks).map(([platform, fallback]) => [
      platform,
      typeof provided[platform] === "string" && provided[platform].trim()
        ? provided[platform].trim()
        : fallback,
    ]),
  );
}

export function externalLinkProps(href) {
  return /^https?:\/\//i.test(href)
    ? { target: "_blank", rel: "noreferrer" }
    : {};
}
