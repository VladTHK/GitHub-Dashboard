import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";

import { useUser } from "../../context/UserContext";
import { useFavorites } from "../../context/FavoritesContext";
import { getRepositories, getUser, getUserEvents } from "../../api/githubService";
import ProfileHero from "../../components/analytics/ProfileHero";
import ContributionPanel from "../../components/analytics/ContributionPanel";
import RepositoriesOverview from "../../components/analytics/RepositoriesOverview";
import ActivityFeed from "../../components/analytics/ActivityFeed";
import styles from "../Analytics/style.module.css";

const getContributionLevel = (count) => {
    if (count >= 4) return "level4";
    if (count >= 3) return "level3";
    if (count >= 2) return "level2";
    if (count >= 1) return "level1";
    return "level0";
};

const UserAnalyticsView = () => {
    const { username } = useParams();
    const { setUser } = useUser();
    const { isFavorite, addFavorite, removeFavorite } = useFavorites();
    const [profile, setProfile] = useState(null);
    const [repositories, setRepositories] = useState([]);
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [activeTab, setActiveTab] = useState("overview");

    useEffect(() => {
        let active = true;

        const loadData = async () => {
            if (!username) {
                setError("Please provide a GitHub username.");
                setLoading(false);
                return;
            }

            setLoading(true);
            setError("");

            try {
                const [userData, reposData, eventsData] = await Promise.all([
                    getUser(username),
                    getRepositories(username, 8),
                    getUserEvents(username, 12),
                ]);

                if (!active) return;

                setProfile(userData);
                setRepositories(reposData);
                setEvents(eventsData);
                setUser(userData);
            } catch (err) {
                if (!active) return;
                setError("Unable to load the GitHub profile right now.");
                console.error(err);
            } finally {
                if (active) {
                    setLoading(false);
                }
            }
        };

        loadData();

        return () => {
            active = false;
        };
    }, [username, setUser]);

    const languageStats = useMemo(() => {
        const counts = repositories.reduce((acc, repo) => {
            if (repo.language) {
                acc[repo.language] = (acc[repo.language] || 0) + 1;
            }
            return acc;
        }, {});

        return Object.entries(counts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 4);
    }, [repositories]);

    const totalStars = repositories.reduce((sum, repo) => sum + repo.stargazers_count, 0);
    const totalForks = repositories.reduce((sum, repo) => sum + repo.forks_count, 0);

    const eventCountByDay = useMemo(() => {
        const counts = new Map();

        events.forEach((event) => {
            const dayKey = event.created_at.slice(0, 10);
            counts.set(dayKey, (counts.get(dayKey) || 0) + 1);
        });

        return counts;
    }, [events]);

    const contributionGrid = useMemo(() => {
        const today = new Date();
        const weeks = [];
        const start = new Date(today);
        start.setHours(0, 0, 0, 0);
        start.setDate(today.getDate() - 364);
        start.setDate(start.getDate() - start.getDay());

        for (let week = 0; week < 53; week += 1) {
            const weekDays = [];
            for (let day = 0; day < 7; day += 1) {
                const currentDate = new Date(start);
                currentDate.setDate(start.getDate() + week * 7 + day);
                const dayKey = currentDate.toISOString().slice(0, 10);
                const count = eventCountByDay.get(dayKey) || 0;
                weekDays.push({
                    date: currentDate,
                    count,
                    level: getContributionLevel(count),
                });
            }
            weeks.push(weekDays);
        }

        return weeks;
    }, [eventCountByDay]);

    const totalContributions = contributionGrid.flat().reduce((sum, day) => sum + day.count, 0);
    const activeDays = contributionGrid.flat().filter((day) => day.count > 0).length;

    const longestStreak = useMemo(() => {
        let best = 0;
        let current = 0;

        contributionGrid.flat().forEach((day) => {
            if (day.count > 0) {
                current += 1;
                best = Math.max(best, current);
            } else {
                current = 0;
            }
        });

        return best;
    }, [contributionGrid]);

    return (
        <div className={styles.page}>
            <main className={styles.main}>
                {loading ? (
                    <section className={styles.emptyState}>
                        <p>Loading analytics…</p>
                    </section>
                ) : error ? (
                    <section className={styles.emptyState}>
                        <p>{error}</p>
                    </section>
                ) : profile ? (
                    <>
                        <ProfileHero
                            profile={profile}
                            totalStars={totalStars}
                            isFavorite={isFavorite(profile.login)}
                            onToggleFavorite={() => (isFavorite(profile.login) ? removeFavorite(profile.login) : addFavorite(profile))}
                        />

                        <ContributionPanel
                            contributionGrid={contributionGrid}
                            totalContributions={totalContributions}
                            activeDays={activeDays}
                            longestStreak={longestStreak}
                        />

                        <div className={styles.tabs}>
                            {[
                                { key: "overview", label: "Overview" },
                                { key: "repositories", label: "Repositories" },
                                { key: "activity", label: "Activity" },
                            ].map((tab) => (
                                <button
                                    key={tab.key}
                                    type="button"
                                    className={`${styles.tabButton} ${activeTab === tab.key ? styles.tabButtonActive : ""}`}
                                    onClick={() => setActiveTab(tab.key)}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        {activeTab === "overview" && (
                            <RepositoriesOverview
                                repositories={repositories}
                                languageStats={languageStats}
                                totalStars={totalStars}
                                totalForks={totalForks}
                                title="Popular repositories"
                            />
                        )}

                        {activeTab === "repositories" && (
                            <RepositoriesOverview
                                repositories={repositories}
                                languageStats={languageStats}
                                totalStars={totalStars}
                                totalForks={totalForks}
                                title="Open source portfolio"
                                variant="repositories"
                            />
                        )}

                        {activeTab === "activity" && <ActivityFeed events={events} />}
                    </>
                ) : null}
            </main>
        </div>
    );
};

export default UserAnalyticsView;
