import { NavLink } from "react-router-dom";
import { FaGithub, FaLinkedin, FaEnvelope, FaPhone } from "react-icons/fa";
import YmSignatureLogo from "../components/YmSignatureLogo";

const navLinkClasses = ({ isActive }: { isActive: boolean }) =>
  [
    "relative text-sm font-medium transition-colors",
    isActive ? "text-slate-900" : "text-slate-600 hover:text-slate-900",
  ].join(" ");

function Header() {
  return (
    <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/90 backdrop-blur shadow-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">

        {/* Left: logo + name */}
        <div className="flex items-center gap-3">
          <YmSignatureLogo className="h-9 w-9 text-sky-500" />

          <div className="flex flex-col">
            <span className="text-lg font-semibold tracking-tight sm:text-xl">
              Yair Mahfud
            </span>
            <span className="text-[11px] text-slate-500 sm:text-xs">
              Developer · CS Student · Builder
            </span>
          </div>
        </div>

        {/* Middle: navigation – visible on mobile too */}
        <nav className="flex items-center gap-3 text-xs sm:gap-5 sm:text-sm">
          <NavLink to="/" className={navLinkClasses} end>
            {({ isActive }) => (
              <span className="relative">
                <span>Home</span>
                {isActive && (
                  <span className="absolute -bottom-1 left-0 h-[2px] w-full rounded-full bg-sky-500" />
                )}
              </span>
            )}
          </NavLink>

          <NavLink to="/projects" className={navLinkClasses}>
            {({ isActive }) => (
              <span className="relative">
                <span>Projects</span>
                {isActive && (
                  <span className="absolute -bottom-1 left-0 h-[2px] w-full rounded-full bg-sky-500" />
                )}
              </span>
            )}
          </NavLink>

          <NavLink to="/personal" className={navLinkClasses}>
            {({ isActive }) => (
              <span className="relative">
                <span>Personal</span>
                {isActive && (
                  <span className="absolute -bottom-1 left-0 h-[2px] w-full rounded-full bg-sky-500" />
                )}
              </span>
            )}
          </NavLink>
        </nav>

        {/* Right: social icons – show only on md+ to avoid crowding mobile */}
        <div className="hidden items-center gap-3 text-slate-500 md:flex">
          <a
            href="https://github.com/yairthfc"
            target="_blank"
            rel="noreferrer"
            className="rounded-full p-1.5 hover:bg-slate-100 hover:text-slate-900"
            aria-label="GitHub"
          >
            <FaGithub size={18} />
          </a>

          <a
            href="https://www.linkedin.com/in/yairmahfud"
            target="_blank"
            rel="noreferrer"
            className="rounded-full p-1.5 hover:bg-slate-100 hover:text-slate-900"
            aria-label="LinkedIn"
          >
            <FaLinkedin size={18} />
          </a>

          <a
            href="mailto:yairthfc@gmail.com"
            className="rounded-full p-1.5 hover:bg-slate-100 hover:text-slate-900"
            aria-label="Email"
          >
            <FaEnvelope size={18} />
          </a>

          <a
            href="tel:+972000000000"
            className="rounded-full p-1.5 hover:bg-slate-100 hover:text-slate-900"
            aria-label="Phone"
          >
            <FaPhone size={18} />
          </a>
        </div>
      </div>
    </header>
  );
}

export default Header;
