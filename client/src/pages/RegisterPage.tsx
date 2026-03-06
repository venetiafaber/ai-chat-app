import { useState, type SubmitEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
//import { useAuth } from "../contexts/AuthContext";
import { useAuth } from "../contexts/AuthContext";

const RegisterPage = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // gets register from context
  const { register } = useAuth();
  //const { register } = useContext(AuthContext);

  const navigate = useNavigate();

  // handle form submission
  const handleSubmit = async (e: SubmitEvent) => {
    e.preventDefault(); 
    setError('');  // clears previous errors

    // client-side validations
    if(password !== confirmPassword) {
      setError('Passwords do not match');
      return;   // stops form submission
    }
    if(password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }
    if(username.length < 3) {
      setError('Username must be at least 3 characters');
      return;
    }
    setIsLoading(true);

    try {
      // calls register from AuthContext
      await register(username, email, password);
  
      // success redirect to home 
      navigate('/');

    } catch (err: any) {
      setError(err.message || 'Registeration failed');
    } finally {
      setIsLoading(false);
    }
  }

  return(
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-5xl mb-4">🤖</div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Sign Up
          </h1>
          <p className="text-gray-600">
            Join us and start chatting with your AI assistant
          </p>
        </div>

        {/* error message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}
        

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* username */}
          <div>
            <label 
              htmlFor='username'
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Username
            </label>
            <input 
              id='username'
              type='text'
              value={username}
              onChange={ (e) => setUsername(e.target.value) }
              required
              placeholder='Please enter a username'
              minLength={3}
              maxLength={20}
              disabled={isLoading}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg
                focus:ring-2 focus:ring-blue-500 focus:border-transparent
                transition duration-200 outline-none
                disabled:bg-gray-100 disabled:cursor-not-allowed
                "
            />
          </div>

          {/* email */}
          <div>
            <label 
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-2"
            >Email</label>
            <input 
              id='email'
              type='email'
              value={email}
              onChange={ (e) => setEmail(e.target.value) }
              required
              placeholder='Please enter a valid email'
              disabled={isLoading}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg
                focus:ring-2 focus:ring-blue-500 focus:border-transparent
                transition duration-200 outline-none
                disabled:bg-gray-100 disabled:cursor-not-allowed
                "
            />
          </div>

          {/* password */}
          <div>
            <label 
              htmlFor='password'
              className="block text-sm font-medium text-gray-700 mb-2"
            ></label>
            <input 
              id='password'
              type='password'
              value={password}
              onChange={ (e) => setPassword(e.target.value) }
              required
              placeholder='Password must be 8 digits long'
              disabled={isLoading}
              minLength={8}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg
                focus:ring-2 focus:ring-blue-500 focus:border-transparent
                transition duration-200 outline-none
                disabled:bg-gray-100 disabled:cursor-not-allowed
                "
            />
          </div>

          {/* confirm password */}
          <div>
            <label 
              htmlFor='confirmPassword'
              className="block text-sm font-medium text-gray-700 mb-2"
            ></label>
            <input 
              id='confirmPassword'
              type='password'
              value={confirmPassword}
              onChange={ (e) => setConfirmPassword(e.target.value) }
              required
              placeholder='Confirm password must match the password field'
              minLength={8}
              disabled={isLoading}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg
                focus:ring-2 focus:ring-blue-500 focus:border-transparent
                transition duration-200 outline-none
                disabled:bg-gray-100 disabled:cursor-not-allowed
                "
            />
          </div>

          <button
            type='submit'
            className="
              w-full bg-blue-600 text-white font-semibold py-3 rounded-lg
              hover:shadow-lg hover:bg-blue-700 hover:scale-[1.005]
              active:shadow-sm active:scale-[0.995]
              transition-all duration-150 ease-in-out
              transform
              "
          >
            {isLoading ? "Creating account... " : "Sign Up"}
          </button>
          
        </form>

        {/* login link */}
        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Already have an account?
            <Link
              to="/login"
              className="text-blue-600 hover:text-blue-700 font-semibold hover:underline ml-2"
            >
              Sign In
            </Link>
          </p>
        </div>

        {/* debug info (to remove later) */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <p className="text-xs text-gray-500 font-mono">
            Debug: Username = { username || '(empty)' }
          </p>
          <p className="text-xs text-gray-500 font-mono">
            Debug: Email = { email || '(empty)' }
          </p>
          <p className="text-xs text-gray-500 font-mono">
            Debug: Password = { password ? (password.length) : '(empty)' }
          </p>
          <p className="text-xs text-gray-500 font-mono">
            Debug: Match Password = { password && confirmPassword ? (password === confirmPassword ? 'Yes' : 'No') : '(empty)' }
          </p>
        </div>

      </div>
    </div>
  );
}

export default RegisterPage;