import { useParams } from "react-router-dom";

const jobData = [
  {
    id: 1,
    title: "Software Engineer - Frontend",
    company: {
      name: "Facebook",
      logo: "F",
      color: "#1877F2",
    },
    location: "California, USA",
    type: "Full time",
    remote: true,
    experience: "2-4 Years",
    salary: "$5,000 - $8,000/m",
    postedTime: "an hour ago",
    description:
      "We are looking for a Frontend Engineer with expertise in React and modern UI frameworks.",
    responsibilities: [
      "Develop and maintain front-end applications",
      "Collaborate with designers and backend engineers",
      "Optimize applications for performance",
    ],
    qualifications: [
      "2+ years of experience with React",
      "Experience with TypeScript and Tailwind",
    ],
  },
  // More jobs can be added here
];

export default function JobDetails() {
  const { jobId } = useParams();
  const job = jobData.find((j) => j.id === parseInt(jobId));

  if (!job) {
    return <div className="text-center text-red-500">Job not found</div>;
  }

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <div className="flex gap-4 items-center">
        <div
          className="h-12 w-12 rounded flex items-center justify-center text-white text-lg font-bold"
          style={{ backgroundColor: job.company.color }}
        >
          {job.company.logo}
        </div>
        <div>
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
            {job.title}
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {job.company.name} • {job.location}
          </p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <span className="px-3 py-1 bg-gray-100 text-gray-800 text-xs font-medium rounded">
          {job.type}
        </span>
        <span className="px-3 py-1 bg-gray-100 text-gray-800 text-xs font-medium rounded">
          {job.remote ? "Remote" : "On-site"}
        </span>
        <span className="px-3 py-1 bg-gray-100 text-gray-800 text-xs font-medium rounded">
          {job.experience}
        </span>
      </div>

      <p className="mt-4 text-gray-700">{job.description}</p>

      <h3 className="mt-6 text-lg font-semibold">Responsibilities</h3>
      <ul className="list-disc pl-5 text-gray-700">
        {job.responsibilities.map((res, idx) => (
          <li key={idx}>{res}</li>
        ))}
      </ul>

      <h3 className="mt-6 text-lg font-semibold">Qualifications</h3>
      <ul className="list-disc pl-5 text-gray-700">
        {job.qualifications.map((qual, idx) => (
          <li key={idx}>{qual}</li>
        ))}
      </ul>

      <div className="mt-6 flex items-center justify-between">
        <span className="text-lg font-semibold text-gray-900">
          {job.salary}
        </span>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
          Apply Now
        </button>
      </div>
    </div>
  );
}
