import React from "react";
import { useTheme } from "../contexts/ThemeContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSun, faMoon } from "@fortawesome/free-solid-svg-icons";

const ThemeToggle = () => {
  const { isDarkMode, toggleDarkMode } = useTheme();
  return (
    <button
      className="theme-toggle"
      onClick={toggleDarkMode}
      title={isDarkMode ? "Açık Temaya Geç" : "Koyu Temaya Geç"}
      aria-label={isDarkMode ? "Açık Temaya Geç" : "Koyu Temaya Geç"}
    >
      <FontAwesomeIcon
        icon={isDarkMode ? faSun : faMoon}
        className="theme-toggle-icon"
      />
      <span className="theme-toggle-label">{isDarkMode ? "Açık" : "Koyu"}</span>
    </button>
  );
};

export default ThemeToggle;
