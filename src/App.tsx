import { lazy, useEffect } from "react";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import Layout from "./components/Layout";
import PageError from "./components/PageError";
import { StoreProvider } from "./lib/store";

const HomePage = lazy(() => import("./pages/HomePage"));
const StudyPage = lazy(() => import("./pages/StudyPage"));
const TutorPage = lazy(() => import("./pages/TutorPage"));
const BlogPage = lazy(() => import("./pages/BlogPage"));
const PostPage = lazy(() => import("./pages/PostPage"));
const RecipesPage = lazy(() => import("./pages/RecipesPage"));
const KnowledgePage = lazy(() => import("./pages/KnowledgePage"));
const ResumePage = lazy(() => import("./pages/ResumePage"));
const SettingsPage = lazy(() => import("./pages/SettingsPage"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage"));

// 首屏渲染完成后预加载所有页面 chunk，切换时不再等待下载
function PrefetchRoutes() {
  useEffect(() => {
    const load = () => {
      void import("./pages/HomePage");
      void import("./pages/StudyPage");
      void import("./pages/TutorPage");
      void import("./pages/BlogPage");
      void import("./pages/PostPage");
      void import("./pages/RecipesPage");
      void import("./pages/KnowledgePage");
      void import("./pages/ResumePage");
      void import("./pages/SettingsPage");
      void import("./pages/NotFoundPage");
    };
    const t = window.setTimeout(load, 2500);
    return () => window.clearTimeout(t);
  }, []);
  return null;
}

function Routed() {
  const location = useLocation();
  return (
    <PageError key={location.pathname}>
      <Routes location={location}>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/study" element={<StudyPage />} />
          <Route path="/tutor" element={<TutorPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/blog/:slug" element={<PostPage />} />
          <Route path="/recipes" element={<RecipesPage />} />
          <Route path="/knowledge" element={<KnowledgePage />} />
          <Route path="/resume" element={<ResumePage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </PageError>
  );
}

export default function App() {
  return (
    <StoreProvider>
      <BrowserRouter>
        <PrefetchRoutes />
        <Routed />
      </BrowserRouter>
    </StoreProvider>
  );
}
