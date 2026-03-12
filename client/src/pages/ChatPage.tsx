import { useEffect, useState, useRef } from "react";
import { useAuth } from "../contexts/AuthContext";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import type { Message, Conversation } from "../types";

const ChatPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const messageEndRef = useRef<HTMLDivElement>(null);

  const [inputMessage, setInputMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);

  // fetches conversations when chatpage component mounts
  useEffect(() => {
    fetchConversations();
  },[]);

  // fetches all conversations of a user
  const fetchConversations = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/conversations');
      setConversations(response.data.data);
      
    } catch (error) {
      console.error('Error fetching conversations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // auto-scroll
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth'})
  },[messages]);

  // creates new conversation
  const createNewConversation = async () => {
    try {
      const response = await api.post('/conversations', {
        title: 'New Conversation'
      });

      const newConversation = response.data.data;

      setConversationId(newConversation._id);
      setMessages([]);  // clears any messages from previous conversation

      // adds the new conversation to the conversation array
      setConversations(prev => [newConversation, ...prev]);

    } catch (error) {
      console.error(`Error creating conversaton`,  error);
    }
  };

  // loads existing conversation
  const loadConversation = async (convId: string) => {
    try {
      setConversationId(convId);  // sets the chatpages current conversation id to the id that is passed

      const response = await api.get(`/messages?conversationId=${convId}`);
      setMessages(response.data.data);

    } catch (error) {
      console.error('Failed to load conversation', error);
    }
  };

  // deletes a conversation
  const deleteConversation = async (convId: string) => {
   try {
    await api.delete(`/conversations/${convId}`);

    // removes the conversation from the array
    setConversations(prev => prev.filter((conv) => conv._id !== convId));

    console.log('Deleted conversation', convId);

    // if deleted current conversation, clear chat
    if(convId === conversationId) {
      setConversationId(null);
      setMessages([]);
    }

   } catch (error) {
    console.error('Error deleting conversation', error);
   }
  }

  // function that handles user and ai responses
  const handleSendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // prevents sending message if no conversation exists
    if(!conversationId) {
      alert("Please use 'New Chat' to start ");
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

      const { aiMessage, conversation } = response.data.data;

      // adds ai message to UI
      setMessages(prev => [...prev, {
        _id: aiMessage._id,
        role: aiMessage.role,
        content: aiMessage.content,
        createdAt: aiMessage.createdAt
      }]);


      // updates conversation in sidebar
      if(conversation) {
        setConversations(prev => 
          prev.map(conv => 
            conv._id === conversationId 
            ? {
              ...conv,
              title: conversation.title,
              messageCount: conversation.messageCount  
            }
            : conv
          )
        );

        console.log('Updated conversation:', {
          id: conversationId,
          newTitle: conversation.title,
          newCount: conversation.messageCount
        });
      }
      
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message');

      setMessages(prev => prev.filter(msg => msg._id !== userMessage._id));
      setInputMessage(userMessage.content);

    } finally {
      setIsLoading(false);
    }
  };

  return(
    <div className="h-screen flex bg-gray-50">

      {/* sidebar */}
      <Sidebar 
        currentConversationId={conversationId}
        onSelectConversation={loadConversation}
        onNewConversation={createNewConversation}
        onDeleteConversation={deleteConversation}
        conversations={conversations}
      />

      {/* main chat area  */}
      <div className="flex-1 flex flex-col">

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

          {/* welcome state: no conversations yet */}
          {!conversationId && (
            <div className="h-full flex items-center justify-center">
              <div className="text-center text-gray-400">
                <p className="text-lg font-medium text-gray-800">Welcome to AI Chat!</p>
                <p className="text-sm mt-2">Click 'New Chat' to start a conversation</p>
                <p className="text-xs mt-1">or select an existing conversation from the side bar</p>
              </div>
            </div>
          )}

          {/* empty state: conversation exists but no messages */}
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
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0">
                    <img 
                      src="https://api.dicebear.com/7.x/bottts-neutral/svg?seed=gemini&backgroundColor=8b5cf6" 
                      alt="AI thinking" 
                      className="w-8 h-8 rounded-full"
                    />
                  </div>
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
              placeholder={conversationId ? 'Type your message...' : "Click 'New Chat' to start"}
              disabled={isLoading || !conversationId}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-gray-800
                focus: ring-2 focus:ring-blue-500 focus:border-transparent
                disabled:bg-gray-100 disabled:cursor-not-allowed
                transition duration-200 outline-none"
            />
            {/* <span>{user?.role}</span> */}
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
    </div>
  );  
};

export default ChatPage;