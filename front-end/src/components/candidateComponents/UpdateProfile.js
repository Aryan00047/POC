import React, { useState, useEffect } from "react";
import Button from "../reusableComponents/Button";
import Api from "../reusableComponents/api";
import Success from "../reusableComponents/Success";
import Error from "../reusableComponents/Error";

const UpdateProfile = () => {
    const [formData, setFormData] = useState({
        dob: "",
        marks: "",
        university: "",
        skills: "",
        company: "",
        designation: "",
        workExperience: "",
        working: false,
        resume: null,
    });

    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    const minDate = new Date();
    minDate.setFullYear(minDate.getFullYear() - 18);
    const minDateString = minDate.toISOString().split("T")[0]; // Format as yyyy-mm-dd

    const url = "/api/candidate/profile";
    const method = "put";

    useEffect(() => {
      const fetchProfile = async () => {
          const token = localStorage.getItem("token");
          if (!token) {
              setError("Please log in to update your profile.");
              return;
          }
  
          try {
              const response = await Api({ url, method: "get", token });
  
              console.log("API Raw Response:", response); // ✅ Debugging API response
  
              if (response && response.status === 200) {
                  const data = typeof response.json === "function" ? await response.json() : response; // ✅ Fix: Handle already-parsed response
                  setFormData(data);
              } else {
                  setError("Failed to fetch profile data.");
              }
          } catch (error) {
              console.error("Error fetching profile:", error);
              setError("An error occurred while fetching profile data.");
          }
      };
  
      fetchProfile();
  }, []);  

    const handleChange = (e) => {
        const { name, type, value, checked, files } = e.target;

        setFormData((prevData) => ({
            ...prevData,
            [name]: type === "file" ? files[0] : type === "checkbox" ? checked.toString() : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");
        setError("");

        const token = localStorage.getItem("token");
        if (!token) {
            setError("Please log in to update your profile.");
            return;
        }

        // Preserve previous values if new values are empty
        const updatedData = { ...formData };

        // Convert formData to FormData object
        const formDataToSend = new FormData();
        Object.keys(updatedData).forEach((key) => {
            if (key === "resume" && updatedData.resume) {
                formDataToSend.append(key, updatedData.resume); // Append file
            } else if (updatedData[key]) {
                formDataToSend.append(key, updatedData[key]); // Append only non-empty values
            }
        });

        try {
            const response = await Api({
                url,
                method,
                token,
                formData: formDataToSend,
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            console.log("API Response:", response); // ✅ Debugging API response

            if (response.status === 200) {
                setMessage("Profile updated successfully!");
            } else {
                setError(response.message || "Failed to update profile.");
            }
        } catch (error) {
            console.error("Error:", error);
            setError("An error occurred while updating the profile.");
        }
    };

    return (
        <>
            <h1>Update your Profile...</h1>
            <form onSubmit={handleSubmit}>
                <input name="dob" type="date" value={formData.dob || ""} onChange={handleChange} placeholder="Date of Birth"  max={minDateString}/>
                <input name="marks" type="number" value={formData.marks || ""} onChange={handleChange} placeholder="Marks" />
                <input name="university" type="text" value={formData.university || ""} onChange={handleChange} placeholder="University" />
                <input name="skills" type="text" value={formData.skills || ""} onChange={handleChange} placeholder="Skills" />
                <input name="company" type="text" value={formData.company || ""} onChange={handleChange} placeholder="Company" />
                <input name="designation" type="text" value={formData.designation || ""} onChange={handleChange} placeholder="Designation" />
                <input name="workExperience" type="number" value={formData.workExperience || ""} onChange={handleChange} placeholder="Work Experience" />

                <label>
                    <input name="working" type="checkbox" checked={formData.working === "true"} onChange={handleChange} /> Working Now
                </label>

                <input name="resume" type="file" onChange={handleChange} accept=".pdf,.docx" />

                <Button type="submit" label="Submit" />
            </form>

            <Error error={error} />
            <Success message={message} />
        </>
    );
};

export default UpdateProfile;
