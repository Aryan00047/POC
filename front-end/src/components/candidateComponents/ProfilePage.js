import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Api from "../reusableComponents/api";
import Success from "../reusableComponents/Success";
import Error from "../reusableComponents/Error";

const Profile = () => {
    const [profile, setProfile] = useState(null);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const url = "http://localhost:5000/api/candidate/profile";
    const method = "get";

    useEffect(() => {
        const token = localStorage.getItem("token");

        async function fetchData() {
            if (!token) {
                setError("No token found. Please log in.");
                return;
            }

            try {
                const response = await Api({ url, method, token });

                console.log("API Response:", response); // ✅ Debugging API response

                if (response.status === 200 && response.data) {
                    // ✅ Check if data is inside response.data.profile
                    const profileData = response.data.profile || response.data;
                    
                    if (Object.keys(profileData).length > 0) {
                        setProfile(profileData);
                        setMessage("Profile loaded successfully!");
                        setError(null);
                    } else {
                        setError("Profile not found. Please register.");
                        setProfile(null);
                    }
                } else {
                    setError("Failed to fetch profile.");
                    setProfile(null);
                }
            } catch (err) {
                console.error("Fetch Error:", err); // ✅ Debugging errors
                setError("Failed to fetch profile.");
                setProfile(null);
            }
        }

        fetchData();
    }, []);

    // ✅ Prevent premature redirect by checking `profile`
    useEffect(() => {
        if (error && !profile) {
            navigate("/candidateDashboard/registerProfile", { replace: true });
        }
    }, [error, profile, navigate]);

    if (!profile && !error) return <div>Loading...</div>;

    return (
        <div>
            <h2>Profile Details</h2>
            <Error error={error} />

            {profile && (
                <>
                    <p><strong>Name:</strong> {profile.name}</p>
                    <p><strong>Email:</strong> {profile.email}</p>
                    <p><strong>DOB:</strong> {profile.dob || "N/A"}</p>
                    <p><strong>University:</strong> {profile.university || "N/A"}</p>
                    <p><strong>CGPA:</strong> {profile.marks || "N/A"}</p>
                    <p><strong>Skills:</strong> {Array.isArray(profile.skills) ? profile.skills.join(", ") : "N/A"}</p>
                    <p><strong>Work Experience:</strong> {profile.workExperience || "N/A"}</p>
                    <p><strong>Resume:</strong> {profile.resume ? (
                        <button onClick={() => window.open(profile.resume, "_blank")}>View Resume</button>
                    ) : (
                        <span>No Resume Uploaded</span>
                    )}</p>
                </>
            )}

            <Success message={message} />

            <Link to="/candidateDashboard">
                <button style={{ marginTop: "20px" }}>Back to Dashboard</button>
            </Link>
        </div>
    );
};

export default Profile;
