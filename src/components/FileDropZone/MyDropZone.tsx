import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import styles from "./MyDropZone.module.css";
import cloudUpload from "../../assets/cloud-sm.png";

function MyDropzone() {
  const [files, setFiles] = useState<any>([]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles) => {
      setFiles(
        acceptedFiles.map((file) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        )
      );
    },
  });

  if (files.length > 0) console.log(files, "files");

  return (
    <div {...getRootProps()}>
      <input {...getInputProps()} />
      {files.length > 0 ? (
        <div>
          <img
            src={files[0]?.preview}
            className={styles["file-preview"]}
            alt=""
          />
        </div>
      ) : isDragActive ? (
        <div className={styles["file-upload-outer-box"]}>
          <div className={styles["file-upload-inner-box"]}>
            <img
              src={cloudUpload}
              className={styles["file-upload-image"]}
              alt=""
            />
            <p className={styles["file-upload-text"]}>drop your file here...</p>
          </div>
        </div>
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
