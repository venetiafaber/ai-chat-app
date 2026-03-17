interface WelcomeScreenProps {
  conversationId?: string | null;
  messageLength: number;
}

const WelcomeScreen = ({ conversationId, messageLength}: WelcomeScreenProps) => {
  // dont show anything if there are messages
  if (conversationId && messageLength > 0) {
      return null;
  }

  // no conversation selected
  if(!conversationId) {
    return(
      <div className="h-full flex items-center justify-center">
        <div className="text-center text-gray-400">
          <p className="text-lg font-medium text-gray-800">Welcome to AI Chat!</p>
          <p className="text-sm mt-2">Click 'New Chat' to start a conversation</p>
          <p className="text-xs mt-1">or select an existing conversation from the side bar</p>
        </div>
      </div>
    );
  }

  // conversation selected but no message
  return(
    <div className="h-full flex items-center justify-center">
        <div className="text-center text-gray-400">
          <p className="text-lg">No messages yet</p>
          <p className="text-sm">Start a conversation with your AI assistant</p>
        </div>
      </div>
  );
}

export default WelcomeScreen;