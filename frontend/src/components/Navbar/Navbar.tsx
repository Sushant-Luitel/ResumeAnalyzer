import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, BrainCircuit } from "lucide-react";
import { useAuth } from "../../context/authContext";
import Modal from "../reusable/Modal";

const Navbar = () => {
  const { logOut } = useAuth();
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  const toggleNavbar = () => {
    setMobileDrawerOpen(!mobileDrawerOpen);
  };

  return (
    <>
      <nav className="sticky top-0 z-50 py-3 backdrop-blur-lg border-b border-neutral-700/80">
        <div className="container px-4 mx-auto text-sm relative">
          <div className="flex justify-between items-center">
            <Link to={"/"} className="flex items-center flex-shrink-0">
              <BrainCircuit className=" h-10 w-16" />
              <span className="text-2xl font-bold text-teal-950">ARSS</span>
            </Link>
            <ul className=" hidden lg:flex ml-96 space-x-12 text-teal-950">
              <li>
                <a href="#features">Features</a>
              </li>
              <li>
                <a href="#how-it-works">How it works</a>
              </li>

              <li>
                <a href="https://www.overleaf.com/">Build Resume</a>
              </li>
            </ul>
            <div className=" hidden lg:flex justify-center items-center">
              <button
                className="border border-black bg-gradient-to-r from-teal-800 to-teal-600 px-4 py-2 rounded text-white cursor-pointer"
                onClick={() => setIsOpen(true)}
              >
                Log Out
              </button>
            </div>
            <div className="lg:hidden md:flex flex-col justify-end">
              <button onClick={toggleNavbar}>
                {mobileDrawerOpen ? <X /> : <Menu />}
              </button>
            </div>
          </div>
          {mobileDrawerOpen && (
            <div className=" fixed right-0 z-20 bg-white w-full p-12 flex flex-col justify-center items-center lg:hidden">
              <ul>
                <li className=" py-4">
                  <a href="#">Features</a>
                </li>
                <li className=" py-4">
                  <a href="#">How it works</a>
                </li>
                <li className=" py-4">
                  <a href="#">Contact</a>
                </li>
                <li>
                  <a href="https://www.overleaf.com/">Build Resume</a>
                </li>
              </ul>
              <div className=" flex space-x-6">
                <button
                  className="border border-black bg-gradient-to-r from-teal-800 to-teal-600 px-4 py-2 rounded text-white"
                  onClick={() => logOut()}
                >
                  Log Out
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <div className="bg-white p-6 rounded-lg  w-80 text-center">
          <h2 className="text-lg font-semibold text-gray-800">
            Are you sure you want to logout?
          </h2>

          <div className="mt-4 flex justify-center gap-4">
            <button
              onClick={logOut}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition cursor-pointer"
            >
              Yes
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400 transition cursor-pointer"
            >
              No
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default Navbar;
