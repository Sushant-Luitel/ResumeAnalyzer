"use client";

import { useQuery } from "@tanstack/react-query";
import JobCard from "../components/JobCard";
import axios from "axios";
import { useState, useEffect } from "react";

export default function Home() {
  const {
    data: jobListings,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["JobListings"],
    queryFn: async () => {
      const response = await axios.get("http://127.0.0.1:8000/job/");
      return response.data;
    },
  });

  // Get the current date dynamically
  const [currentDate, setCurrentDate] = useState("");

  useEffect(() => {
    const date = new Date();
    setCurrentDate(
      date.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    );
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Greeting and Banner */}
      <div className="m-10 bg-white rounded-lg overflow-hidden shadow-md p-6">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div>
            <div className="text-sm text-gray-500">{currentDate}</div>
            <h1 className="text-2xl font-bold text-gray-800">
              Hi, John Doe! 👋
            </h1>
            <p className="text-gray-600 mt-1">
              Find your next opportunity from the latest job postings.
            </p>
          </div>
          <button className="mt-4 md:mt-0 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700 transition">
            Post a Job
          </button>
        </div>
      </div>

      {/* Job Listings */}
      <div className="m-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-800">
            {jobListings?.length?.toLocaleString() || 0} Jobs Found
          </h2>
        </div>

        {isLoading ? (
          <div className="text-center text-gray-600">Loading jobs...</div>
        ) : isError ? (
          <div className="text-center text-red-500">Failed to load jobs.</div>
        ) : jobListings?.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobListings.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-600">No jobs available.</div>
        )}
      </div>
    </div>
  );
}
