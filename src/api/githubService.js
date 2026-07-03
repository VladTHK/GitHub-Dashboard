import { githubApi } from "./githubapi";

export async function getUser(username) {
    const response = await githubApi.get(`/users/${username}`);
    return response.data;
}

export async function searchUsers(query, perPage = 5) {
    const response = await githubApi.get("/search/users", {
        params: {
            q: `${query} in:login`,
            per_page: perPage,
        },
    });

    return response.data.items || [];
}

export async function getRepositories(username, perPage = 10) {
    const response = await githubApi.get(`/users/${username}/repos`, {
        params: {
            per_page: perPage,
            sort: "updated",
        },
    });

    return response.data;
}

export async function getUserEvents(username, perPage = 5) {
    const response = await githubApi.get(`/users/${username}/events/public`, {
        params: {
            per_page: perPage,
        },
    });

    return response.data;
}