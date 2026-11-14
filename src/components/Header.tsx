import { useEffect, useState } from "react";
import { Link, NavLink, useLocation, useMatch } from "react-router";
import "./Header.css";

function Header() {
  const { pathname } = useLocation();
  // Route detail is a card on the map, so "Map" stays active there.
  const onRoute = useMatch("/routes/:id") !== null;
  // The menu remembers the page it was opened on, so navigating closes it.
  const [menuOpenOn, setMenuOpenOn] = useState<string | null>(null);
  const menuOpen = menuOpenOn === pathname;

  useEffect(() => {
    if (!menuOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpenOn(null);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [menuOpen]);

  return (
    <header className="header">
      <Link to="/" className="header__brand">
        <svg
          className="header__logo"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M2 19 9 6l4 7 2.5-3.5L22 19Z" />
        </svg>
        <span className="header__title">Ski Touring Map</span>
        <span className="header__subtitle">Tatra Mountains</span>
      </Link>
      <button
        type="button"
        className="header__menu-button"
        aria-label="Menu"
        aria-expanded={menuOpen}
        aria-controls="main-nav"
        onClick={() => setMenuOpenOn(menuOpen ? null : pathname)}
      >
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          aria-hidden="true"
        >
          <path
            d={menuOpen ? "M6 6l12 12M18 6 6 18" : "M4 7h16M4 12h16M4 17h16"}
          />
        </svg>
      </button>
      <nav
        id="main-nav"
        aria-label="Main"
        className={menuOpen ? "header__nav header__nav--open" : "header__nav"}
      >
        {/* A plain Link: NavLink drops aria-current when it isn't active itself. */}
        <Link
          to="/"
          className="header__link"
          aria-current={pathname === "/" || onRoute ? "page" : undefined}
        >
          Map
        </Link>
        <NavLink to="/info" className="header__link">
          Safety and rules
        </NavLink>
        <NavLink to="/about" className="header__link">
          About
        </NavLink>
      </nav>
    </header>
  );
}

export default Header;
