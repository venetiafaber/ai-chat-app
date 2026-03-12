import type { Conversation } from "../types";

interface SidebarProps {
  currentConversationId: string | null;
  onSelectConversation: (conversationId: string) => void;     // function to call when user clicks a conversation
  onNewConversation: () => void;        // function to call when user clicks New Chat
  conversations: Conversation[];    // receives from chatpage
  onDeleteConversation: (conversationId: string) => void
}

const Sidebar = ({ 
  currentConversationId, 
  onSelectConversation, 
  onNewConversation,
  conversations,
  onDeleteConversation,
}: SidebarProps) => {
  
  //const [isLoading, setIsLoading] = useState(false);

  // deletes a conversation - will write later
  const handleDelete = async (conversationId: string, e: React.MouseEvent) => {
    e.stopPropagation();    

    // confirms with user
    if(!confirm('Delete this conversation?')) return;
    
    // tells parent to delete
    onDeleteConversation(conversationId);
  };

  return(
    <div className="w-64 bg-gray-800 text-white flex flex-col h-full rounded-lg">

      {/* header: new chat button */}
      <div className="p-4 border-b border-gray-700">
        <button
          onClick={onNewConversation}   // call this function from chat page
          className="w-full flex items-center justify-center space-x-2 bg-blue-600
            hover:bg-blue-700 text-white px-4 py-3
            rounded-lg transition
            "
        >
          {/* plus icon */}
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
              d="M12 4v16m8-8H4" />
          </svg>
          <span className="font-medium">New Chat</span>
        </button>
      </div>

      {/* conversation list */}
      <div className="flex-1 overflow-y-auto p-2">

        {/* loading state  */}
        {/* {isLoading 
        ? (
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full">
            </div>
          </div>
        ) :  */}
        { conversations.length === 0 ? (
          <div className="text-center text-gray-400 py-8 px-4">
            <p className="text-sm">No conversations yet</p>
            <p className="text-xs mt-1">Start a new chat</p>
          </div>
        ) : (
          <div className="space-y-2">
            {/* conversations  */}
            {conversations.map((conversation) => (
              <div 
                key={conversation._id}
                onClick={() => onSelectConversation(conversation._id)}
                className={`p-3 rounded-lg cursor-pointer transition
                  ${conversation._id === currentConversationId
                    ? 'bg-gray-700'
                    : 'hover:bg-gray-800'
                  }
                `}
              >
                <div className="flex items-center justify-between">

                  <div className="flex-1 min-w-0">
                    {/* truncate long titles */}
                    <h3 className="text-sm font-medium truncate">
                      {conversation.title}
                    </h3>

                    {/* message count */}
                    <p className="text-xs text-gray-400 mt-1">
                      {conversation.messageCount} messages
                    </p>
                  </div>

                  {/* delete button */}
                  <button
                    onClick={(e) => {handleDelete(conversation._id, e)}}
                    className="ml-2 p-1 hover:bg-red-600 rounded transition"
                  >
                    {/* Trash icon */}
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" 
                      viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
              )
            )}
          </div>
        )}
      </div>

      {/* footer */}
      <div className="p-4 border-t border-gray-700">
        <p className="text-xs text-gray-400 text-center">
          {conversations.length} conversation{conversations.length !== 1 ? 's' : ''}
        </p>
      </div>
      
    </div>
  );

}

export default Sidebar;