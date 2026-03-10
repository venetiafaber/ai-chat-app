import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const HomePage = () => {
  const { user, logout, isLoading } = useAuth();
  // const { user, logout } = useContext(UserContext);
  const navigate = useNavigate();

  // shows login while checking auth
  if(isLoading) {
    return (
      <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
        <div className='animate-spin h-12 w-12 border-4 border-blue-500 border-t-transpatent rounded-full' >
        </div>
      </div>
    );
  }

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return(
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-5xl mb-4">🎉</div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Welcome, {user?.username || 'Guest'}
          </h1>
          {user?.username && 
          <div>
            <p className="text-gray-600">
              You are successfully logged in!
            </p>
          </div>
          }
        </div>

        {/* Start chat button */}
        <Link 
          to='/chat'
          className='block w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold py-4 rounded-lg text-center mb-4
            hover:shadow-lg hover:scale-[1.005]
            active:shadow-sm active:scale-[0.995]
            transition-all duration-150 ease-in-out
            transform'
        >
          Start Chatting
        </Link>

        {/* Profile card */}
        {user?.username && 
          <div>
            <div className="bg-gradient-to-r from-blue-50 to-light-blue-50 rounded-xl p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                Your Profile
              </h2>

              <div className="space-y-3">
                <div className="flex items-center py-2 border-b border-gray-200">
                  <span className="text-gray-600 font-medium w-28">Username:</span>
                  <span className="text-gray-800 font-semibold">{user?.username}</span>
                </div>
                <div className="flex items-center py-2 border-b border-gray-200">
                  <span className="text-gray-600 font-medium w-28">Email:</span>
                  <span className="text-gray-800 font-semibold">{user?.email}</span>
                </div>
              </div>
              
            </div>
          
            <button
              onClick={handleLogout}
              className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg
                hover:shadow-lg hover:bg-blue-700 hover:scale-[1.005]
                active:shadow-sm active:scale-[0.995]
                transition-all duration-150 ease-in-out
                transform"
            >
              Logout
            </button>
          </div>
        }
      </div>
    </div>
  );
};

export default HomePage;