import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useUser } from "../../context/UserContext";
import { useFavorites } from "../../context/FavoritesContext";
import { getUser, searchUsers } from "../../api/githubService";

import style from "./style.module.css";

import searchIcon from "../../assets/icons/search.svg";
import reportIcon from "../../assets/icons/reports-solid.svg";
import starIcon from "../../assets/icons/star-solid.svg";

const normalizeGitHubInput = (value) => {
    const trimmedValue = (value || "").trim();
    if (!trimmedValue) {
        return "";
    }

    const withoutProtocol = trimmedValue.replace(/^https?:\/\/(www\.)?github\.com\//i, "");
    const withoutPath = withoutProtocol.replace(/^@/, "").split(/[/?#]/)[0].trim();

    return withoutPath;
};

const HeaderNav = () => {
    const [username, setUsername] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [loadingSearch, setLoadingSearch] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const { user, setUser } = useUser();
    const { favorites } = useFavorites();

    useEffect(() => {
        const trimmedValue = username.trim();

        if (trimmedValue.length < 2) {
            setSuggestions([]);
            setShowSuggestions(false);
            return;
        }

        const timer = setTimeout(async () => {
            setLoadingSearch(true);
            try {
                const data = await searchUsers(trimmedValue, 5);
                setSuggestions(data);
                setShowSuggestions(data.length > 0);
            } catch (err) {
                console.error(err);
                setSuggestions([]);
                setShowSuggestions(false);
            } finally {
                setLoadingSearch(false);
            }
        }, 250);

        return () => clearTimeout(timer);
    }, [username]);

    async function handleSubmit(e) {
        e.preventDefault();

        const normalizedValue = normalizeGitHubInput(username);
        if (!normalizedValue) return;

        try {
            const data = await getUser(normalizedValue);
            setUser(data);
            setSuggestions([]);
            setShowSuggestions(false);
            setUsername(normalizedValue);
            navigate(`/${normalizedValue}`);
        } catch (err) {
            console.error(err);
        }
    }

    const handleSelectUser = (value) => {
        const normalizedValue = normalizeGitHubInput(value);
        setUsername(normalizedValue);
        setSuggestions([]);
        setShowSuggestions(false);
        navigate(`/${normalizedValue}`);
    };

    const handleAnalyticsClick = async () => {
        const currentUsername = user?.login || location.pathname.replace(/^\//, "").split("/")[0];
        const normalizedValue = normalizeGitHubInput(currentUsername);

        if (!normalizedValue) {
            return;
        }

        try {
            const data = await getUser(normalizedValue);
            setUser(data);
            navigate(`/${normalizedValue}`);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <nav className={style.headerNav}>
            <div className={style.searchWrap}>
                <form action="search" onSubmit={handleSubmit}>
                    <label htmlFor="search">
                        <img src={searchIcon} alt="Search" className={style.searchIcon} />
                    </label>

                    <input
                        id="search"
                        type="search"
                        placeholder="Search or jump to…"
                        className={style.searchInput}
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        onFocus={() => username.trim().length >= 2 && setShowSuggestions(suggestions.length > 0)}
                        onBlur={() => window.setTimeout(() => setShowSuggestions(false), 120)}
                    />
                </form>

                {showSuggestions && (
                    <ul className={style.suggestions}>
                        {loadingSearch ? (
                            <li className={style.suggestionItem}>Searching…</li>
                        ) : (
                            suggestions.map((user) => (
                                <li key={user.id}>
                                    <button
                                        type="button"
                                        className={style.suggestionItem}
                                        onMouseDown={(e) => e.preventDefault()}
                                        onClick={() => handleSelectUser(user.login)}
                                    >
                                        <img src={user.avatar_url} alt={user.login} className={style.suggestionAvatar} />
                                        <span>{user.login}</span>
                                    </button>
                                </li>
                            ))
                        )}
                    </ul>
                )}
            </div>

            <ul className={style.navList}>
                <li>
                    <button className={style.headerButton} type="button" onClick={() => navigate("/favorites")}>
                        <img src={starIcon} alt="Favorites" />
                        {favorites.length > 0 && <span className={style.badge}>{favorites.length}</span>}
                    </button>
                </li>
                <li>
                    <button className={style.headerButton} type="button" onClick={handleAnalyticsClick}>
                        <img src={reportIcon} alt="Analytics" />
                    </button>
                </li>
            </ul>
        </nav>
    );
};

export default HeaderNav;