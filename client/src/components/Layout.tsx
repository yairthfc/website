import { useEffect, type ReactNode } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { site } from "../data/site";
import Terminal from "./Terminal";
import YmSignatureLogo from "./YmSignatureLogo";

/** Scrolls to the top on page change, or to #hash targets (e.g. /#work). */
function ScrollManager() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      const id = hash.slice(1);
      const t = window.setTimeout(() => {
        document.getElementById(id)?.scrollIntoView();
      }, 0);
      return () => window.clearTimeout(t);
    }
    window.scrollTo(0, 0);
  }, [pathname, hash]);
  return null;
}

const navItem = "text-sm text-muted transition-colors hover:text-ink";

function Nav() {
  return (
    <header className="sticky top-0 z-20 border-b border-line/70 bg-paper/85 backdrop-blur">
      <div className="container-page flex h-16 items-center justify-between">
        <Link to="/" className="group flex shrink-0 items-center gap-2 whitespace-nowrap text-[15px] font-semibold tracking-tight">
          <YmSignatureLogo className="h-8 w-8 text-ink transition-colors group-hover:text-accent" />
          {site.name}
        </Link>
        <nav className="flex items-center gap-4 sm:gap-7">
          <Link to="/#experience" className={`${navItem} hidden sm:inline`}>
            Experience
          </Link>
          <Link to="/#work" className={navItem}>
            Projects
          </Link>
          <Link to="/#about" className={`${navItem} hidden md:inline`}>
            About
          </Link>
          <NavLink
            to="/personal"
            className={({ isActive }) => `${isActive ? "text-sm text-ink" : navItem} hidden sm:inline`}
          >
            Personal
          </NavLink>
          <a href={site.resume} className="btn-ghost px-3 py-1.5" target="_blank" rel="noreferrer">
            Résumé
          </a>
        </nav>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="container-page flex flex-col gap-4 py-8 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
        <p>
          © {new Date().getFullYear()} {site.name}. Built by hand in React.{" "}
          <span className="font-medium text-ink">COYS.</span>
        </p>
        <div className="flex items-center gap-6">
          <button
            type="button"
            onClick={() => window.dispatchEvent(new Event("open-terminal"))}
            title="Open terminal (or press `)"
            className="rounded border border-line px-1.5 py-0.5 font-mono text-xs text-faint transition-colors hover:border-ink hover:text-ink"
          >
            &gt;_
          </button>
          <a className="link" href={site.github} target="_blank" rel="noreferrer">
            GitHub
          </a>
          <a className="link" href={site.linkedin} target="_blank" rel="noreferrer">
            LinkedIn
          </a>
          <a className="link" href={`mailto:${site.email}`}>
            Email
          </a>
        </div>
      </div>
    </footer>
  );
}

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <ScrollManager />
      <Nav />
      <main className="flex-1">{children}</main>
      <Footer />
      <Terminal />
    </div>
  );
}
