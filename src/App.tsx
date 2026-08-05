import { lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
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

export default function App() {
  return (
    <StoreProvider>
      <BrowserRouter>
        <Suspense
          fallback={
            <div className="app">
              <div className="main">
                <p className="sub">加载中…</p>
              </div>
            </div>
          }
        >
          <Routes>
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
        </Suspense>
      </BrowserRouter>
    </StoreProvider>
  );
}
