import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import { StoreProvider } from "./lib/store";
import BlogPage from "./pages/BlogPage";
import HomePage from "./pages/HomePage";
import KnowledgePage from "./pages/KnowledgePage";
import NotFoundPage from "./pages/NotFoundPage";
import PostPage from "./pages/PostPage";
import RecipesPage from "./pages/RecipesPage";
import ResumePage from "./pages/ResumePage";
import SettingsPage from "./pages/SettingsPage";
import StudyPage from "./pages/StudyPage";
import TutorPage from "./pages/TutorPage";

export default function App() {
  return (
    <StoreProvider>
      <BrowserRouter>
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
      </BrowserRouter>
    </StoreProvider>
  );
}
