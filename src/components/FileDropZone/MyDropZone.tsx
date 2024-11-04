import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import styles from "./MyDropZone.module.css";
import cloudUpload from "../../assets/cloud-sm.png";

function MyDropzone() {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    console.log(acceptedFiles);
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div {...getRootProps()}>
      <input {...getInputProps()} />
      {isDragActive ? (
        <p>Drop the files here ...</p>
      ) : (
        <div className={styles["file-upload-outer-box"]}>
          <div className={styles["file-upload-inner-box"]}>
            <img
              src={cloudUpload}
              className={styles["file-upload-image"]}
              alt=""
            />
            <button
              className={`${styles["file-upload-button"]} ${styles["button"]}`}
            >
              Upload Your Resume
            </button>
            <p className={styles["file-upload-text"]}>
              or drop a text file here
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default MyDropzone;
