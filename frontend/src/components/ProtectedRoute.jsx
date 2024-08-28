// Wrapper for a protected route

import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import api from "../api";
import { REFRESH_TOKEN, ACCESS_TOKEN } from "../constants";
import { useState, useEffect } from "react";


function ProtectedRoute({ children }) {
    // Check if we are authorized before letting them access this route
    const [isAuthorized, setIsAuthorized] = useState(null);

    // As soon as we try to access a route we call the auth function
    useEffect(() => {
        auth().catch(() => setIsAuthorized(false))
    }, [])

    const refreshToken = async () => {
        // Get the refresh token
        const refreshToken = localStorage.getItem(REFRESH_TOKEN);

        // Try to send a response to the route with a refresh token to get new access token
        try {
            // Send refresh token to backend
            const res = await api.post("/api/token/refresh/", {
                refresh: refreshToken,
            });

            // If success (got back access token)
            if (res.status === 200) {
                 // Save access token to local storage
                localStorage.setItem(ACCESS_TOKEN, res.data.access)
                setIsAuthorized(true)
            } else {
                setIsAuthorized(false)
            }
        } catch (error) {
            console.log(error);
            setIsAuthorized(false);
        }
    };

    const auth = async () => {
        // Get token from local storage
        const token = localStorage.getItem(ACCESS_TOKEN);
        if (!token) {
            setIsAuthorized(false);
            return;
        }

        // Decode the token
        const decoded = jwtDecode(token);
        const tokenExpiration = decoded.exp;
        const now = Date.now() / 1000;

        // Check if the token has expired
        if (tokenExpiration < now) {
            await refreshToken();
        } else {
            setIsAuthorized(true);
        }
    };

    if (isAuthorized === null) {
        return <div>Loading...</div>;
    }

    return isAuthorized ? children : <Navigate to="/login" />;
}

export default ProtectedRoute;