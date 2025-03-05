const mongoose = require("mongoose");
const { GridFSBucket } = require("mongodb");
const fs = require("fs");
const path = require("path");

// Ensure MongoDB connection is ready before using GridFS
const getGridFSBucket = () => {
  if (mongoose.connection.readyState !== 1) {
    throw new Error("MongoDB connection is not established yet.");
  }
  return new GridFSBucket(mongoose.connection.db, { bucketName: "uploads" });
};

// Upload file to GridFS
const uploadFileToGridFS = (fileBuffer, fileName) => {
  return new Promise((resolve, reject) => {
    try {
      const bucket = getGridFSBucket();
      const uploadStream = bucket.openUploadStream(fileName);

      uploadStream.end(fileBuffer);

      uploadStream.on("error", (err) => reject(err));
      uploadStream.on("finish", (file) => resolve(uploadStream.id.toString())); // Ensure ID is a string
    } catch (error) {
      reject(error);
    }
  });
};

// Stream file from GridFS to response
const downloadFileFromGridFS = async (fileId, res) => {
  try {
    const bucket = getGridFSBucket();
    const _id = new mongoose.Types.ObjectId(fileId);

    // Check if file exists
    const file = await bucket.find({ _id }).toArray();
    if (!file || file.length === 0) {
      return res.status(404).json({ message: "File not found" });
    }

    // Set response headers
    res.set("Content-Type", file[0].contentType);
    res.set("Content-Disposition", `inline; filename="${file[0].filename}"`);

    // Pipe the file stream to response
    bucket.openDownloadStream(_id).pipe(res);
  } catch (error) {
    console.error("Error downloading file:", error);
    res.status(500).json({ message: "Error fetching file" });
  }
};

module.exports = {
  uploadFileToGridFS,
  downloadFileFromGridFS,
};
