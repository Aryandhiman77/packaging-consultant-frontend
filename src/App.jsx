import { useEffect } from "react";

import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";

import AdminLayout from "./admin/AdminLayout";
import AdminDashboard from "./admin/AdminDashboard";
import AdminLogin from "./admin/AdminLogin";
import RequireAdmin from "./admin/RequireAdmin";
import ProjectReviews from "./admin/ProjectReviews";
import ProjectReviewDetail from "./admin/ProjectReviewDetail";
import NavigationSettings from "./admin/NavigationSettings";

import ArtTemplatesPage from "./components/ArtTemplatesPage";
import AboutUsPage from "./components/AboutUsPage";
import Footer from "./components/Footer";
import HeaderHero from "./components/HeaderHero";
import IndustryPage from "./components/IndustryPage";
import MainContent from "./components/MainContent";
import PackagingServicePage from "./components/PackagingServicePage";
import ProjectPage from "./components/ProjectPage";
import ProjectReviewPage from "./components/ProjectReviewPage";

function PublicSite() {
  return (
    <div className="page-shell">
      <HeaderHero />
      <MainContent />
      <Footer />
    </div>
  );
}

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "auto",
    });
  }, [pathname]);

  return null;
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />

      <Routes>
        {/* ADMIN LOGIN */}
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* PROTECTED ADMIN */}
        <Route
          path="/admin"
          element={
            <RequireAdmin>
              <AdminLayout />
            </RequireAdmin>
          }
        >
          <Route index element={<AdminDashboard />} />

          <Route path="settings" element={<NavigationSettings />} />

          <Route path="project-reviews" element={<ProjectReviews />} />

          <Route path="project-reviews/:id" element={<ProjectReviewDetail />} />
        </Route>

        {/* PUBLIC PAGES */}
        <Route
          path="/packaging-services"
          element={
            <Navigate to="/packaging-services/packaging-development" replace />
          }
        />

        <Route
          path="/projects"
          element={<Navigate to="/projects/packaging-starts-here" replace />}
        />

        <Route
          path="/project-review"
          element={<Navigate to="/project-review/starting-point" replace />}
        />

        <Route
          path="/industries"
          element={<Navigate to="/industries/food-beverage" replace />}
        />

        <Route
          path="/about-us"
          element={<Navigate to="/about-us/consulting-approach" replace />}
        />

        <Route
          path="/packaging-services/art-templates"
          element={<ArtTemplatesPage />}
        />

        <Route
          path="/packaging-services/:slug"
          element={<PackagingServicePage />}
        />

        <Route path="/industries/:slug" element={<IndustryPage />} />

        <Route path="/projects/:slug" element={<ProjectPage />} />

        <Route path="/about-us/:slug" element={<AboutUsPage />} />

        <Route path="/project-review/:slug" element={<ProjectReviewPage />} />

        <Route path="/" element={<PublicSite />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
