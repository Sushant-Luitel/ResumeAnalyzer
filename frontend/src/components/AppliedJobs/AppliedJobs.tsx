import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useAuth } from "../../context/authContext";

export default function AppliedJobsPage() {
  const { username, password } = useAuth();

  const {
    data: appliedJobs = {},
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["appliedJobs"],
    queryFn: async () => {
      const response = await axios.get("http://127.0.0.1:8000/applied_jobs/", {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Basic " + btoa(`${username}:${password}`),
        },
      });
      console.log("Applied Jobs Data:", response.data); // Debugging
      return response.data;
    },
  });

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error fetching jobs.</p>;

  // Convert the object into an array of job objects
  const jobList =
    appliedJobs.job_title?.map((title, index) => ({
      job_title: title,
      job_company: appliedJobs.job_company[index] || "Company Not Specified",
      job_description:
        appliedJobs.job_description[index] || "No description available",
    })) || [];

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Applied Jobs</h1>

      {jobList.length > 0 ? (
        <div className="space-y-4">
          {jobList.map((job, index) => (
            <div
              key={index}
              className="border border-gray-300 p-4 rounded-lg shadow-sm hover:shadow-md transition"
            >
              <h2 className="text-lg font-semibold">{job.job_title}</h2>
              <p className="text-gray-600">{job.job_company}</p>
              <p className="text-gray-500 text-sm mt-2">
                {job.job_description}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-center">No jobs applied yet.</p>
      )}
    </div>
  );
}
