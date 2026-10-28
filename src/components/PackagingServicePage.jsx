import { Navigate, useParams } from "react-router-dom";
import ContentDocument from "./ContentDocument";
import Footer from "./Footer";
import HeaderHero from "./HeaderHero";
import { packagingServicesBySlug } from "../data/packagingServices";

export default function PackagingServicePage() {
  const { slug } = useParams();
  const service = slug ? packagingServicesBySlug[slug] : null;

  if (!service) return <Navigate to="/" replace />;

  return (
    <div className="page-shell">
      <HeaderHero compact />
      <ContentDocument
        title={service.title}
        intro={service.intro}
        sections={service.groups}
        body={service.body}
        links={service.links}
      />
      <Footer />
    </div>
  );
}
