import { Link } from "react-router-dom";
import styles from "../Analytics/style.module.css";

const footerContent = {
    privacy: {
        title: "Privacy Policy",
        body: [
            "This dashboard uses the GitHub public API to display public profile information and repository metadata.",
            "We do not collect sensitive personal data beyond what is required to render the requested public profile and favorites list.",
            "Favorite users are stored locally in your browser so you can keep a quick list of developers you want to revisit.",
        ],
    },
    terms: {
        title: "Terms of Use",
        body: [
            "This project is intended for personal and educational use.",
            "You agree not to misuse the GitHub API or overload the service with excessive requests.",
            "All GitHub profile data remains the property of GitHub and is displayed in accordance with their public API terms.",
        ],
    },
};

const FooterPageView = ({ page }) => {
    const content = footerContent[page] || footerContent.privacy;

    return (
        <section className={styles.panel}>
            <div className={styles.panelHeader}>
                <div>
                    <p className={styles.kicker}>About</p>
                    <h2>{content.title}</h2>
                </div>
                <Link to="/" className={styles.secondaryButton}>Back home</Link>
            </div>
            <div className={styles.feedList}>
                {content.body.map((paragraph) => (
                    <p key={paragraph} className={styles.bio}>{paragraph}</p>
                ))}
            </div>
        </section>
    );
};

export default FooterPageView;
