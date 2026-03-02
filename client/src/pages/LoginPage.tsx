// gets email and password from a form

import { useState, type SubmitEvent } from "react";

const LoginPage = () => {
  // state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: SubmitEvent) => {
    e.preventDefault(); // prevents page refresh (data remains, js handles the data)
    setIsLoading(true);

    // logs for now - logic to be written later
    console.log("Login attempt:", { email, password });

    // stimulates API call
    setTimeout(() => {
      console.log(`Logged in as: ${email}`);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-light-blue-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-5xl mb-4">🤖</div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Welcome Back!
          </h1>
          <p className="text-gray-600">
            Sign in to continue to your AI assistant
          </p>
        </div>

        {/* form  */}
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* email input */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="youremail@example.com"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg
                focus:ring-2 focus:ring-blue-500 focus:border-transparent
                transition duration-200 outline-none
                disabled:bg-gray-100 disabled:cursor-not-allowed
                "
            />
          </div>

          {/* password input */}
          <div>
            <label 
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="********"
              minLength={8}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg
                focus:ring-2 focus:ring-blue-500 focus:border-transparent
                transition duration-200 outline-none
                disabled:bg-gray-100 disabled:cursor-not-allowed
                "
            />
            <p className="mt-1 text-sm text-gray-500">
              Must be atleast 8 characters
            </p>
          </div>

          {/* Submit Button */}
          <button 
            type="submit"
            className="
              w-full bg-blue-600 text-white font-semibold py-3 rounded-lg
              hover:shadow-lg hover:bg-blue-700 hover:scale-[1.005]
              active:shadow-sm active:scale-[0.995]
              transition-all duration-150 ease-in-out
              transform
              "
          >
            {isLoading ? "Signing in... " : "Sign In"}
          </button>
        </form>

        {/* Register Link */}
        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Dont have an account?
            <a 
              href="/register"
              className="text-blue-600 hover:text-blue-700 font-semibold hover:underline"
            >
              Sign Up
            </a>
          </p>
        </div>

        {/* debug info (to remove later) */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <p className="text-xs text-gray-500 font-mono">
            Debug: Email = { email || '(empty)' }
          </p>
          <p className="text-xs text-gray-500 font-mono">
            Debug: Password = { password || '(password)' }
          </p>
        </div>

      </div>
    </div>
  );
};

export default LoginPage;
