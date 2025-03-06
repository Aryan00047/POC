import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { candidateActions } from "../../slices/candidateSlice";

const DeleteAccountPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Initialize navigate
  const [loading] = useState(false);
  const [error] = useState(null);
  const [success] = useState(null);

  const handleDeleteAccount = () => {
    const confirmation = window.confirm(
      "Are you sure you want to delete your account? This action cannot be undone."
    );
    if (!confirmation) return;

    dispatch(candidateActions.candidateDeleteAccount({ navigate })); // Pass navigate to saga
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
