import { Link } from "react-router-dom";

const EXTERNAL_URL = /^(?:https?:)?\/\//i;
const NATIVE_PROTOCOL = /^(?:mailto:|tel:)/i;
const PDF_DOCUMENT = /\.pdf(?:[?#].*)?$/i;

function needsNativeNavigation(href) {
  return (
    EXTERNAL_URL.test(href) ||
    NATIVE_PROTOCOL.test(href) ||
    PDF_DOCUMENT.test(href)
  );
}

export default function SiteLink({ href = "/", children, target, rel, ...props }) {
  const destination = String(href || "/").trim() || "/";

  if (needsNativeNavigation(destination)) {
    const opensNewTab = EXTERNAL_URL.test(destination) || PDF_DOCUMENT.test(destination);

    return (
      <a
        href={destination}
        target={target ?? (opensNewTab ? "_blank" : undefined)}
        rel={rel ?? (opensNewTab ? "noreferrer" : undefined)}
        {...props}
      >
        {children}
      </a>
    );
  }

  return (
    <Link to={destination} {...props}>
      {children}
    </Link>
  );
}
