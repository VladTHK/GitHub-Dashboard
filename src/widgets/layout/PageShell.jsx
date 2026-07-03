import Header from "../header/Header";
import Footer from "../footer/Footer";
import styles from "./style.module.css";

const PageShell = ({ children }) => {
    return (
        <div className={styles.page}>
            <Header />
            <main className={styles.main}>{children}</main>
            <Footer />
        </div>
    );
};

export default PageShell;
