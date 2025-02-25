import { toast } from "react-toastify";
import Button from "../../design/Button";
import ResumeUpload from "../ResumeUpload/ResumeUpload";
import { useAuth } from "../../context/authContext";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useEffect, useState } from "react";
import Loader from "../reusable/Loader";
import { Link } from "react-router-dom";

const RecommendJob = () => {
  const { files, username, password } = useAuth();
  const [recommendationsData, setRecommendationsData] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);

  const { mutate: recommendJob, isPending } = useMutation({
    mutationFn: async () => {
      const response = await axios.post(
        `http://127.0.0.1:8000/recommend/${username}/`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Basic " + btoa(`${username}:${password}`),
          },
        }
      );
      return response.data;
    },
    onSuccess: (res) => setRecommendationsData(res.recommendations),
    onError: () => toast.error("Failed to fetch job recommendations."),
  });

  useEffect(() => {
    if (files.length < 1) setRecommendationsData([]);
  }, [files]);

  const handleApply = () => {
    toast.success("Applied Successfully");
    setSelectedJob(null);
  };

  if (isPending) return <Loader />;

  return (
    <div className="flex flex-col items-center gap-8 p-6 bg-teal-50 min-h-screen">
      <ResumeUpload />
      <Button
        className="bg-teal-600 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-teal-700 transition"
        onClick={() =>
          files.length > 0
            ? recommendJob()
            : toast.error("Please Upload Your Resume")
        }
      >
        Recommend Job
      </Button>

      <div className="p-6 w-full max-w-5xl">
        <h1 className="text-3xl font-bold text-teal-800 mb-4">
          Recommended Jobs
        </h1>
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {recommendationsData.map((job) => {
            if (job["Similarity"] > 0.4)
              return (
                <button
                  key={job["Job Id"]}
                  onClick={() => setSelectedJob(job)}
                  className="p-4 bg-white shadow-md rounded-lg hover:shadow-lg transition border border-teal-300 cursor-pointer"
                >
                  <h2 className="text-xl font-semibold text-teal-700">
                    {job["Job Title"]}
                  </h2>
                  <p className="text-gray-700">{job["Company"]}</p>
                  <p className="text-gray-600">{job["location"]}</p>
                  <p className="text-teal-800 font-semibold">
                    {job["Salary Range"]}
                  </p>
                </button>
              );
          })}
        </div>
      </div>

      {selectedJob && (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-md bg-black/20 z-50 ">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full relative">
            <button
              onClick={() => setSelectedJob(null)}
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
            >
              ✖
            </button>
            <h2 className="text-2xl font-bold text-teal-800 mb-2">
              {selectedJob["Job Title"]}
            </h2>
            <p className="text-gray-700 font-semibold">
              {selectedJob["Company"]}
            </p>
            <p className="text-gray-600">{selectedJob["location"]}</p>
            <p className="text-teal-800 font-semibold">
              {selectedJob["Salary Range"]}
            </p>
            <p className="text-gray-700 mt-2">
              {selectedJob["Job Description"]}
            </p>

            <Button
              className="mt-4 bg-teal-600 text-white px-4 py-2 rounded-md w-full hover:bg-teal-700 transition cursor-pointer"
              onClick={handleApply}
            >
              Apply Now
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecommendJob;
