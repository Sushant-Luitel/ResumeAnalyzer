import { toast } from "react-toastify";
import Button from "../../design/Button";
import { useAuth } from "../../context/authContext";
import MyDropZone from "../FileDropZone/MyDropZone";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import ResumeUpload from "../ResumeUpload/ResumeUpload";
const CalculateATS = () => {
  const { files, username, password } = useAuth();
  const textAreaRef = useRef<HTMLTextAreaElement | null>(null);
  const [similarityScore, setSimilarityScore] = useState<number | null>(null);
  const { mutate: calculateATS, isPending } = useMutation({
    mutationKey: ["recommendJob"],
    mutationFn: async (newData: { job_description: string | undefined }) => {
      const response = await axios.post(`http://127.0.0.1:8000/ats/`, newData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Basic " + btoa(`${username}:${password}`),
        },
      });
      return response.data;
    },
    onSuccess: (res: Response) => {
      console.log(res);
      setSimilarityScore(res.similarity_score);
    },
    onError: (err: Error) => {
      console.log(err);
    },
  });

  const handleATSCalculation = () => {
    if (files.length < 1) {
      toast.error("Please Upload Your Resume ");
    } else if (
      textAreaRef.current &&
      textAreaRef.current.value.trim().length < 1
    ) {
      toast.error("Fill Job Description");
    }
    calculateATS({
      job_description: textAreaRef?.current?.value?.trim(),
    });
  };

  useEffect(() => {
    if (files.length < 1) {
      setSimilarityScore(null);
    }
  }, [files]);

  return (
    <>
      <ResumeUpload />
    </>
  );
};

export default CalculateATS;
