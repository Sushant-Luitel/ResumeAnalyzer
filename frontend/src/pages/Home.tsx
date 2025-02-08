import { Box } from "@mantine/core";
import { Link, useNavigate } from "react-router-dom";
import Heroimg from "../assets/HeroImg.jpg";
import Footer from "../components/Footer/Footer";

const Home = () => {
  const navigate = useNavigate();
  return (
    <Box>
      <div className="min-h-screen flex flex-col justify-between bg-gradient-to-tr from-teal-600 to-teal-900">
        <div className="flex h-screen justify-center items-center">
          <div className="flex flex-col items-start ml-10 mt-6 -mr-50 z-10 lg:mt-20">
            <h1 className="text-2xl sm:text-3xl lg:text-6xl font-bold tracking-wide text-start">
              <p className="text-gray-100">
                Automated Resume Screening & Optimization
              </p>
            </h1>
            <p className="mt-10 text-lg text-start text-orange-200 w-52">
              Our AI-driven system analyzes resumes, provides feedback, and
              optimizes them to improve job application success rates.
            </p>
            <div className="flex self-start my-10">
              <Link
                className="text-2xl rounded-lg text-gray-100 font-semibold hover:underline hover:text-gray-400 transition duration-300"
                to="/recommend-job"
              >
                Get Started &gt;&gt;
              </Link>
            </div>
          </div>
          <img
            className="border rounded-l-3xl w-2/3 ml-2 my-10"
            src={Heroimg}
            alt="heroimage"
          />
        </div>

        <section id="features" className="py-20 bg-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-semibold text-gray-800 mb-8">
              Features
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div
                className="p-6 bg-white rounded-lg shadow-md hover:shadow-xl transition duration-300 ease-in-out cursor-pointer"
                onClick={() => navigate("/resume-analysis")}
              >
                <h3 className="text-xl font-bold text-gray-700 mb-4">
                  AI-Powered Resume Analysis
                </h3>
                <p className="text-gray-600">
                  Our AI evaluates resumes based on key metrics like skills,
                  experience, and formatting to enhance their effectiveness.
                </p>
              </div>
              <div
                className="p-6 bg-white rounded-lg shadow-md hover:shadow-xl transition duration-300 ease-in-out cursor-pointer"
                onClick={() => navigate("/calculate-ats")}
              >
                <h3 className="text-xl font-bold text-gray-700 mb-4">
                  ATS Compatibility Check
                </h3>
                <p className="text-gray-600">
                  Ensures your resume meets industry-standard ATS requirements,
                  increasing chances of selection.
                </p>
              </div>
              <div className="p-6 bg-white rounded-lg shadow-md hover:shadow-xl transition duration-300 ease-in-out">
                <h3 className="text-xl font-bold text-gray-700 mb-4">
                  Job Match Recommendations
                </h3>
                <p className="text-gray-600">
                  Get personalized job recommendations based on your resume
                  content and qualifications.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="how-it-works" className="py-20">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-semibold text-white mb-8">
              How it Works
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="p-6 bg-white rounded-lg shadow-md hover:shadow-xl transition duration-300 ease-in-out">
                <h3 className="text-xl font-bold text-gray-700 mb-4">
                  1. Upload Resume
                </h3>
                <p className="text-gray-600">
                  Simply upload your resume, and our system will start analyzing
                  its content.
                </p>
              </div>
              <div className="p-6 bg-white rounded-lg shadow-md hover:shadow-xl transition duration-300 ease-in-out">
                <h3 className="text-xl font-bold text-gray-700 mb-4">
                  2. AI Analysis & Scoring
                </h3>
                <p className="text-gray-600">
                  Our AI evaluates your resume and provides detailed feedback on
                  how to improve it.
                </p>
              </div>
              <div className="p-6 bg-white rounded-lg shadow-md hover:shadow-xl transition duration-300 ease-in-out">
                <h3 className="text-xl font-bold text-gray-700 mb-4">
                  3. Download & Apply
                </h3>
                <p className="text-gray-600">
                  Download your optimized resume and apply for jobs with higher
                  chances of success.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </Box>
  );
};

export default Home;
