import React from "react";

const DeleteAccount = () => {
  const handleDelete = () => {
    // Call the API to delete the candidate's profile and account
    fetch("/api/candidate/deleteAccount", {
      method: "DELETE",
    })
      .then((response) => response.json())
      .then((data) => alert(data.message))
      .catch((error) => console.error("Error deleting account:", error));
  };

  return (
    <div>
      <h2>Delete Account</h2>
      <button onClick={handleDelete}>Delete My Account</button>
    </div>
  );
};

export default DeleteAccount;