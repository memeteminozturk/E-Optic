import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faTimes,
  faEye,
  faEdit,
  faGraduationCap,
} from "@fortawesome/free-solid-svg-icons";
import ThemeToggle from "./ThemeToggle";
import "./styles.css";

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
        {/* Desktop Navigation Menu */}
        <div className="navbar-menu navbar-menu--desktop">
          <ul className="navbar-list">
            <li className="navbar-item">
              {" "}
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `navbar-link ${isActive ? "navbar-link--active" : ""}`
                }
                onClick={closeMobileMenu}
              >
                <FontAwesomeIcon icon={faGraduationCap} className="nav-icon" />
                Optik Çöz
              </NavLink>
            </li>
            <li className="navbar-item">
              <NavLink
                to="/edit"
                className={({ isActive }) =>
                  `navbar-link ${isActive ? "navbar-link--active" : ""}`
                }
                onClick={closeMobileMenu}
              >
                <FontAwesomeIcon icon={faEdit} className="nav-icon" />
                Optik Düzenle
              </NavLink>
            </li>
            <li className="navbar-item">
              <NavLink
                to="/review"
                className={({ isActive }) =>
                  `navbar-link ${isActive ? "navbar-link--active" : ""}`
                }
                onClick={closeMobileMenu}
              >
                <FontAwesomeIcon icon={faEye} className="nav-icon" />
                İnceleme
              </NavLink>
            </li>{" "}
            <li className="navbar-item theme-toggle-desktop">
              <ThemeToggle />
            </li>
          </ul>{" "}
        </div>
        <button
          className="mobile-menu-toggle"
          onClick={toggleMobileMenu}
          aria-label="Toggle navigation menu"
        >
          <FontAwesomeIcon icon={isMobileMenuOpen ? faTimes : faBars} />
        </button>
        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div className="mobile-menu-overlay" onClick={closeMobileMenu}></div>
        )}{" "}
        {/* Mobile Navigation Menu */}
        <div
          className={`navbar-menu--mobile ${
            isMobileMenuOpen ? "navbar-menu--active" : ""
          }`}
        >
          <div className="mobile-menu-header">
            <h2 className="mobile-menu-title">Menü</h2>
          </div>
          <ul className="navbar-list">
            <li className="navbar-item">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `navbar-link ${isActive ? "navbar-link--active" : ""}`
                }
                onClick={closeMobileMenu}
              >
                <FontAwesomeIcon icon={faGraduationCap} className="nav-icon" />
                Optik Çöz
              </NavLink>
            </li>
            <li className="navbar-item">
              <NavLink
                to="/edit"
                className={({ isActive }) =>
                  `navbar-link ${isActive ? "navbar-link--active" : ""}`
                }
                onClick={closeMobileMenu}
              >
                <FontAwesomeIcon icon={faEdit} className="nav-icon" />
                Optik Düzenle
              </NavLink>
            </li>
            <li className="navbar-item">
              <NavLink
                to="/review"
                className={({ isActive }) =>
                  `navbar-link ${isActive ? "navbar-link--active" : ""}`
                }
                onClick={closeMobileMenu}
              >
                <FontAwesomeIcon icon={faEye} className="nav-icon" />
                İnceleme
              </NavLink>
            </li>
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
