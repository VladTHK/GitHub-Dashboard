import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

const FavoritesContext = createContext(null);
const STORAGE_KEY = "ghdashboard.favorite-users";

function normalizeUser(user) {
    return {
        login: user.login,
        name: user.name || user.login,
        avatar_url: user.avatar_url,
        bio: user.bio || "",
        public_repos: user.public_repos || 0,
        followers: user.followers || 0,
        following: user.following || 0,
        html_url: user.html_url,
        company: user.company || "",
        location: user.location || "",
    };
}

export function FavoritesProvider({ children }) {
    const [favorites, setFavorites] = useState([]);

    useEffect(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                const parsed = JSON.parse(stored);
                if (Array.isArray(parsed)) {
                    setFavorites(parsed.map(normalizeUser));
                }
            }
        } catch (error) {
            console.error("Unable to read favorite users", error);
        }
    }, []);

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
    }, [favorites]);

    const addFavorite = useCallback((user) => {
        const normalized = normalizeUser(user);
        setFavorites((current) => {
            if (current.some((favorite) => favorite.login === normalized.login)) {
                return current;
            }
            return [normalized, ...current];
        });
    }, []);

    const removeFavorite = useCallback((login) => {
        setFavorites((current) => current.filter((favorite) => favorite.login !== login));
    }, []);

    const isFavorite = useCallback(
        (login) => favorites.some((favorite) => favorite.login === login),
        [favorites]
    );

    const value = useMemo(
        () => ({
            favorites,
            addFavorite,
            removeFavorite,
            isFavorite,
        }),
        [favorites, addFavorite, removeFavorite, isFavorite]
    );

    return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
}

export function useFavorites() {
    const context = useContext(FavoritesContext);

    if (!context) {
        throw new Error("useFavorites must be used within FavoritesProvider");
    }

    return context;
}
