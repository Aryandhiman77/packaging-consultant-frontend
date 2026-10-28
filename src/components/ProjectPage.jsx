import { Link, Navigate, useParams } from "react-router-dom";
import ContentDocument from "./ContentDocument";
import Footer from "./Footer";
import HeaderHero from "./HeaderHero";
import { projectsBySlug } from "../data/projects";

const startingPointPaths = [
  "/projects/product-no-packaging",
  "/projects/packaging-and-product",
  "/projects/redesign-maintaining-brand",
  "/projects/sourcing-manufacturing",
  "/projects/packaging-problems",
  "/projects/cost-supply-quality",
];

export default function ProjectPage() {
  const { slug } = useParams();
  const project = slug ? projectsBySlug[slug] : null;

  if (!project) return <Navigate to="/" replace />;

  return (
    <div className="page-shell">
      <HeaderHero compact />
      <ContentDocument
        lead={project.intro[0]}
        intro={project.intro.slice(1)}
        sections={project.groups}
        body={project.body}
        links={project.links}
        renderItems={(group) =>
          project.slug === "packaging-starts-here" ? (
            <ul className="mt-4 list-disc space-y-2 pl-8 text-[clamp(.98rem,1.16vw,1.14rem)] leading-[1.45] marker:text-black">
              {group.items.map((item, index) => (
                <li key={item} className="pl-1">
                  <Link
                    to={startingPointPaths[index]}
                    className="font-bold !text-[#c91e31] underline underline-offset-2"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <ul className="mt-4 list-disc space-y-1.5 pl-8 text-[clamp(.98rem,1.16vw,1.14rem)] leading-[1.45] marker:text-black">
              {group.items.map((item) => (
                <li key={item} className="pl-1">
                  {item}
                </li>
              ))}
            </ul>
          )
        }
      />
      <Footer />
    </div>
  );
}
