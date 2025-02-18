import React, { useState } from "react";
import Api from "../reusableComponents/api";

const DeleteAccountPage = () => {
  const [loading, setLoading] = useState(false); 
  const [error, setError] = useState(null); 
  const [success, setSuccess] = useState(null); 
  const url = "/api/candidate/profile";
  const method = "delete";

  const handleDeleteAccount = async () => {
    const confirmation = window.confirm(
      "Are you sure you want to delete your account? This action cannot be undone."
    );

    if (!confirmation) {
      return; // Exit if the user cancels
    }

    try {
      setLoading(true); // Start loading
      setError(null); // Clear previous errors
      setSuccess(null); // Clear previous success messages

      const token = localStorage.getItem("token");
      if (!token) {
        setError("Please log in first.");
        setLoading(false);
        return;
      }

      // Make DELETE request to delete the account
      const response = await Api({url, method, token});

      setSuccess(response.data.message); // Display success message
      localStorage.removeItem("token"); // Clear token from localStorage
    } catch (err) {
      console.error("Error deleting account:", err);
      setError(
        err.response?.data?.message || "Failed to delete account. Please try again."
      );
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <div>
      <h2>Delete Account</h2>
      <p>
        Warning: Deleting your account will remove all your data, including your
        applications and profile.
      </p>

      {loading && <p>Deleting your account...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}

      <button
        onClick={handleDeleteAccount}
        disabled={loading}
        style={{
          backgroundColor: loading ? "grey" : "red",
          color: "white",
          padding: "10px 20px",
          border: "none",
          cursor: loading ? "not-allowed" : "pointer",
        }}
      >
        {loading ? "Processing..." : "Delete Account"}
      </button>
    </div>
  );
};

export default DeleteAccountPage;
