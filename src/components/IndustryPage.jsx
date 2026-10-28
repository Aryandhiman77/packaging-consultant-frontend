import { Navigate, useParams } from "react-router-dom";
import ContentDocument from "./ContentDocument";
import Footer from "./Footer";
import HeaderHero from "./HeaderHero";
import { industriesBySlug } from "../data/industries";

export default function IndustryPage() {
  const { slug } = useParams();
  const industry = slug ? industriesBySlug[slug] : null;

  if (!industry) return <Navigate to="/" replace />;

  return (
    <div className="page-shell">
      <HeaderHero compact />
      <ContentDocument
        lead={industry.intro[0]}
        intro={industry.intro.slice(1)}
        sections={industry.sections}
        body={industry.body}
        links={industry.links}
      />
      <Footer />
    </div>
  );
}
