// import axios from 'axios';

// async function Api({ url = "/", formData = {}, method = "get", token = "" }) {
//     try {
//         const headers = {
//             "Content-Type": "application/json",
//         };

//         // Add Authorization header only if token is present
//         if (token) {
//             headers["Authorization"] = `Bearer ${token}`;
//         }

//         const response = await axios({
//             url,
//             method: method.toLowerCase(), // Normalize method to lowercase
//             data: method.toLowerCase() !== "get" ? formData : undefined, // Avoid sending data in GET requests
//             headers,
//         });

//         return response;
//     }catch (error) {
//         console.error("Error during API call:", error);
    
//         if (error.response) {
//             console.error("Server Response:", error.response.data); // 🔍 Log exact backend message
//             return error.response; // Return response object
//         }
    
//         return { error: true, message: "Network error or server not reachable" };
//     }
// }

// export default Api;

import axios from "axios";

async function Api({ url = "/", formData = {}, method = "get", token = "", responseType = "json" }) {
  try {
    const headers = {
      "Content-Type": "application/json",
    };

    // ✅ Add Authorization header if token exists
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await axios({
      url,
      method: method.toLowerCase(),
      data: method.toLowerCase() !== "get" ? formData : undefined,
      headers,
      responseType, // ✅ Allow binary response (e.g., blob for PDFs)
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

