import { Link } from "react-router-dom";
import { useFavorites } from "../../context/FavoritesContext";
import styles from "../Analytics/style.module.css";

const FavoritesView = () => {
    const { favorites, removeFavorite } = useFavorites();

    return (
        <section className={styles.panel}>
            <div className={styles.panelHeader}>
                <div>
                    <p className={styles.kicker}>Favorites</p>
                    <h2>Saved developers</h2>
                </div>
                <span className={styles.panelBadge}>{favorites.length} users</span>
            </div>

            {favorites.length === 0 ? (
                <div className={styles.emptyState}>
                    <p>No favorite users yet. Search a profile and save it from the analytics page.</p>
                </div>
            ) : (
                <div className={styles.repoList}>
                    {favorites.map((user) => (
                        <article key={user.login} className={styles.repoCard}>
                            <div className={styles.repoHeader}>
                                <Link to={`/${user.login}`}>{user.name || user.login}</Link>
                                <button type="button" className={styles.secondaryButton} onClick={() => removeFavorite(user.login)}>
                                    Remove
                                </button>
                            </div>
                            <div className={styles.profileInfo} style={{ marginTop: 8 }}>
                                <img src={user.avatar_url} alt={user.login} className={styles.avatarSmall} />
                                <div>
                                    <p className={styles.login}>@{user.login}</p>
                                    <p className={styles.bio}>{user.bio || "No bio available."}</p>
                                </div>
                            </div>
                            <div className={styles.repoMeta}>
                                <span>{user.public_repos} repos</span>
                                <span>{user.followers} followers</span>
                                <span>{user.following} following</span>
                                {user.location && <span>{user.location}</span>}
                            </div>
                        </article>
                    ))}
                </div>
            )}
        </section>
    );
};

export default FavoritesView;
