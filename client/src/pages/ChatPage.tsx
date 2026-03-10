import { useEffect, useState, useRef } from "react";
import { useAuth } from "../contexts/AuthContext";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

interface Message {
  _id: string;
  role: 'user' | 'ai';
  content: string;
  userAvatar?: string;
}

const ChatPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const messageEndRef = useRef<HTMLDivElement>(null);

  const [inputMessage, setInputMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState('');

  // creates a conversation when component mounts
  useEffect(() => {
    const createConversation = async () => {
      try {
        const response = await api.post('/conversations', {
          title: 'New Conversation'
        });
  
        // console.log('Initial Conversation id',response.data.data._id);
        setConversationId(response.data.data._id);

      } catch (error: any) {
        throw new Error(`Error creating conversaton ${error}`)
      }

    };

    createConversation();

  },[]);

  // set up effect to scroll
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth'})
  },[messages]);

  // function that handles user and ai responses
  const handleSendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // prevents sending message if no conversation exists
    if(!conversationId) {
      alert('We are getting ready to interact with you...');
    }
    // prevents sending empty messages
    if(!inputMessage.trim()) return;

    // creates user message object
    const userMessage: Message = {
      _id: `temp-${Date.now()}`,
      role: 'user',
      content: inputMessage,
      userAvatar: user?.avatar
    };

    // adds user message to UI immediately
    setMessages(prev => [...prev, userMessage]);

    // clears input
    setInputMessage('');

    // send to backend and gets AI reponse
    setIsLoading(true);
    try {
      const response = await api.post('/messages', {
        conversationId,
        role: 'user',
        content: inputMessage
      });
  
      // console.log('Backend AI Response:', response.data); 

      const aiMessage: Message = {
        _id: response.data.data.aiMessage._id,
        role: response.data.data.aiMessage.role,
        content: response.data.data.aiMessage.content,
      };

      setMessages(prev => [...prev, aiMessage]);

    } catch (error: any) {
      throw new Error(`response error: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  return(
    <div className="h-screen flex flex-col bg-gray-50">
      
      {/* header */}
      <div className="bg-white border-t border-gray-200 px-6 py-4 flex items-center justify-between">
        
        <button
          onClick={ () => navigate('/')}
          className="text-blue-600 hover:text-blue-800 font-medium transition"
        >
          Home
        </button>
        
        <div className="text-center">
          <h1 className="text-xl font-semibold text-gray-800">AI Chat Assistant</h1>
          <p className="text-sm text-gray-500">Powered by Google Gemini</p>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">{user?.username}</span>
        </div>
      </div>

      {/* messages area  */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">

        {/* loading conversation */}
        {!conversationId && (
          <div className="h-full flex items-center justify-center">
            <div className="text-center text-gray-400">
              <div className="animate-spin h-12 w-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
              <p>Creating conversation...</p>
            </div>
          </div>
        )}

        {/* empty state */}
        {conversationId && messages.length === 0 && (
          <div className="h-full flex items-center justify-center">
            <div className="text-center text-gray-400">
              {/* <div className="text-6xl mb-4">💬</div> */}
              <p className="text-lg">No messages yet</p>
              <p className="text-sm">Start a conversation with your AI assistant</p>
            </div>
          </div>
        )}

        {/* messages list */}
        {messages.map((message) => {
          return(
            <div 
              key={message._id}
              className={`flex ${message.role === 'user' ? 'justify-start' : 'justify-end'} `}
            >
              <div className={`max-w-2xl px-4 py-3 rounded-lg 
                ${message.role === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-800 border border-gray-200'
                }`}
              >
                <div className={`flex items-start gap-3 ${message.role === 'user' ? '' : 'flex-row-reverse' }`}>
                  {/* role */}
                  <div className="flex-shrink-0 text-xl">
                    {message.role === 'ai' 
                      ? (
                        <img 
                          src='https://api.dicebear.com/7.x/bottts-neutral/svg?seed=gemini&backgroundColor=8b5cf6'
                          alt='AI Assistant'
                          className="w-8 h-8 rounded-full"
                        />
                      ) : (
                        <img 
                          src={message.userAvatar || user?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=default'} 
                          alt='User Avatar' 
                          className="w-8 h-8 rounded-full" 
                        />
                      )
                    }
                  </div>
                  {/* content */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm whitespace-pre-wrap m-0 text-left">{message.content}</p>
                  </div>
                </div>
              </div>              
            </div>
          );
        })}

        {/* loading indicator */}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white border border-gray-200 px-4 py-3 rounded-lg">
              <div className="flex items-center space-x-2">
                <div className="text-xl">🤖</div>
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms'}}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms'}}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms'}}></div>
                </div>
              </div>
            </div>
          </div>
        )}
      
        {/* autoscroll div element */}
        <div ref={messageEndRef}></div>

      </div>

      {/* input area */}
      <div className="bg-white border-t border-gray-200 px-6 py-4">
        <form onSubmit={handleSendMessage} className="flex space-x-4">
          <input 
            type="text" 
            value={inputMessage}
            onChange={ (e) => setInputMessage(e.target.value) }
            placeholder={conversationId ? 'Type your message...' : 'Creating Conversation...'}
            disabled={isLoading}
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-gray-800
              focus: ring-2 focus:ring-blue-500 focus:border-transparent
              disabled:bg-gray-100 disabled:cursor-not-allowed
              transition duration-200 outline-none"
          />
          <span>{user?.role}</span>
          <button 
            type="submit"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium
              hover:bg-blue-700 
              disabled:bg-gray-300 disabled:cursor-not-allowed
              transition duration-200
              flex items-center space-x-2"
          >
            <span>Send</span>
          </button>
          
        </form>
      </div>

    </div>
  );  
};

export default ChatPage;