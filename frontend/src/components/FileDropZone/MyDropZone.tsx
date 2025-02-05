import { useState, useCallback } from "react";
import { FileRejection } from "react-dropzone";
import { useDropzone } from "react-dropzone";
import pdfLogo from "../../assets/pdf.png";
import clsx from "clsx";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useAuth } from "../../context/authContext";

interface FileData {
  file: File;
  preview: string;
}

const MyDropZone: React.FC = () => {
  const [files, setFiles] = useState<FileData[]>([]);
  const [error, setError] = useState<string>("");
  const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
  const acceptedFormats = {
    "application/pdf": [".pdf"],
  };

  const { username, password } = useAuth();

  const onDrop = useCallback(
    (acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
      setError("");

      if (rejectedFiles.length > 0) {
        setError("File exceeds size limit of 2MB or unsupported format.");
        return;
      }

      const newFiles = acceptedFiles.map((file) => ({
        file,
        preview: URL.createObjectURL(file),
      }));
      setFiles((prevFiles) => [...prevFiles, ...newFiles]);
    },
    []
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: acceptedFormats,
    maxSize: MAX_FILE_SIZE,
  });

  const removeFile = () => {
    setFiles([]);
  };

  const { mutate: uploadFile } = useMutation({
    mutationKey: ["uploadFile"],
    mutationFn: async (newFile: File) => {
      if (!newFile) {
        return;
      }
      console.log(newFile, "newFile");

      const formData = new FormData();
      formData.append("file", newFile);
      console.log(formData, "formData");
      const response = await axios.post(
        "http://127.0.0.1:8000/file/",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: "Basic " + btoa(`${username}:${password}`),
          },
        }
      );
      return response.data;
    },
    onSuccess: () => {},
  });

  return (
    <div>
      <div
        {...getRootProps()}
        className={clsx(
          " p-12 flex justify-center bg-white border border-dashed border-gray-300 rounded-xl ",
          files.length > 0
            ? "pointer-events-none opacity-80 "
            : "cursor-pointer "
        )}
      >
        <input {...getInputProps()} />
        <div className="text-center">
          <span className="inline-flex justify-center items-center size-16 bg-gray-100 text-gray-800 rounded-full">
            📁
          </span>
          <div className="mt-4 text-sm text-gray-600">
            <span className="font-medium text-gray-800">
              Drop your file here or{" "}
            </span>
            <span className="text-blue-600 font-semibold cursor-pointer">
              browse
            </span>
          </div>
          <p className="mt-1 text-xs text-gray-400">Pick a file up to 2MB.</p>
        </div>
      </div>

      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

      {files.length > 0 && (
        <>
          <div className="mt-4 space-y-2">
            <div className="p-3 bg-white border border-gray-300 rounded-xl flex items-center gap-x-3">
              <img src={pdfLogo} alt="preview" className="size-10 rounded-lg" />
              <p className="text-sm font-medium text-gray-800">
                {files[0]?.file?.name}
              </p>
              <p className="text-xs text-gray-500">
                {(files[0]?.file?.size / 1024).toFixed(2)} KB
              </p>
              <button
                onClick={removeFile}
                className="text-red-500 hover:text-red-700 focus:outline-none cursor-pointer"
              >
                ❌
              </button>
            </div>
          </div>
          <button
            type="button"
            className="py-3 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-teal-500 text-teal-500 hover:border-teal-400 hover:text-teal-400 focus:outline-none focus:border-teal-400 focus:text-teal-400 disabled:opacity-50 disabled:pointer-events-none"
            onClick={() => uploadFile(files[0]?.file)}
          >
            Analayze My Resume
          </button>
        </>
      )}
    </div>
  );
};

export default MyDropZone;
