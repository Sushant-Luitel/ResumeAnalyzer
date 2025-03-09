"use client";

import { useQuery } from "@tanstack/react-query";
import JobCard from "../components/JobCard";
import axios from "axios";
import { useState, useEffect } from "react";
import { useAuth } from "../context/authContext";
import RecommendationJobCard from "../components/RecommendationJobCard";
import MyDropZone from "../components/FileDropZone/MyDropZone";

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

  const { username, password, fullName, files } = useAuth();

  const { data: featuredJobs, isLoading: isLoadingFeaturedJobs } = useQuery({
    queryKey: ["RecommendJob"],
    queryFn: async () => {
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
      const { recommendations } = response.data;
      return recommendations;
    },
    enabled: files.length > 0,
  });

  console.log(featuredJobs);

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

  // Tab management
  const [activeTab, setActiveTab] = useState("all"); // "all" | "featured"

  // Filter featured jobs
  console.log(featuredJobs, "featuredJobs");

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Greeting and Banner */}
      <div className="m-10 bg-white rounded-lg overflow-hidden shadow-md p-6">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div>
            <div className="text-sm text-gray-500">{currentDate}</div>
            <h1 className="text-2xl font-bold text-gray-800">
              Hi, {fullName} 👋
            </h1>
            <p className="text-gray-600 mt-1">
              Find your next opportunity from the latest job postings.
            </p>
          </div>
        </div>
      </div>

      <MyDropZone />

      {/* Tab Navigation */}
      <div className="m-10">
        <div className="flex items-center justify-center space-x-4 mb-6">
          <button
            onClick={() => setActiveTab("all")}
            className={`px-4 py-2 font-semibold rounded-md ${
              activeTab === "all"
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-800"
            }`}
          >
            All Jobs
          </button>
          <button
            onClick={() => setActiveTab("featured")}
            className={`px-4 py-2 font-semibold rounded-md ${
              activeTab === "featured"
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-800"
            }`}
          >
            Featured Jobs
          </button>
        </div>

        {/* Job Listings */}
        <h2 className="text-xl font-semibold text-gray-800 text-center mb-4">
          {activeTab === "all"
            ? `${jobListings?.length?.toLocaleString() || 0} Jobs Found`
            : `${featuredJobs?.length || 0} Featured Jobs`}
        </h2>

        {isLoading ? (
          <div className="text-center text-gray-600">Loading jobs...</div>
        ) : isError ? (
          <div className="text-center text-red-500">Failed to load jobs.</div>
        ) : activeTab === "all" ? (
          jobListings?.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {jobListings.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-600">No jobs available.</div>
          )
        ) : featuredJobs?.length == 0 ? (
          <div>
            <h1 className="text-3xl font-bold text-teal-800 mb-4">
              Recommended Jobs
            </h1>
            <div className="text-center text-gray-600">
              No featured jobs available.
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredJobs?.map((job) => (
              <RecommendationJobCard
                key={job["Job Id"]}
                job={job}
                isLoadingFeaturedJobs={isLoadingFeaturedJobs}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
