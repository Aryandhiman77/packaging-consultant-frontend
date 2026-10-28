import { Navigate, useParams } from "react-router-dom";
import ContentDocument from "./ContentDocument";
import Footer from "./Footer";
import HeaderHero from "./HeaderHero";
import { aboutUsBySlug } from "../data/aboutUs";

export default function AboutUsPage() {
  const { slug } = useParams();
  const page = slug ? aboutUsBySlug[slug] : null;

  if (!page) {
    return <Navigate to="/about-us/consulting-approach" replace />;
  }

  return (
    <div className="page-shell">
      <HeaderHero compact />
      <ContentDocument
        lead={page.lead}
        intro={page.intro}
        callout={page.callout}
        sections={page.sections}
        closingLead={page.closingLead}
        closing={page.closing}
        links={page.links}
      />
      <Footer />
    </div>
  );
}
