import {useState} from "react"

import styles from "./style.module.css"
import burgerBar from "../../assets/icons/burger-bar.svg"

const HeaderMenu = () => {
    const [menuOpen, setMenuOpen] = useState(false)

    const toggleMenu = () => {
        setMenuOpen(!menuOpen)
    }

    return (
        <button
        className={styles.headerButton}
        onClick={toggleMenu}
        >
            <img src={burgerBar} alt="Menu" />
        </button>
    )
}

export default HeaderMenu