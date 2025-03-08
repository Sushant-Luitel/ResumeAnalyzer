"use client";

import { useQuery } from "@tanstack/react-query";
import JobCard from "../components/JobCard";
import axios from "axios";

export default function Home() {
  const { data: jobListings } = useQuery({
    queryKey: ["JobListings"],
    queryFn: async () => {
      const response = await axios.get("http://127.0.0.1:8000/job/");
      return response.data;
    },
  });

  console.log(jobListings, "jobListings");
  return (
    <>
      {/* Greeting and Banner */}
      <div className="m-10 bg-white rounded-lg overflow-hidden shadow-sm">
        <div className="flex flex-col md:flex-row">
          <div className="p-6 flex-1">
            <div className="text-sm text-gray-500 mb-1">Friday, June 9th</div>
            <h1 className="text-2xl font-bold">Hi, John Doe!</h1>
          </div>
        </div>
      </div>

      {/* Job Listings */}
      <div className="m-10">
        <div className="flex items-center justify-between mb-4">
          <div className="text-sm font-medium">
            {jobListings?.length?.toLocaleString()} Jobs Found
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {jobListings?.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      </div>
    </>
  );
}
