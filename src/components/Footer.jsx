import React from 'react'
import { Link } from 'react-router-dom'
import "./styles.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLinkedin, faGithub } from '@fortawesome/free-brands-svg-icons'
import { faEnvelope } from '@fortawesome/free-solid-svg-icons'


const Footer = () => {
    return (
        <footer className="footer">
            <div className="container footer-container">
                <ul className="social-list">
                    <li className="footer-item">
                        <a href="https://www.linkedin.com/in/umutcanbolat/" target="_blank" rel="noreferrer">
                            <FontAwesomeIcon icon={faLinkedin} />
                        </a>
                    </li>
                    <li className="footer-item">
                        <a href="" target="_blank" rel="noreferrer">
                            <FontAwesomeIcon icon={faGithub} />
                        </a>
                    </li>
                    <li className="footer-item">
                        <a href="mailto:" target="_blank" rel="noreferrer">
                            <FontAwesomeIcon icon={faEnvelope} />
                        </a>
                    </li>
                </ul>
                <p className="footer-text">© 2023 Memet Emin Öztürk</p>
            </div>
        </footer>
    )
}

export default Footer