import { useState, useCallback } from "react";
import { FileRejection } from "react-dropzone";
import { useDropzone } from "react-dropzone";
import pdfLogo from "../../assets/pdf.png";

import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useAuth } from "../../context/authContext";
import { toast } from "react-toastify";

export interface FileData {
  file: File;
  preview: string;
}

const MyDropZone: React.FC = () => {
  const [error, setError] = useState<string>("");
  const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
  const acceptedFormats = {
    "application/pdf": [".pdf"],
  };

  const { files, setFiles } = useAuth();

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
      uploadFile(newFiles[0]?.file);
      setFiles((prevFiles) => [...prevFiles, ...newFiles]);
    },
    []
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: acceptedFormats,
    maxSize: MAX_FILE_SIZE,
    disabled: files.length > 0,
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
    onSuccess: (res) => {
      toast.success(res.message);
    },
  });
  return (
    <div className="grid place-items-center gap-10">
      <div
        {...getRootProps()}
        className=" p-12 flex justify-center bg-white border border-dashed border-gray-300 rounded-xl  "
      >
        <input {...getInputProps()} />
        {files.length > 0 ? (
          <>
            <div className="mt-4 space-y-2">
              <div className="p-3 bg-white border border-gray-300 rounded-xl flex items-center gap-x-3">
                <img
                  src={pdfLogo}
                  alt="preview"
                  className="size-10 rounded-lg"
                />
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
          </>
        ) : (
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
        )}
      </div>

      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
    </div>
  );
};

export default MyDropZone;
