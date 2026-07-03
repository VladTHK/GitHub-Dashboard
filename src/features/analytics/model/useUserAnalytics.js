import { useEffect, useMemo, useState } from "react";
import { getRepositories, getUser, getUserEvents } from "../../../api/githubService";

const getContributionLevel = (count) => {
    if (count >= 4) return "level4";
    if (count >= 3) return "level3";
    if (count >= 2) return "level2";
    if (count >= 1) return "level1";
    return "level0";
};

export function useUserAnalytics(username, setUser) {
    const [profile, setProfile] = useState(null);
    const [repositories, setRepositories] = useState([]);
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

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

    const totalStars = useMemo(() => repositories.reduce((sum, repo) => sum + repo.stargazers_count, 0), [repositories]);
    const totalForks = useMemo(() => repositories.reduce((sum, repo) => sum + repo.forks_count, 0), [repositories]);

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

    const totalContributions = useMemo(
        () => contributionGrid.flat().reduce((sum, day) => sum + day.count, 0),
        [contributionGrid]
    );
    const activeDays = useMemo(() => contributionGrid.flat().filter((day) => day.count > 0).length, [contributionGrid]);
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

    return {
        profile,
        repositories,
        events,
        loading,
        error,
        languageStats,
        totalStars,
        totalForks,
        contributionGrid,
        totalContributions,
        activeDays,
        longestStreak,
    };
}

export default useUserAnalytics;
