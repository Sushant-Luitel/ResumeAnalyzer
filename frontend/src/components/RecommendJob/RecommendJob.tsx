import { toast } from "react-toastify";
import Button from "../../design/Button";
import ResumeUpload from "../ResumeUpload/ResumeUpload";
import { useAuth } from "../../context/authContext";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useEffect, useState } from "react";
import Loader from "../reusable/Loader";

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
      {recommendationsData?.length > 1 &&
        recommendationsData?.every(
          (data: JobDetails) => data.Similarity > 0.5
        ) && (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-300 shadow-md rounded-lg">
              <thead className="bg-gray-200">
                <tr>
                  <th className="px-4 py-2 text-left border-b">Job Title</th>
                  <th className="px-4 py-2 text-left border-b">Work Type</th>
                  <th className="px-4 py-2 text-left border-b">Salary Range</th>
                  <th className="px-4 py-2 text-left border-b">Experience</th>
                </tr>
              </thead>
              <tbody>
                {recommendationsData?.map((data: JobDetails, index: number) => {
                  if (data.Similarity > 0.4)
                    return (
                      <tr
                        key={index}
                        className="hover:bg-gray-100 transition duration-300 ease-in-out"
                      >
                        <td className="px-4 py-2 border-b">
                          {data["Job Title"]}
                        </td>
                        <td className="px-4 py-2 border-b">
                          {data["Work Type"]}
                        </td>
                        <td className="px-4 py-2 border-b">
                          {data["Salary Range"]}
                        </td>
                        <td className="px-4 py-2 border-b">
                          {data["Experience"]}
                        </td>
                      </tr>
                    );
                })}
              </tbody>
            </table>
          </div>
        )}
      {recommendationsData.length > 1 &&
        recommendationsData?.every(
          (data: JobDetails) => data.Similarity < 0.5
        ) && (
          <h1 className="text-red-800 text-xl sm:text-2xl font-semibold p-4 rounded-lg shadow-md text-center bg-teal-300">
            No Suitable Jobs Found. Please Consider Improving Your Resume.
          </h1>
        )}
    </div>
  );
};

export default RecommendJob;
