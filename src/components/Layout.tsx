import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import BackgroundFX from "./BackgroundFX";
import Sidebar from "./Sidebar";

export default function Layout() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return (
    <>
      <BackgroundFX />
      <div className="app">
        <Sidebar />
        <main className="main">
          <Outlet />
        </main>
      </div>
    </>
  );
}
