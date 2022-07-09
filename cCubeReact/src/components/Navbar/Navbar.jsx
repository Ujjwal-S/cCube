import React, {useState} from 'react'
import {Link} from 'react-router-dom'
import styles from './Navbar.module.css'

const Navbar = () => {
    const [showLaguagesDropDown, setShowLaguagesDropDown ] = useState(false)

    window.onclick = function(event) {
        if(!event.target.matches('.translateImg')){
            setShowLaguagesDropDown(false)
        }
    }

    return (
        <div className={styles.nav}>
            <img className={styles.nav_logo_img} src="images/Navbar/logo.png" alt="logo" />
            <div className={styles.nav_links_container}>
                <Link to="/" className={`${styles.nav_links} ${styles.hover_underline_animation}`}>Github</Link>
                <Link to="/" className={`${styles.nav_links} ${styles.hover_underline_animation}`}>Join a Room</Link>
                <Link to="/register" className={`${styles.nav_links} ${styles.hover_underline_animation}`}>Register</Link>
                <Link to="/login" className={`${styles.nav_links} ${styles.hover_underline_animation}`}>Sign in</Link>
                <li onClick={() => setShowLaguagesDropDown(true)}>
                    <img src="images/Navbar/translate.png" alt="translate" className="translateImg" />
                    <ul style={showLaguagesDropDown ? {display: "block"} : {display: "none"}}>
                        <li>English</li>
                        <li>हिंदी</li>
                    </ul>
                </li>
            </div>
        </div>
    )
}

export default Navbar
