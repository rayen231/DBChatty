import React from "react";
import { Link } from "react-router-dom";
import { CiRepeat } from "react-icons/ci";
import logo from "../logocrda.png"; // Adjust the path as necessary

const SideBar: React.FC = () => {
  return (
    <div className="flex flex-col">
      {/* Navigation Bar */}
      <nav className="flex justify-center items-center h-20 bg-gray-900 text-white shadow-lg">
        <ul className="flex justify-center items-center gap-[13vw] text-3xl">
          <li className="relative group">
            <Link to="/compo/chatbot" className="sidebar-icon">
              Chat
            </Link>
            <span className="absolute bottom-full mb-2 hidden text-sm text-white bg-black rounded px-2 py-1 group-hover:block">
              Start a chat
            </span>
          </li>
          <li className="relative flex items-center justify-center h-16 w-16 bg-gray-800 text-green-500 rounded-full shadow-lg group">
            <Link to="/">
              <img src={logo} alt="Logo" className="h-12 w-12" />
            </Link>
            <span className="absolute bottom-full mb-2 hidden text-sm text-white bg-black rounded px-2 py-1 group-hover:block">
              Welcome
            </span>
          </li>
          <li className="relative group">
            <Link to="/compo/library" className="sidebar-icon">
              Library
            </Link>
            <span className="absolute bottom-full mb-2 hidden text-sm text-white bg-black rounded px-2 py-1 group-hover:block">
              View library
            </span>
          </li>
        </ul>
      </nav>
      <div></div>
    </div>
  );
};

export default SideBar;
