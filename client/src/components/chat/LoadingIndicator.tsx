const LoadingIndicator = () => {
  return(
    <div className="flex justify-start">
      <div className="bg-white border border-gray-200 px-4 py-3 rounded-lg">
        <div className="flex items-center gap-3">
          {/* AI Avatar */}
          <div className="flex-shrink-0">
            <img 
              src="https://api.dicebear.com/7.x/bottts-neutral/svg?seed=gemini&backgroundColor=8b5cf6" 
              alt="AI thinking" 
              className="w-8 h-8 rounded-full"
            />
          </div>

          {/* bouncing dots */}
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms'}}></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms'}}></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms'}}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingIndicator;
