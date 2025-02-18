import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Api from "./api";
import Success from "./Success";
import Error from "./Error";

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

            const response = await Api({ url, method, token });

            if (response.error || response.status !== 200) {
                setError(response.data?.message || "Failed to fetch profile.");
                setProfile(null);
            } else if (response.data) {
                setProfile(response.data);
                setError("");
            }
        }

        fetchData();
    }, []);

    // Redirect to profile registration page if there's an error
    useEffect(() => {
        if (error) {
            navigate("/candidateDashboard/registerProfile", { replace: true });
        }
    }, [error, navigate]);

    if (!profile) return <div>Loading...</div>;

    return (
        <div>
            <h2>Profile Details</h2>
            <Error error={error}/>
            if(!error){
              setMessage(
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
                </>)
                }

                <Success message={message}/>
            <Link to="/candidateDashboard">
                <button style={{ marginTop: "20px" }}>Back to Dashboard</button>
            </Link>
        </div>
    );
};

export default Profile;
