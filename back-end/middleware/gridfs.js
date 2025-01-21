const mongoose = require("mongoose");
const { GridFSBucket } = require("mongodb");
const fs = require("fs");
const path = require("path");

// Initialize GridFS connection
const getGridFSBucket = () => {
  const connection = mongoose.connection.db;
  return new GridFSBucket(connection, {
    bucketName: "uploads", // Define the name of the bucket
  });
};

// Upload file to GridFS
const uploadFileToGridFS = (filePath, fileName) => {
  return new Promise((resolve, reject) => {
    const bucket = getGridFSBucket();
    const uploadStream = bucket.openUploadStream(fileName);
    const fileStream = fs.createReadStream(filePath);

    fileStream
      .pipe(uploadStream)
      .on("error", (err) => {
        reject(err);
      })
      .on("finish", () => {
        resolve(uploadStream.id); // Return the file id
      });
  });
};

// Download file from GridFS
const downloadFileFromGridFS = (fileId, destinationPath) => {
  return new Promise((resolve, reject) => {
    const bucket = getGridFSBucket();
    const downloadStream = bucket.openDownloadStream(fileId);
    const fileWriteStream = fs.createWriteStream(destinationPath);

    downloadStream
      .pipe(fileWriteStream)
      .on("error", (err) => {
        reject(err);
      })
      .on("finish", () => {
        resolve();
      });
  });
};

module.exports = {
  uploadFileToGridFS,
  downloadFileFromGridFS,
};