import styles from "../../widgets/Analytics/style.module.css";

const formatNumber = (value) => {
    if (value >= 1000) {
        return `${(value / 1000).toFixed(value >= 10000 ? 0 : 1)}k`;
    }

    return value.toString();
};

const ContributionPanel = ({ contributionGrid, totalContributions, activeDays, longestStreak }) => {
    return (
        <section className={styles.panel}>
            <div className={styles.panelHeader}>
                <div>
                    <p className={styles.kicker}>Contribution graph</p>
                    <h2>Activity calendar</h2>
                </div>
                <div className={styles.legend}>
                    <span>Less</span>
                    <div className={styles.legendCells}>
                        {[0, 1, 2, 3, 4].map((level) => (
                            <span key={level} className={`${styles.legendCell} ${styles[`level${level}`]}`} />
                        ))}
                    </div>
                    <span>More</span>
                </div>
            </div>

            <div className={styles.calendarWrapper}>
                <div className={styles.calendarGrid}>
                    {contributionGrid.map((week, weekIndex) => (
                        <div key={weekIndex} className={styles.calendarWeek}>
                            {week.map((day, dayIndex) => (
                                <div
                                    key={`${weekIndex}-${dayIndex}`}
                                    className={`${styles.calendarCell} ${styles[day.level]}`}
                                    title={`${day.date.toDateString()} · ${day.count} activities`}
                                />
                            ))}
                        </div>
                    ))}
                </div>
            </div>

            <div className={styles.summaryGrid}>
                <article className={styles.summaryBox}>
                    <span className={styles.summaryValue}>{formatNumber(totalContributions)}</span>
                    <span className={styles.summaryLabel}>Public events</span>
                </article>
                <article className={styles.summaryBox}>
                    <span className={styles.summaryValue}>{formatNumber(activeDays)}</span>
                    <span className={styles.summaryLabel}>Active days</span>
                </article>
                <article className={styles.summaryBox}>
                    <span className={styles.summaryValue}>{formatNumber(longestStreak)}</span>
                    <span className={styles.summaryLabel}>Longest streak</span>
                </article>
            </div>
        </section>
    );
};

export default ContributionPanel;
