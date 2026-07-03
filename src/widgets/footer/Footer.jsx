import { Link } from "react-router-dom";
import styles from "./style.module.css";

const Footer = () => {
    return (
        <footer className={styles.footer}>
            <div className={styles.footerInner}>
                <p>© 2026 GitHub Dashboard</p>
                <div className={styles.links}>
                    <Link to="/privacy">Privacy Policy</Link>
                    <Link to="/terms">Terms of Use</Link>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
