
import logo from '../../assets/icons/ghdash.svg'

import { useUser } from "../../context/UserContext";

import HeaderMenu from './HeaderMenu'
import HeaderNav from './HeaderNav'

import styles from './style.module.css'

const Header = () => {
    const { user } = useUser();


    return (
        <header className={styles.header}>
            <div className={styles.leftSide}>
                <HeaderMenu />
                <img className={styles.logo} src={logo} alt="logo" />
                <h3 className={styles.userName}>
                    {user ? user.login : "GitHub Dashboard"}
                </h3>
            </div>
            <div className={styles.rightSide}>
                <HeaderNav />
            </div>

            
        </header>
    )
}

export default Header