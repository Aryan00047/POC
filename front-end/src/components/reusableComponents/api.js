import axios from "axios";

async function Api({ url = "/", formData = {}, method = "get", token = "", responseType = "json" }) {
  try {
    const headers = {
      "Content-Type": "application/json",
    };

    // Add Authorization header if token exists
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await axios({
      url,
      method: method.toLowerCase(),
      data: method.toLowerCase() !== "get" ? formData : undefined,
      headers,
      responseType,
    });

    return response;
  } catch (error) {
    console.error("Error during API call:", error);

    if (error.response) {
      console.error("Server Response:", error.response.data);
      return error.response;
    }

    return { error: true, message: "Network error or server not reachable" };
  }
}

export default Api;

