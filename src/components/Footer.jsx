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
                        <a href="https://www.linkedin.com/in/memet-emin-%C3%B6zt%C3%BCrk-a14a7a224/" target="_blank" rel="noreferrer">
                            <FontAwesomeIcon icon={faLinkedin} />
                        </a>
                    </li>
                    <li className="footer-item">
                        <a href="https://github.com/memeteminozturk" target="_blank" rel="noreferrer">
                            <FontAwesomeIcon icon={faGithub} />
                        </a>
                    </li>
                    <li className="footer-item">
                        <a href="mailto:memeteminozturk@outlook.com" target="_blank" rel="noreferrer">
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