import api from "../services/api";
import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import Sidebar from "../components/chat/Sidebar";
import ChatHeader from "../components/chat/ChatHeader";
import MessageInput from "../components/chat/MessageInput";
import MessageList from "../components/chat/MessageList";
import type { Message as MessageType, Conversation } from "../types";

const ChatPage = () => {
  const { user } = useAuth();

  //const [inputMessage, setInputMessage] = useState('');
  const [messages, setMessages] = useState<MessageType[]>([]);
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
  const handleSendMessage = async (messageContent: string) => {
    //test
    console.log('Received message content:', messageContent);
    
    // prevents sending message if no conversation exists
    if(!conversationId) {
      alert("Please use 'New Chat' to start ");
    }

    // creates user message object
    const userMessage: MessageType = {
      _id: `temp-${Date.now()}`,
      role: 'user',
      content: messageContent,
      userAvatar: user?.avatar
    };

    // adds user message to UI immediately
    setMessages(prev => [...prev, userMessage]);

    // send to backend and gets AI reponse
    setIsLoading(true);
    try {
      const response = await api.post('/messages', {
        conversationId,
        role: 'user',
        content: messageContent
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
        <ChatHeader />

        {/* messages area  */}
        <MessageList 
          conversationId={conversationId}
          messages={messages}
          isLoading={isLoading}
          userAvatar={user?.avatar}
        />

        {/* input area */}
        <MessageInput 
          onSendMessage={handleSendMessage}
          conversationId={conversationId}
          isLoading={isLoading}
        />

      </div>
    </div>
  );  
};

export default ChatPage;