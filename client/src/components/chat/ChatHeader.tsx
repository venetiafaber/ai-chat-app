import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const ChatHeader = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
      <div className="bg-gray-800 border-b border-gray-700 px-6 py-4 flex items-center justify-between">
        <button
          onClick={() => navigate("/")}
          className="text-blue-400 hover:text-blue-300 font-medium transition flex items-center space-x-2"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 191-7-7m0 017-7m-7 7h18"
            />
          </svg>
          <span>Home</span>
        </button>

        {/* title */}
        <div className="text-center">
          <h1 className="text-xl font-semibold text-white">
            AI Chat Assistant
          </h1>
          <p className="text-sm text-gray-300">Powered by Google Gemini</p>
        </div>

        {/* user avatar */}
        <div className="flex items-center space-x-3">
          <img
            src={
              user?.avatar ||
              "https://api.dicebear.com/7.x/avataaars/svg?seed=default"
            }
            alt={user?.username || "User"}
            className="w-8 h-8 rounded-full ring-2 ring-gray-600"
          />
          <span className="text-sm text-gray-300 font-medium">
            {user?.username}
          </span>
        </div>

      </div>
    
  );
};

export default ChatHeader;
