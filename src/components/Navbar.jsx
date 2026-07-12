import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import ThemeToggle from "./ThemeToggle";
import "./styles.css";

const navItems = [
  { to: "/", label: "Optik Çöz" },
  { to: "/edit", label: "Optik Düzenle" },
  { to: "/review", label: "İnceleme" },
  { to: "/history", label: "Geçmiş" },
];

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menu on ESC key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isMobileMenuOpen) {
        closeMobileMenu();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isMobileMenuOpen]);

  const toggleMobileMenu = () => {
    const newState = !isMobileMenuOpen;
    setIsMobileMenuOpen(newState);
    document.body.style.overflow = newState ? "hidden" : "";
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
    document.body.style.overflow = "";
  };
  return (
    <nav className={`navbar ${isScrolled ? "navbar--scrolled" : ""}`}>
      <div className="container nav-container">
        <div className="navbar-brand">
          <NavLink to="/" className="logo" onClick={closeMobileMenu}>
            <span className="logo-text">Optic</span>
          </NavLink>
        </div>
        <div className="navbar-menu navbar-menu--desktop">
          <ul className="navbar-list">
            {navItems.map(({ to, label }) => (
              <li className="navbar-item" key={to}>
                <NavLink
                  to={to}
                  className={({ isActive }) =>
                    `navbar-link ${isActive ? "navbar-link--active" : ""}`
                  }
                  onClick={closeMobileMenu}
                >
                  {label}
                </NavLink>
              </li>
            ))}
            <li className="navbar-item theme-toggle-desktop">
              <ThemeToggle />
            </li>
          </ul>
        </div>
        <button
          className="mobile-menu-toggle"
          onClick={toggleMobileMenu}
          aria-label="Toggle navigation menu"
        >
          <FontAwesomeIcon icon={isMobileMenuOpen ? faTimes : faBars} />
        </button>
        {isMobileMenuOpen && (
          <div className="mobile-menu-overlay" onClick={closeMobileMenu}></div>
        )}
        <div
          className={`navbar-menu--mobile ${
            isMobileMenuOpen ? "navbar-menu--active" : ""
          }`}
        >
          <div className="mobile-menu-header">
            <h2 className="mobile-menu-title">Menü</h2>
          </div>
          <ul className="navbar-list">
            {navItems.map(({ to, label }) => (
              <li className="navbar-item" key={to}>
                <NavLink
                  to={to}
                  className={({ isActive }) =>
                    `navbar-link ${isActive ? "navbar-link--active" : ""}`
                  }
                  onClick={closeMobileMenu}
                >
                  {label}
                </NavLink>
              </li>
            ))}
            <li className="navbar-item theme-toggle-mobile">
              <ThemeToggle />
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
