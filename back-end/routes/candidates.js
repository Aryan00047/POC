const express = require("express");
const { protectRoute } = require("../middleware/authMiddleware");
const candidateController = require("../controllers/candidateController");
const { upload, uploadToGridFS } = require("../middleware/uploadMiddleware"); // Ensure correct import here
const router = express.Router();

// Routes to handle candidate profile actions
router.post(
  "/profile",
  protectRoute(["candidate"]),
  upload.single("resume"),
  candidateController.registerProfile
);
router.put(
  "/profile",
  protectRoute(["candidate"]),
  upload.single("resume"),
  uploadToGridFS,
  candidateController.updateProfile
);
router.get(
  "/profile",
  protectRoute(["candidate"]),
  candidateController.getProfile
);
router.get(
  "/jobs",
  protectRoute(["candidate"]),
  candidateController.fetchAvailableJobs
);
router.post(
  "/apply/:jobId",
  protectRoute(["candidate"]),
  candidateController.applyForJob
);
router.get(
  "/applications",
  protectRoute(["candidate"]),
  candidateController.viewCandidateApplications
);
router.delete(
  "/profile",
  protectRoute(["candidate"]),
  candidateController.deleteCandidateProfile
);
router.get("/profile/resume/:id", protectRoute(["candidate"]), candidateController.getResume);

module.exports = router;
