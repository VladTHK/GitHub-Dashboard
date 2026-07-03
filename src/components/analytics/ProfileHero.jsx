import styles from "../../widgets/Analytics/style.module.css";

const formatNumber = (value) => {
    if (value >= 1000) {
        return `${(value / 1000).toFixed(value >= 10000 ? 0 : 1)}k`;
    }

    return value.toString();
};

const ProfileHero = ({ profile, totalStars, isFavorite, onToggleFavorite }) => {
    return (
        <section className={styles.heroCard}>
            <div className={styles.profileInfo}>
                <img src={profile.avatar_url} alt={profile.login} className={styles.avatar} />
                <div>
                    <div className={styles.heroActions}>
                        <div>
                            <p className={styles.kicker}>Developer profile</p>
                            <h1>{profile.name || profile.login}</h1>
                        </div>
                        <button type="button" className={styles.secondaryButton} onClick={onToggleFavorite}>
                            {isFavorite ? "★ Saved" : "☆ Save"}
                        </button>
                    </div>
                    <p className={styles.login}>@{profile.login}</p>
                    <p className={styles.bio}>{profile.bio || "No bio available yet."}</p>
                    <div className={styles.metaRow}>
                        {profile.location && <span>{profile.location}</span>}
                        {profile.company && <span>{profile.company}</span>}
                        {profile.blog && <span>{profile.blog}</span>}
                    </div>
                </div>
            </div>

            <div className={styles.statsGrid}>
                <article className={styles.statCard}>
                    <span className={styles.statValue}>{formatNumber(profile.public_repos)}</span>
                    <span className={styles.statLabel}>Repositories</span>
                </article>
                <article className={styles.statCard}>
                    <span className={styles.statValue}>{formatNumber(profile.followers)}</span>
                    <span className={styles.statLabel}>Followers</span>
                </article>
                <article className={styles.statCard}>
                    <span className={styles.statValue}>{formatNumber(profile.following)}</span>
                    <span className={styles.statLabel}>Following</span>
                </article>
                <article className={styles.statCard}>
                    <span className={styles.statValue}>{formatNumber(totalStars)}</span>
                    <span className={styles.statLabel}>Stars</span>
                </article>
            </div>
        </section>
    );
};

export default ProfileHero;
