import { toast } from "react-toastify";
import Button from "../../design/Button";
import { useAuth } from "../../context/authContext";
import MyDropZone from "../FileDropZone/MyDropZone";
import { useRef } from "react";
const CalculateATS = () => {
  const { files } = useAuth();
  const textAreaRef = useRef<HTMLTextAreaElement | null>(null);

  const handleATSCalculation = () => {
    if (files.length < 1) {
      toast.error("Please Upload Your Resume ");
    } else if (
      textAreaRef.current &&
      textAreaRef.current.value.trim().length < 1
    ) {
      toast.error("Fill Job Description");
    }
    toast.error("API integration is not complete");
  };
  return (
    <>
      <div className="grid place-items-center gap-x-20">
        <div className="flex gap-10 mt-10 items-center">
          <MyDropZone />
          <div>
            <label htmlFor="job-description">
              Write or Paste Job Description
            </label>
            <br />
            <textarea
              ref={textAreaRef}
              id="job-description"
              className="mt-2 w-lg p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
              rows={5}
              placeholder="Enter your text here..."
            />
          </div>
        </div>
      </div>
      <div className="mt-20 flex justify-center">
        <Button
          className="bg-amber-600 rounded-xl text-white px-2 py-2 cursor-pointer "
          onClick={handleATSCalculation}
        >
          Calculate ATS Score
        </Button>
      </div>
    </>
  );
};

export default CalculateATS;
