import { navigation as defaultNavigation } from "./navigation.js";

const requiredSections = ["Projects", "About Us", "Project Review"];

function validItem(item) {
  return (
    item && typeof item.label === "string" && typeof item.link === "string"
  );
}

function linkPath(link) {
  try {
    return new URL(
      link,
      "https://packagingconsultantsusa.com",
    ).pathname.replace(/\/$/, "");
  } catch {
    return link;
  }
}

export function resolveNavigation(payload) {
  const provided = payload?.data?.topNavigation ?? payload?.topNavigation;

  const menu = Array.isArray(provided)
    ? provided.filter(validItem).map((item) => ({
        ...item,
        children: Array.isArray(item.children)
          ? item.children.filter(validItem)
          : [],
      }))
    : [];

  if (!menu.length) return defaultNavigation;

  for (const label of requiredSections) {
    const defaults = defaultNavigation.find((item) => item.label === label);

    const index = menu.findIndex(
      (item) => item.label.trim().toLowerCase() === label.toLowerCase(),
    );

    if (index === -1) {
      menu.push(defaults);
      continue;
    }

    const existing = menu[index];

    const upgradedChildren = existing.children.map((child) => {
      const defaultChild = defaults.children.find(
        (candidate) =>
          candidate.label.trim().toLowerCase() ===
          child.label.trim().toLowerCase(),
      );

      return defaultChild && child.link.startsWith("#")
        ? { ...child, link: defaultChild.link }
        : child;
    });

    const paths = new Set(
      upgradedChildren.map((child) => linkPath(child.link)),
    );

    const missing = defaults.children.filter(
      (child) => !paths.has(linkPath(child.link)),
    );

    menu[index] = {
      ...existing,
      link:
        label === "About Us" && existing.link.startsWith("#")
          ? defaults.link
          : existing.link,
      children: [...upgradedChildren, ...missing],
    };
  }

  return menu;
}
