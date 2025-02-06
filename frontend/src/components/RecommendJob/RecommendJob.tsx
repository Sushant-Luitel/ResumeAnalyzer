import { toast } from "react-toastify";
import Button from "../../design/Button";
import ResumeUpload from "../ResumeUpload/ResumeUpload";
import { useAuth } from "../../context/authContext";

const RecommendJob = () => {
  const { files } = useAuth();

  const handleRecommendation = () => {
    if (files.length > 0) {
      console.log("call api");
    } else {
      toast.error("Please Upload Your Resume ");
    }
  };
  return (
    <div className="grid place-items-center gap-10">
      <ResumeUpload />
      <Button
        className="bg-amber-600 rounded-xl text-white px-2 py-2 cursor-pointer "
        onClick={handleRecommendation}
      >
        Recommend Job
      </Button>
    </div>
  );
};

export default RecommendJob;
