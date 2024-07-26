import React from 'react';
import { NavLink } from 'react-router-dom';
import "./styles.css";

const Navbar = () => {
    return (
        <nav className="navbar">
            <div className="container nav-container">
                <div className="logo">
                    <NavLink exact="true" to="/">Optic</NavLink>
                </div>
                <ul className="navbar-list">
                    <li className="navbar-item"><NavLink exact="true" to="/">Optic</NavLink></li>
                    <li className="navbar-item"><NavLink to="/edit">Optic Edit</NavLink></li>
                </ul>
            </div>
        </nav>
    );
};

export default Navbar;
