import { useRef, useEffect } from "react";
import Message from "./Message";
import LoadingIndicator from "./LoadingIndicator";
import WelcomeScreen from "./WelcomeScreen";
import type { Message as MessageType } from "../../types";

interface MessageListProps {
  conversationId: string | null;
  messages: MessageType[];
  isLoading: boolean;
  userAvatar?: string;
}

const MessageList = ({ conversationId, messages, isLoading, userAvatar }: MessageListProps) => {
  const messageEndRef = useRef<HTMLDivElement>(null);

  // auto-scroll
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth'});
  },[messages]);

  return(
    <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">

      <WelcomeScreen 
        conversationId={conversationId}
        messageLength={messages.length}
      />

      {messages.map((message) => {
        return(
          <Message 
            key={message._id} 
            message={message} 
            userAvatar={userAvatar}
          />
        );
      })}

      {/* loading indicator */}
      {isLoading && <LoadingIndicator /> }
    
      {/* autoscroll div element */}
      <div ref={messageEndRef}></div>
    </div>
  );
}

export default MessageList;