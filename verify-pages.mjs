import { existsSync } from "node:fs";
import { projects } from "./src/data/projects.js";
import { projectReviewSteps } from "./src/data/projectReview.js";
import { packagingServices } from "./src/data/packagingServices.js";
import { industries } from "./src/data/industries.js";
import { navigation } from "./src/data/navigation.js";
import { resolveNavigation } from "./src/data/resolveNavigation.js";

const errors = [];

const groups = {
  projects,
  "project-review": projectReviewSteps,
  "packaging-services": packagingServices,
  industries,
};

const slugs = Object.fromEntries(
  Object.entries(groups).map(([key, pages]) => [
    key,
    new Set(pages.map((page) => page.slug)),
  ]),
);

function check(condition, message) {
  if (!condition) errors.push(message);
}

function linkExists(url) {
  if (!url) return false;

  if (
    url.startsWith("#") ||
    url.startsWith("mailto:") ||
    /^https?:\/\//.test(url)
  ) {
    return true;
  }

  const path = url.split("?")[0].split("#")[0];

  if (
    [
      "/",
      "/projects",
      "/project-review",
      "/industries",
      "/packaging-services",
    ].includes(path)
  ) {
    return true;
  }

  if (path === "/packaging-services/art-templates") {
    return true;
  }

  if (path.startsWith("/assets/")) {
    return existsSync(`public${path}`);
  }

  const [, section, slug] = path.split("/");

  return Boolean(slugs[section]?.has(slug));
}

check(projects.length === 7, "Projects must have 7 pages");
check(projectReviewSteps.length === 7, "Project Review must have 7 steps");

for (const [section, pages] of Object.entries(groups)) {
  check(slugs[section].size === pages.length, `Duplicate slug in ${section}`);

  for (const page of pages) {
    check(
      Boolean(page.title && page.intro?.length),
      `Missing content in ${section}/${page.slug}`,
    );

    for (const [label, url] of page.links || []) {
      check(linkExists(url), `Broken link: ${page.slug} / ${label}: ${url}`);
    }
  }
}

for (const item of navigation) {
  check(linkExists(item.link), `Invalid menu link: ${item.label}`);

  for (const child of item.children || []) {
    check(linkExists(child.link), `Invalid submenu link: ${child.label}`);
  }
}

for (const payload of [
  undefined,
  { topNavigation: [] },
  { topNavigation: [{ label: "Projects", link: "/projects", children: [] }] },
]) {
  const menu = resolveNavigation(payload);

  for (const label of ["Projects", "Project Review"]) {
    check(
      menu.find((item) => item.label === label)?.children?.length >= 7,
      `Missing ${label} submenu pages`,
    );
  }
}

const requiredAssets = [
  "public/assets/hero/meeting.png",
  "public/assets/site/brand-mark.png",
  "public/assets/site/footer-brand.png",
  "public/assets/site/header-mark-clean.png",
  "public/assets/templates/art-templates-choose-your-structure.pdf",
];

for (const file of requiredAssets) {
  check(existsSync(file), `Missing asset: ${file}`);
}

if (errors.length) {
  console.error("Verification failed:");
  errors.forEach((error) => console.error(`- ${error}`));
  process.exitCode = 1;
} else {
  console.log("PASS: Page counts, slugs, menu links and key assets checked.");
}
