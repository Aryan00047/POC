import axios from 'axios';

async function Api({ url = "/", formData = {}, method = "get", token = "" }) {
    try {
        const headers = {
            "Content-Type": "application/json",
        };

        // Add Authorization header only if token is present
        if (token) {
            headers["Authorization"] = `Bearer ${token}`;
        }

        const response = await axios({
            url,
            method: method.toLowerCase(), // Normalize method to lowercase
            data: method.toLowerCase() !== "get" ? formData : undefined, // Avoid sending data in GET requests
            headers,
        });

        return response;
    } catch (error) {
        console.error("Error during API call:", error);

        // If there's a response from the server, return it
        if (error.response) {
            return error.response;
        }

        // Otherwise, return a generic error object
        return { error: true, message: "Network error or server not reachable" };
    }
}

export default Api;
