import type { Message as MessageType } from "../../types";

interface MessageProps {
  message: MessageType;
  userAvatar?: string;
}

const Message = ({message, userAvatar}: MessageProps ) => {

  return (
    <div 
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
                  src={message.userAvatar || userAvatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=default'} 
                  alt='User Avatar' 
                  className="w-8 h-8 rounded-full" 
                />
              )
            }
          </div>
          {/* content */}
          <div className="flex-1 min-w-0">
            <p className="text-sm whitespace-pre-wrap m-0 text-left leading-relaxed">
              {message.content}
            </p>
          </div>
        </div>
      </div>              
    </div>
  );
};

export default Message;
