import { toast } from "react-toastify";
import Button from "../../design/Button";
import ResumeUpload from "../ResumeUpload/ResumeUpload";
import { useAuth } from "../../context/authContext";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useEffect, useState } from "react";
import Loader from "../reusable/Loader";
import { Link } from "react-router-dom";

type JobDetails = {
  "Job Id": number;
  Experience: string;
  Qualifications: string;
  "Salary Range": string;
  location: string;
  Country: string;
  latitude: number;
  longitude: number;
  "Work Type": string;
  "Company Size": number;
  "Job Posting Date": string;
  preference: string;
  "Contact Person": string;
  Contact: string;
  "Job Title": string;
  Role: string;
  "Job Portal": string;
  "Job Description": string;
  Benefits: string;
  Skills: string;
  Responsibilities: string;
  Company: string;
  "Company Profile": string;
  Similarity: number;
};

const RecommendJob = () => {
  const { files, username, password } = useAuth();
  const [recommendationsData, setRecommendationsData] = useState([]);
  const [selectedJob, setSelectedJob] = useState<JobDetails | null>(null);

  const { mutate: recommendJob, isPending } = useMutation({
    mutationKey: ["recommendJob"],
    mutationFn: async (newData: { username: string }) => {
      const response = await axios.post(
        `http://127.0.0.1:8000/recommend/${username}/`,
        newData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Basic " + btoa(`${username}:${password}`),
          },
        }
      );
      return response.data;
    },
    onSuccess: (res: Response) => {
      console.log(res);
      setRecommendationsData(res.recommendations);
    },
    onError: (err: Error) => {
      console.log(err);
    },
  });

  const handleRecommendation = () => {
    if (files.length > 0) {
      recommendJob({ username });
    } else {
      toast.error("Please Upload Your Resume ");
    }
  };

  useEffect(() => {
    if (files.length < 1) {
      setRecommendationsData([]);
    }
  }, [files]);

  if (isPending) return <Loader />;

  return (
    <div className="grid place-items-center gap-10">
      <ResumeUpload />
      <Button
        className="bg-amber-600 rounded-xl text-white px-2 py-2 cursor-pointer "
        onClick={handleRecommendation}
      >
        Recommend Job
      </Button>

      <div className="p-6 max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Job Listings</h1>
        <div className="grid gap-4 grid-cols-3">
          {recommendationsData?.map((job: JobDetails) => (
            <button
              key={job["Job Id"]}
              onClick={() => setSelectedJob(job)}
              className="block p-4 border rounded-lg shadow hover:bg-gray-100 transition w-full text-left"
            >
              <h2 className="text-lg font-semibold">{job["Job Title"]}</h2>
              <p className="text-gray-700">{job["Company"]}</p>
              <p className="text-gray-600">{job["location"]}</p>
              <p className="text-gray-800 font-semibold">
                {job["Salary Range"]}
              </p>
            </button>
          ))}
        </div>
      </div>

      {selectedJob && (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-xl z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full relative">
            <button
              onClick={() => setSelectedJob(null)}
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
            >
              ✖
            </button>
            <h2 className="text-2xl font-bold mb-2">
              {selectedJob["Job Title"]}
            </h2>
            <p className="text-gray-700 font-semibold">
              {selectedJob["Company"]}
            </p>
            <p className="text-gray-600">{selectedJob["location"]}</p>
            <p className="text-gray-800 font-semibold">
              {selectedJob["Salary Range"]}
            </p>
            <p className="text-gray-700 mt-2">
              {selectedJob["Job Description"]}
            </p>

            {/* Apply Button */}
            <Button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md w-full">
              Apply Now
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecommendJob;
