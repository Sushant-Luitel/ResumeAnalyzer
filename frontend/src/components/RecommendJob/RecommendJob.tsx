import { toast } from "react-toastify";
import Button from "../../design/Button";
import ResumeUpload from "../ResumeUpload/ResumeUpload";
import { useAuth } from "../../context/authContext";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useEffect, useState } from "react";
import Loader from "../reusable/Loader";

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

  const { mutate: applyJob } = useMutation({
    mutationFn: async (data: unknown) => {
      const response = await axios.post(
        `http://127.0.0.1:8000/save_job/`,
        data,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Basic " + btoa(`${username}:${password}`),
          },
        }
      );
      return response.data;
    },
    onSuccess: () => {
      setSelectedJob(null);
      toast.success("Applied Successfully");
    },
    onError: () => toast.error("Failed to apply for job."),
  });

  const otherJobs = recommendationsData.filter(
    (job) => job["Similarity"] <= 0.3 && job["Similarity"] > 0
  );
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
        {recommendationsData.length < 1 && (
          <p className="text-gray-600">
            No Recommendations. Upload Your Resume And Get Personalized
            Recommendations
          </p>
        )}
        {recommendationsData.length == 1 &&
          recommendationsData[0] == "Empty" && (
            <p className="text-gray-600">
              No job recommendations found. Please ensure your uploaded file is
              a valid resume with relevant details.
            </p>
          )}
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {recommendationsData.map((job) => {
            if (job["Similarity"] > 0.3)
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
        {otherJobs.length > 0 && (
          <>
            <h1 className="text-3xl font-bold text-teal-800  my-10">
              You Might Also Consider Applying :
            </h1>
            <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 my-4 ">
              {otherJobs.map((job: any) => {
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
          </>
        )}
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
              onClick={() =>
                applyJob({
                  job_title: selectedJob["Job Title"],
                  job_description: selectedJob["Job Description"],
                  job_company: selectedJob["Company"],
                })
              }
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
