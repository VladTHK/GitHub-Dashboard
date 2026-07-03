import styles from "../../features/analytics/ui/RepositoriesOverview.module.css";

const formatDate = (value) =>
    new Date(value).toLocaleDateString("en", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });

const RepositoriesOverview = ({ repositories, languageStats, totalStars, totalForks, title, variant = "overview" }) => {
    const sortedRepos = [...repositories].sort((a, b) => b.stargazers_count - a.stargazers_count);

    if (variant === "repositories") {
        return (
            <section className={styles.panel}>
                <div className={styles.panelHeader}>
                    <div>
                        <p className={styles.kicker}>Repositories</p>
                        <h2>{title}</h2>
                    </div>
                </div>

                <div className={styles.repoList}>
                    {sortedRepos.map((repo) => (
                        <article key={repo.id} className={styles.repoCard}>
                            <div className={styles.repoHeader}>
                                <a href={repo.html_url} target="_blank" rel="noreferrer">
                                    {repo.name}
                                </a>
                                <span className={styles.repoBadge}>{repo.private ? "Private" : "Public"}</span>
                            </div>
                            <p>{repo.description || "No description provided."}</p>
                            <div className={styles.repoMeta}>
                                {repo.language && <span>{repo.language}</span>}
                                <span>★ {repo.stargazers_count}</span>
                                <span>↺ {repo.forks_count}</span>
                                <span>Issues {repo.open_issues_count}</span>
                                <span>Updated {formatDate(repo.updated_at)}</span>
                            </div>
                        </article>
                    ))}
                </div>
            </section>
        );
    }

    return (
        <div className={styles.contentGrid}>
            <section className={styles.panel}>
                <div className={styles.panelHeader}>
                    <div>
                        <p className={styles.kicker}>Overview</p>
                        <h2>{title}</h2>
                    </div>
                    <span className={styles.panelBadge}>{repositories.length} public repos</span>
                </div>

                <div className={styles.repoList}>
                    {sortedRepos.slice(0, 4).map((repo) => (
                        <article key={repo.id} className={styles.repoCard}>
                            <div className={styles.repoHeader}>
                                <a href={repo.html_url} target="_blank" rel="noreferrer">
                                    {repo.name}
                                </a>
                                <span className={styles.repoBadge}>{repo.private ? "Private" : "Public"}</span>
                            </div>
                            <p>{repo.description || "No description provided."}</p>
                            <div className={styles.repoMeta}>
                                {repo.language && <span>{repo.language}</span>}
                                <span>★ {repo.stargazers_count}</span>
                                <span>↺ {repo.forks_count}</span>
                                <span>Updated {formatDate(repo.updated_at)}</span>
                            </div>
                        </article>
                    ))}
                </div>
            </section>

            <aside className={styles.sidebar}>
                <section className={styles.panel}>
                    <div className={styles.panelHeader}>
                        <div>
                            <p className={styles.kicker}>Languages</p>
                            <h2>Most used</h2>
                        </div>
                    </div>
                    <ul className={styles.list}>
                        {languageStats.length > 0 ? (
                            languageStats.map(([name, count]) => (
                                <li key={name} className={styles.listItem}>
                                    <span>{name}</span>
                                    <span>{count} repos</span>
                                </li>
                            ))
                        ) : (
                            <li className={styles.listItem}>No language data yet.</li>
                        )}
                    </ul>
                </section>

                <section className={styles.panel}>
                    <div className={styles.panelHeader}>
                        <div>
                            <p className={styles.kicker}>Summary</p>
                            <h2>Contribution snapshot</h2>
                        </div>
                    </div>
                    <div className={styles.summaryGrid}>
                        <article className={styles.summaryBox}>
                            <span className={styles.summaryValue}>{totalStars}</span>
                            <span className={styles.summaryLabel}>Stars across repos</span>
                        </article>
                        <article className={styles.summaryBox}>
                            <span className={styles.summaryValue}>{totalForks}</span>
                            <span className={styles.summaryLabel}>Forks across repos</span>
                        </article>
                    </div>
                </section>
            </aside>
        </div>
    );
};

export default RepositoriesOverview;
