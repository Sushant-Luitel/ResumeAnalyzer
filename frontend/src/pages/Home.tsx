"use client";

import { useQuery } from "@tanstack/react-query";
import JobCard from "../components/JobCard";
import axios from "axios";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

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

  const [currentDate, setCurrentDate] = useState("");
  const [searchTerm, setSearchTerm] = useState(""); // State to hold search query
  const [filteredJobs, setFilteredJobs] = useState(jobListings); // Filtered jobs based on search

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

  useEffect(() => {
    // Filter jobs based on searchTerm
    if (searchTerm) {
      setFilteredJobs(
        jobListings.filter((job) =>
          job.job_title.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    } else {
      setFilteredJobs(jobListings); // If no search term, show all jobs
    }
  }, [searchTerm, jobListings]); // Re-filter whenever searchTerm or jobListings changes

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="relative bg-gradient-to-r from-[#FFD700] to-[#1E3A8A] text-white p-8 rounded-lg shadow-lg text-center">
        <h1 className="text-3xl font-bold">Find Your Dream Job</h1>
        <p className="text-lg mt-2">
          Browse thousands of job listings and start your career journey today.
        </p>

        {/* Search Section */}
        <div className="mt-4 flex justify-center">
          <input
            type="text"
            placeholder="Search jobs..."
            value={searchTerm} // Bind search term to input value
            onChange={(e) => setSearchTerm(e.target.value)} // Update search term on input change
            className="p-3 rounded-l-md w-1/2 focus:outline-none text-gray-800"
          />
          <button className="bg-teal-500 px-6 py-3 rounded-r-md hover:bg-teal-600">
            Search
          </button>
        </div>

        {/* Special Message Section */}
        <div className="mt-8 p-6 bg-gradient-to-r from-[#FFD700] to-[#1E3A8A] rounded-lg shadow-xl text-white">
          <p className="text-2xl font-semibold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-[#FFD700]">
            <strong>
              Discover Exclusive, Tailored Opportunities Just for You
            </strong>
          </p>
          <Link
            to="/personalized-jobs" // Update with the actual route you want to link to
            className="text-white font-medium underline hover:text-teal-200"
          >
            Explore Now
          </Link>
        </div>
      </div>
      {/* Job Listings Section */}
      <h2 className="text-xl font-semibold text-gray-800 text-center my-4">
        {filteredJobs?.length?.toLocaleString() || 0} Jobs Found
      </h2>
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((_, index) => (
            <div
              key={index}
              className="bg-gray-200 h-40 w-full rounded-lg animate-pulse"
            ></div>
          ))}
        </div>
      ) : isError ? (
        <div className="text-center text-red-500">Failed to load jobs.</div>
      ) : filteredJobs?.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredJobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-600">No jobs available.</div>
      )}
    </div>
  );
}
