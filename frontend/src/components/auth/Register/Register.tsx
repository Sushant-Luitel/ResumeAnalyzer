import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

export default function JobDetails() {
  const { jobId } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchJob() {
      try {
        const response = await fetch(`/api/jobs/${jobId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch job details");
        }
        const data = await response.json();
        setJob(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchJob();
  }, [jobId]);

  if (loading) {
    return (
      <div className="text-center text-blue-500">Loading job details...</div>
    );
  }

  if (error) {
    return <div className="text-center text-red-500">Error: {error}</div>;
  }

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      {/* Job Header */}
      <div className="flex gap-4 items-center">
        <div>
          <h1 className="text-xl font-bold text-gray-900">{job.job_title}</h1>
          <p className="text-sm text-gray-600">
            {job.company_name} • {job.location}
          </p>
        </div>
      </div>

      {/* Job Tags */}
      <div className="mt-4 flex flex-wrap gap-2">
        <span className="px-3 py-1 bg-blue-100 text-blue-600 text-xs font-medium rounded">
          {job.job_type === "FT" ? "Full-Time" : "Part-Time"}
        </span>
      </div>

      {/* Job Description */}
      <p className="mt-4 text-gray-700">{job.job_description}</p>

      {/* Job Requirements */}
      <h3 className="mt-6 text-lg font-semibold text-gray-900">Requirements</h3>
      <ul className="list-disc pl-5 text-gray-700">
        {job.job_requirements.split("\r\n").map((req, idx) => (
          <li key={idx}>{req}</li>
        ))}
      </ul>

      {/* Footer Section */}
      <div className="mt-6 flex items-center justify-between">
        <span className="text-lg font-semibold text-gray-900">
          NPR {Number(job.salary).toLocaleString()}
        </span>
        <span className="text-xs text-gray-500">
          Expiry Date: {new Date(job.expiry_time).toDateString()}
        </span>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
          Apply Now
        </button>
      </div>
    </div>
  );
}
