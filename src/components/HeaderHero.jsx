import { useEffect, useState } from "react";
import {
  FaFacebookF,
  FaLinkedinIn,
  FaXTwitter,
  FaYoutube,
} from "react-icons/fa6";
import { useApi } from "../context/ApiContext";
import { navigation as fallbackNavigation } from "../data/navigation";
import { resolveNavigation } from "../data/resolveNavigation";
import SiteLink from "./SiteLink";
import {
  defaultSocialLinks,
  externalLinkProps,
  resolveSocialLinks,
} from "../data/socialLinks";

const processImages = [
  ["/assets/hero/process-design.png", "Packaging artwork inspection"],
  ["/assets/hero/process-cylinder.png", "Printing cylinder production"],
  ["/assets/hero/process-production.png", "Packaging production line"],
  ["/assets/hero/process-printing.png", "Printed packaging rolls"],
  ["/assets/hero/process-port.png", "International container port"],
  ["/assets/hero/process-ship.png", "Ocean freight shipping"],
  ["/assets/hero/process-air.png", "Air freight delivery"],
];

function SocialLinks({ links, mobile = false }) {
  return (
    <div
      className={
        mobile
          ? "flex items-center justify-center gap-3 bg-white/[.035] px-[17px] py-[15px]"
          : "absolute right-[3.8%] bottom-[5.9%] z-[3] hidden items-center gap-[clamp(7px,.75vw,10px)] lg:flex"
      }
      aria-label="Social media links"
    >
      <a
        className="header-social header-social--x"
        href={links.x}
        {...externalLinkProps(links.x)}
        aria-label="X"
      >
        <FaXTwitter aria-hidden="true" />
      </a>
      <a
        className="header-social header-social--facebook"
        href={links.facebook}
        {...externalLinkProps(links.facebook)}
        aria-label="Facebook"
      >
        <FaFacebookF aria-hidden="true" />
      </a>
      <a
        className="header-social header-social--youtube"
        href={links.youtube}
        {...externalLinkProps(links.youtube)}
        aria-label="YouTube"
      >
        <FaYoutube aria-hidden="true" />
      </a>
      <a
        className="header-social header-social--linkedin"
        href={links.linkedin}
        {...externalLinkProps(links.linkedin)}
        aria-label="LinkedIn"
      >
        <FaLinkedinIn aria-hidden="true" />
      </a>
    </div>
  );
}

function DesktopNavigation({ items }) {
  const [activeMenu, setActiveMenu] = useState(null);

  return (
    <nav
      className="absolute bottom-[7.4%] left-[4.05%] z-[110] hidden items-stretch whitespace-nowrap bg-white/[.96] shadow-[0_0_0_1px_rgba(0,0,0,.06)] lg:flex"
      aria-label="Primary navigation"
    >
      {items.map((item) => {
        const itemKey = item._id || item.label;
        const hasChildren = item.children?.length > 0;
        const isOpen = activeMenu === itemKey;
        const label = (
          <>
            {item.label}
            {hasChildren && (
              <span className="text-[.78em]" aria-hidden="true">
                ▼
              </span>
            )}
          </>
        );
        return (
          <div
            className="relative border-r border-[#171717] last:border-r-0"
            key={itemKey}
            onMouseEnter={() => hasChildren && setActiveMenu(itemKey)}
            onMouseLeave={() => hasChildren && setActiveMenu(null)}
            onFocus={() => hasChildren && setActiveMenu(itemKey)}
            onBlur={(event) => {
              if (!event.currentTarget.contains(event.relatedTarget)) {
                setActiveMenu(null);
              }
            }}
          >
            {hasChildren ? (
              <button
                type="button"
                className="flex h-full items-center gap-[clamp(3px,.28vw,4px)] border-0 bg-transparent px-[clamp(7px,.72vw,10px)] pt-[clamp(3px,.28vw,4px)] pb-[clamp(3px,.25vw,4px)] font-sans text-[clamp(13px,1.3vw,17px)] leading-none text-[#111] transition-colors hover:bg-[#e8e4e0] focus-visible:bg-[#e8e4e0]"
                aria-haspopup="menu"
                aria-expanded={isOpen}
                aria-label={`${item.label} menu`}
              >
                {label}
              </button>
            ) : (
              <SiteLink
                className="flex h-full items-center gap-[clamp(3px,.28vw,4px)] px-[clamp(7px,.72vw,10px)] pt-[clamp(3px,.28vw,4px)] pb-[clamp(3px,.25vw,4px)] font-sans text-[clamp(13px,1.3vw,17px)] leading-none !text-[#111] no-underline transition-colors hover:bg-[#e8e4e0] focus-visible:bg-[#e8e4e0]"
                href={item.link}
              >
                {label}
              </SiteLink>
            )}

            {hasChildren && (
              <div
                className={`absolute top-full left-0 z-[120] min-w-[220px] max-w-[320px] border border-[#8f8b87] bg-white py-1.5 shadow-[0_12px_24px_rgba(0,0,0,.16)] transition-[opacity,transform,visibility] duration-150 ${isOpen ? "visible translate-y-0 opacity-100" : "invisible pointer-events-none translate-y-1 opacity-0"}`}
                role="menu"
              >
                {item.children.map((child) => (
                  <SiteLink
                    key={child._id || `${item.label}-${child.label}`}
                    href={child.link}
                    onClick={() => setActiveMenu(null)}
                    role="menuitem"
                    className="block whitespace-normal px-4 py-2.5 text-[clamp(12px,1vw,15px)] leading-[1.18] font-bold !text-[#171717] no-underline hover:bg-[#eeeae7] focus-visible:bg-[#eeeae7]"
                  >
                    {child.label}
                  </SiteLink>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </nav>
  );
}

function MobileNavigationLinks({ items, open, closeMenu }) {
  const [expanded, setExpanded] = useState({});

  return (
    <nav className="mx-auto w-full" aria-label="Mobile navigation">
      {items.map((item, index) => {
        const key = item._id || `${item.label}-${index}`;
        const hasChildren = item.children?.length > 0;
        const isExpanded = Boolean(expanded[key]);
        return (
          <div key={key} className="border-b border-white/[.12]">
            <div className="flex min-h-[52px] items-stretch">
              {hasChildren ? (
                <button
                  type="button"
                  className={`flex flex-1 items-center justify-between px-6 text-left text-[16px] font-bold text-white transition-[background-color,padding,opacity,transform] duration-300 hover:bg-white/[.09] hover:px-7 focus-visible:bg-white/[.09] focus-visible:px-7 ${open ? "translate-y-0 opacity-100" : "-translate-y-2 opacity-0"}`}
                  style={{
                    transitionDelay: open ? `${80 + index * 38}ms` : "0ms",
                  }}
                  onClick={() =>
                    setExpanded((current) => ({
                      ...current,
                      [key]: !current[key],
                    }))
                  }
                  aria-expanded={isExpanded}
                  aria-controls={`mobile-submenu-${key}`}
                  aria-label={`Toggle ${item.label} submenu`}
                >
                  <span>{item.label}</span>
                  <span
                    className={`text-2xl transition-transform duration-200 ${isExpanded ? "rotate-90" : ""}`}
                    aria-hidden="true"
                  >
                    ›
                  </span>
                </button>
              ) : (
                <SiteLink
                  className={`flex flex-1 items-center px-6 text-[16px] font-bold !text-white no-underline transition-[background-color,padding,opacity,transform] duration-300 hover:bg-white/[.09] hover:px-7 focus-visible:bg-white/[.09] focus-visible:px-7 ${open ? "translate-y-0 opacity-100" : "-translate-y-2 opacity-0"}`}
                  style={{
                    transitionDelay: open ? `${80 + index * 38}ms` : "0ms",
                  }}
                  href={item.link}
                  onClick={closeMenu}
                >
                  {item.label}
                </SiteLink>
              )}
            </div>
            {hasChildren && (
              <div
                id={`mobile-submenu-${key}`}
                className={`grid bg-black/25 transition-[grid-template-rows] duration-300 ease-out ${isExpanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
              >
                <div className="overflow-hidden" inert={!isExpanded}>
                  {item.children.map((child) => (
                    <SiteLink
                      key={child._id || `${key}-${child.label}`}
                      href={child.link}
                      onClick={closeMenu}
                      className="flex min-h-11 items-center border-t border-white/[.08] py-2 pr-5 pl-9 text-sm font-semibold !text-[#e9e3df] no-underline hover:bg-white/[.08]"
                    >
                      {child.label}
                    </SiteLink>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </nav>
  );
}

export default function HeaderHero({ compact = false }) {
  const { getPublicNavigation } = useApi();
  const [items, setItems] = useState(fallbackNavigation);
  const [socialLinks, setSocialLinks] = useState(defaultSocialLinks);
  const [open, setOpen] = useState(
    () => window.location.hash === "#mobile-menu",
  );

  useEffect(() => {
    let active = true;
    getPublicNavigation()
      .then((payload) => {
        if (active) {
          setItems(resolveNavigation(payload));
          setSocialLinks(resolveSocialLinks(payload));
        }
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, [getPublicNavigation]);

  return (
    <header
      className="hero relative z-[100] mx-auto w-full max-w-[100vw]"
      id="home"
    >
      <div
        className={`relative z-[5] grid h-24 w-full grid-cols-[52px_minmax(0,1fr)_clamp(72px,16vw,120px)] overflow-visible lg:block lg:h-[clamp(114px,12.68vw,162px)] ${compact ? "bg-[#e3e5e6]" : "bg-[url('/assets/hero/meeting.png')] bg-cover bg-top"}`}
      >
        {!compact && (
          <div
            className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(245,242,238,.92),rgba(226,235,239,.84))] backdrop-blur-[2px] lg:bg-[linear-gradient(90deg,rgba(245,242,238,.88),rgba(226,235,239,.74))]"
            aria-hidden="true"
          />
        )}

        <div className="relative z-[1] col-start-2 row-start-1 flex h-full min-w-0 flex-col justify-center overflow-hidden px-1.5 lg:absolute lg:left-[3.1%] lg:top-[9%] lg:block lg:h-auto lg:w-[73%] lg:overflow-visible lg:p-0">
          <p className="m-0 whitespace-nowrap font-serif text-[clamp(12px,3.7vw,30px)] leading-[.96] font-semibold tracking-[-.03em] text-[#f8f7f4] [-webkit-text-stroke:.6px_#181818] [font-variant:small-caps] [text-shadow:2px_2px_1px_rgba(0,0,0,.67),-1px_-1px_#fff] lg:text-[clamp(43px,5.25vw,67px)] lg:leading-[.91] lg:tracking-[.4px] lg:[-webkit-text-stroke:1px_#181818] lg:[text-shadow:3px_4px_2px_rgba(0,0,0,.72),-1px_-1px_#fff]">
            Packaging Consultants USA
          </p>
          <p className="mt-2 ml-0.5 text-[clamp(8.5px,2.2vw,13px)] leading-[1.08] font-black tracking-[-.2px] text-[#161616] italic [text-shadow:1px_1px_rgba(255,255,255,.78)] lg:mt-[clamp(6px,.55vw,8px)] lg:ml-[1.2%] lg:whitespace-nowrap lg:text-[clamp(18px,2.18vw,28px)] lg:leading-none lg:tracking-[-.7px]">
            Packaging Design, Manufacturing, Supply, and Launch Consulting
          </p>
        </div>

        <div className="hidden lg:absolute lg:top-[2.5%] lg:right-[4.2%] lg:flex lg:h-[58%] lg:w-[15%] lg:items-start lg:justify-end lg:overflow-visible">
          <img
            className="block h-full w-auto max-w-full object-contain object-top"
            src="/assets/site/header-mark-clean.png"
            alt="Packaging Consultants USA mark"
          />
        </div>

        <DesktopNavigation items={items} />
        <SocialLinks links={socialLinks} />

        <div className="relative z-10 col-start-1 row-start-1 flex h-full items-center justify-center lg:hidden">
          <button
            className="group grid h-9 w-10 shrink-0 place-items-center rounded-[3px] border border-white/[.18] bg-[linear-gradient(#29231f,#110f0d)] text-white shadow-[0_2px_5px_rgba(0,0,0,.25)] transition-[transform,background-color,box-shadow] duration-300 ease-out hover:bg-[#27211d] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white active:scale-95"
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close navigation" : "Open navigation"}
          >
            <span
              className="relative block h-[18px] w-[22px]"
              aria-hidden="true"
            >
              <i
                className={`absolute left-0 block h-0.5 w-full rounded-full bg-white transition-[top,transform] duration-300 ease-out ${open ? "top-2 rotate-45" : "top-0 rotate-0"}`}
              />
              <i
                className={`absolute top-2 left-0 block h-0.5 w-full rounded-full bg-white transition-[opacity,transform] duration-200 ease-out ${open ? "scale-x-0 opacity-0" : "scale-x-100 opacity-100"}`}
              />
              <i
                className={`absolute left-0 block h-0.5 w-full rounded-full bg-white transition-[top,transform] duration-300 ease-out ${open ? "top-2 -rotate-45" : "top-4 rotate-0"}`}
              />
            </span>
          </button>
        </div>

        <div className="relative z-10 col-start-3 row-start-1 flex h-full items-center justify-center lg:hidden">
          <span className="flex w-[clamp(66px,12vw,108px)] shrink-0 items-center justify-center overflow-visible">
            <img
              className="block h-auto w-full object-contain"
              src="/assets/site/header-mark-clean.png"
              alt="Packaging Consultants USA mark"
            />
          </span>
        </div>

        <div
          id="mobile-menu"
          aria-hidden={!open}
          className={`absolute top-full right-0 left-0 z-20 w-full origin-top overflow-y-auto border-y border-white/[.13] bg-[rgba(18,15,13,.975)] shadow-[0_20px_38px_rgba(0,0,0,.42)] backdrop-blur-md transition-[max-height,opacity,transform,visibility] duration-500 ease-[cubic-bezier(.22,1,.36,1)] lg:hidden ${open ? "visible max-h-[calc(100vh-96px)] translate-y-0 opacity-100 pointer-events-auto" : "invisible max-h-0 -translate-y-3 opacity-0 pointer-events-none"}`}
        >
          <MobileNavigationLinks
            items={items}
            open={open}
            closeMenu={() => setOpen(false)}
          />
          <SocialLinks links={socialLinks} mobile />
        </div>
      </div>

      {!compact && (
        <>
          <figure className="hero-stage">
            <img
              src="/assets/hero/meeting.png"
              alt="Packaging consultants reviewing product concepts with a client team"
            />
          </figure>

          <section
            className="hero-statement"
            aria-label="From concept to production"
          >
            <div className="hero-statement__together">Together</div>
            <div className="hero-statement__copy">
              <h1>How Can We Get Your Concept To Production?</h1>
              <p>
                Packaging design, prepress, sourcing, manufacturing, supply, and
                launch consulting.
              </p>
            </div>
          </section>

          <div
            className="process-strip"
            aria-label="Packaging production and delivery process"
          >
            {processImages.map(([src, alt]) => (
              <img key={src} src={src} alt={alt} />
            ))}
          </div>
        </>
      )}
    </header>
  );
}
