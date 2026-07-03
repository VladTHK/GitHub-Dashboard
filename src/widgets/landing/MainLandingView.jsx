import { useNavigate } from "react-router-dom";
import styles from "./style.module.css";

const popularUsers = [
    { login: "octocat", description: "Official GitHub mascot" },
    { login: "torvalds", description: "Linux creator" },
    { login: "gaearon", description: "React maintainer" },
    { login: "addyosmani", description: "Web performance expert" },
    { login: "microsoft", description: "Microsoft engineering" },
];

const MainLandingView = () => {
    const navigate = useNavigate();

    const handleRandomUser = () => {
        const user = popularUsers[Math.floor(Math.random() * popularUsers.length)];
        navigate(`/${user.login}`);
    };

    return (
        <section className={styles.heroCard}>
            <p className={styles.kicker}>GitHub dashboard</p>
            <h1>Search any developer and open a GitHub-style analytics view.</h1>
            <p className={styles.description}>
                Start typing a GitHub username in the top bar to load the profile, repositories, languages, and recent activity.
            </p>

            <div className={styles.actionsRow}>
                <button type="button" className={styles.primaryButton} onClick={handleRandomUser}>
                    Random user
                </button>
            </div>

            <div className={styles.userSection}>
                <div className={styles.userHeader}>
                    <h2>Popular developers</h2>
                    <p>Quick access to well-known GitHub profiles</p>
                </div>
                <div className={styles.userGrid}>
                    {popularUsers.map((user) => (
                        <button
                            key={user.login}
                            type="button"
                            className={styles.userCard}
                            onClick={() => navigate(`/${user.login}`)}
                        >
                            <span className={styles.userLogin}>@{user.login}</span>
                            <span className={styles.userDescription}>{user.description}</span>
                        </button>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default MainLandingView;
