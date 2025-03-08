import { useNavigate } from "react-router-dom";
import { Badge } from "../components/ui/badge";

export default function JobCard({ job }) {
  const navigate = useNavigate();

  return (
    <div
      className="bg-white rounded-lg border shadow-sm overflow-hidden cursor-pointer hover:shadow-md transition"
      onClick={() => navigate(`/jobs/${job.id}`)}
    >
      <div className="p-4">
        <div className="flex justify-between">
          <div className="flex gap-3">
            {/* <div
              className="h-10 w-10 rounded flex items-center justify-center text-white text-xs font-bold"
              style={{ backgroundColor: job.company.color }}
            >
              {job.company.logo}
            </div> */}
            <div>
              <h3 className="font-medium dark:text-white">{job.title}</h3>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {job.company_name} • {job.location}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <Badge
            variant="outline"
            className="text-xs font-normal dark:border-gray-600"
          >
            {job.job_type}
          </Badge>
          {/* <Badge
            variant="outline"
            className="text-xs font-normal dark:border-gray-600"
          >
            {job.remote ? "Remote" : "On-site"}
          </Badge> */}
          <Badge
            variant="outline"
            className="text-xs font-normal dark:border-gray-600"
          >
            {job.experience}
          </Badge>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div className="text-xs text-gray-500 dark:text-gray-400">
            {job.expiry_time}
          </div>
          <div className="font-medium dark:text-white">{job.salary}</div>
        </div>
      </div>
    </div>
  );
}
