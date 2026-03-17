import { useState } from "react";

interface MessageInputProps {
  onSendMessage: (message: string) => void;
  conversationId: string | null;
  isLoading: boolean;
}

const MessageInput = ({onSendMessage, conversationId, isLoading }: MessageInputProps) => {
  const [inputMessage, setInputMessage] = useState('');

   // function that handles user and ai responses
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // prevents sending message if no conversation exists
    if(!conversationId) {
      alert("Please use 'New Chat' to start ");
    }
    
    // prevents sending empty messages
    if(!inputMessage.trim()) return;

    // passes message content to parent
    onSendMessage(inputMessage);

    // clears input
    setInputMessage('');

  };

  return(
    <div className="bg-white border-t border-gray-200 px-6 py-4">
      <form onSubmit={handleSubmit} className="flex space-x-4">
        <input 
          type="text" 
          value={inputMessage}
          onChange={ (e) => setInputMessage(e.target.value) }
          placeholder={conversationId ? 'Type your message...' : "Click 'New Chat' to start"}
          disabled={isLoading || !conversationId}
          className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-gray-800
            focus: ring-2 focus:ring-blue-500 focus:border-transparent
            disabled:bg-gray-100 disabled:cursor-not-allowed
            transition duration-200 outline-none"
        />
        <button 
          type="submit"
          disabled={isLoading || !conversationId}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium
            hover:bg-blue-700 
            disabled:bg-gray-300 disabled:cursor-not-allowed
            transition duration-200
            flex items-center space-x-2"
        >
          <span>Send</span>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
              d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        </button>
        
      </form>
    </div>
  );
};

export default MessageInput;