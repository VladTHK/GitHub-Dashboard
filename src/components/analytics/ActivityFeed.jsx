import styles from "../../widgets/Analytics/style.module.css";

const formatDate = (value) =>
    new Date(value).toLocaleDateString("en", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });

const getActivityLabel = (type) => {
    const labels = {
        PushEvent: "Push",
        CreateEvent: "Create",
        WatchEvent: "Star",
        IssuesEvent: "Issue",
        ForkEvent: "Fork",
        PullRequestEvent: "PR",
    };

    return labels[type] || type.replace(/Event$/, "");
};

const ActivityFeed = ({ events }) => {
    return (
        <section className={styles.panel}>
            <div className={styles.panelHeader}>
                <div>
                    <p className={styles.kicker}>Activity</p>
                    <h2>Recent public events</h2>
                </div>
            </div>

            <ul className={styles.feedList}>
                {events.length > 0 ? (
                    events.map((event) => (
                        <li key={event.id} className={styles.feedItem}>
                            <div className={styles.feedAccent}>{getActivityLabel(event.type).slice(0, 2).toUpperCase()}</div>
                            <div className={styles.feedBody}>
                                <strong>{getActivityLabel(event.type)}</strong>
                                <p>{event.repo?.name || "GitHub activity"}</p>
                            </div>
                            <span className={styles.feedDate}>{formatDate(event.created_at)}</span>
                        </li>
                    ))
                ) : (
                    <li className={styles.listItem}>No recent activity found.</li>
                )}
            </ul>
        </section>
    );
};

export default ActivityFeed;
