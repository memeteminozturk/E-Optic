import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faTimes, faEye, faEdit, faGraduationCap } from "@fortawesome/free-solid-svg-icons";
import ThemeToggle from "./ThemeToggle";
import "./styles.css";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };  return (
    <nav className={`navbar ${isScrolled ? 'navbar--scrolled' : ''}`}>
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
              <NavLink 
                to="/" 
                className={({ isActive }) => `navbar-link ${isActive ? 'navbar-link--active' : ''}`}
                onClick={closeMobileMenu}
              >
                Optik Çöz
              </NavLink>
            </li>
            <li className="navbar-item">
              <NavLink 
                to="/edit" 
                className={({ isActive }) => `navbar-link ${isActive ? 'navbar-link--active' : ''}`}
                onClick={closeMobileMenu}
              >
                Optik Düzenle
              </NavLink>
            </li>
            <li className="navbar-item">
              <NavLink 
                to="/review" 
                className={({ isActive }) => `navbar-link ${isActive ? 'navbar-link--active' : ''}`}
                onClick={closeMobileMenu}
              >
                İnceleme
              </NavLink>
            </li>
            <li className="navbar-item">
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

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div className="mobile-menu-overlay" onClick={closeMobileMenu}></div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
