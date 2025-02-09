import { toast } from "react-toastify";
import Button from "../../design/Button";
import { useAuth } from "../../context/authContext";
import MyDropZone from "../FileDropZone/MyDropZone";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useMutation } from "@tanstack/react-query";
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
      <div className="grid place-items-center gap-x-20">
        <div className="flex gap-10 mt-10 items-center">
          <MyDropZone />
          <div>
            <label htmlFor="job-description">
              Write or Paste Job Description
            </label>
            <br />
            <textarea
              ref={textAreaRef}
              id="job-description"
              className="mt-2 w-lg p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
              rows={5}
              placeholder="Enter your text here..."
            />
          </div>
        </div>
      </div>
      <div className="mt-20 flex justify-center">
        <Button
          className="bg-amber-600 rounded-xl text-white px-2 py-2 cursor-pointer "
          onClick={handleATSCalculation}
        >
          Calculate ATS Score
        </Button>
      </div>

      {similarityScore && (
        <div className="bg-blue-100 text-blue-900 font-semibold text-lg p-4 rounded-lg shadow-md w-fit mx-auto mt-4">
          Your ATS Score is:
          <span className="text-blue-700 font-bold">
            {Number(similarityScore.toFixed(4)) * 100}%
          </span>
        </div>
      )}
    </>
  );
};

export default CalculateATS;
