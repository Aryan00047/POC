import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Button from "../reusableComponents/Button";
import { candidateActions } from "../../slices/candidateSlice";
import Success from "../reusableComponents/Success";
import Error from "../reusableComponents/Error";

const UpdateProfile = () => {
  const dispatch = useDispatch();
  const { loading, error, successMessage } = useSelector((state) => state.candidate);
  const [formData, setFormData] = useState({
    dob: "",
    marks: "",
    university: "",
    skills: "",
    company: "",
    designation: "",
    workExperience: "",
    working: false,
  });
  const [resume, setResume] = useState(null);
  const [existingProfile, setExistingProfile] = useState(null);
  const [message, setMessage] = useState(""); // State for messages

  const minDate = new Date();
  minDate.setFullYear(minDate.getFullYear() - 18);
  const minDateString = minDate.toISOString().split("T")[0];

  // Fetch existing profile data on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setMessage("Please log in first.");
          return;
        }

        const response = await fetch("http://localhost:5000/api/candidate/profile", {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch profile.");
        }

        setFormData({
          dob: data.profile.dob || "",
          marks: data.profile.marks || "",
          university: data.profile.university || "",
          skills: data.profile.skills || "",
          company: data.profile.company || "",
          designation: data.profile.designation || "",
          workExperience: data.profile.workExperience || "",
          working: data.profile.working || false,
        });

        setExistingProfile(data.profile);
      } catch (error) {
        console.error("Error fetching profile:", error);
        setMessage(error.message);
      }
    };

    fetchProfile();
  }, []);

  // Handle input change
  const handleChange = (e) => {
    const { name, type, value, checked, files } = e.target;

    if (type === "file") {
      setResume(files[0]);
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  // Submit profile update
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(""); // Clear previous messages

    const token = localStorage.getItem("token");
    if (!token) {
      setMessage("Please log in first.");
      return;
    }

    const formDataToSend = new FormData();
    let hasChanges = false; // Track changes

    Object.keys(formData).forEach((key) => {
      if (formData[key] !== existingProfile[key]) {
        formDataToSend.append(key, formData[key]);
        hasChanges = true;
      }
    });

    if (resume instanceof File) {
      formDataToSend.append("resume", resume);
      hasChanges = true;
    }

    if (!hasChanges) {
      setMessage("No changes detected.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/candidate/profile", {
        method: "PUT",
        body: formDataToSend,
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Profile update failed");
      }

      setMessage("Profile updated successfully.");
      dispatch(candidateActions.candidateRegisterProfileSuccess(data));

    } catch (error) {
      console.error("Error updating profile:", error);
      setMessage("Failed to update profile.");
      dispatch(candidateActions.candidateRegisterProfileFailure(error.message));
    }
  };

  return (
    <>
      <h1>Update your Profile</h1>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit}>
        <input name="dob" type="date" value={formData.dob} onChange={handleChange} max={minDateString}/>
        <input name="marks" type="number" value={formData.marks} onChange={handleChange} placeholder="Marks" />
        <input name="university" type="text" value={formData.university} onChange={handleChange} placeholder="University" />
        <input name="skills" type="text" value={formData.skills} onChange={handleChange} placeholder="Skills" />
        <input name="company" type="text" value={formData.company} onChange={handleChange} placeholder="Company" />
        <input name="designation" type="text" value={formData.designation} onChange={handleChange} placeholder="Designation" />
        <input name="workExperience" type="text" value={formData.workExperience} onChange={handleChange} placeholder="Work Experience" />
        <input name="working" type="checkbox" checked={formData.working} onChange={handleChange} /> Working Now
        <input name="resume" type="file" onChange={handleChange} accept=".pdf,.docx" />
        <Button type="submit" label={loading ? "Submitting..." : "Submit"} disabled={loading} />
      </form>

      {error && <Error error={error} />}
      {successMessage && <Success message={successMessage} />}
    </>
  );
};

export default UpdateProfile;
