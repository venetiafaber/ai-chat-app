import Message from '../models/Message.js';
import Conversation from '../models/Conversation.js';

// gets all messages for a conversation
// route: GET /api/messages?:id
export const getMessages = async (req, res, next) => {
  try {
    const { conversationId, limit = 50} = req.query;
    
    if (!conversationId) {
      const error = new Error('Conversation ID is required');
      error.statusCode = 400;
      throw error;
    }

    const conversation = await Conversation.findById(conversationId);

    if(!conversation) {
      const error = new Error('Conversation not found');
      error.statusCode = 404;
      throw error;
    }

    // authorization check: verifies if the conversation belongs to the logged-in user
    if(req.user._id.toString() !== conversation.user.toString()) {
      const error = new Error('Not authorized to access this message');
      error.statusCode = 403;
      throw error;
    }

    // gets messages
    const messages = await Message.find({
      conversation: conversationId
    })
      .sort({ createdAt: 1 })
      .limit(parseInt(limit))
      .populate('conversation', 'title')
    ;

    res.status(200).json({
      success: true,
      count: messages.length,
      data: messages
    });

  } catch (error) {
    next(error);
  }
};

// creates a new message in a conversation
// route: POST /api/messages
export const createMessage = async (req, res, next) => {
  try {
    const { conversationId, role, content } = req.body;

    if(!conversationId || !role || !content) {
      const error = new Error('Conversation ID, role and content are required');
      error.statusCode = 400;
      throw error;
    }

    // validate role
    if(!['user', 'ai'].includes(role)) {      // Array.includes()
      const error = new Error('Role must be either "user" or "ai"');
      error.statusCode = 400;
      throw error;
    }

    // finds conversation
    const conversation = await Conversation.findById(conversationId);
    
    if(!conversation) {
      const error = new Error('Conversation not found');
      error.statusCode = 404;
      throw error;
    }

    if(!conversation.isActive) {
      const error = new Error('Cannot add message to deleted conversation');
      error.statusCode = 400;
      throw error;
    }

    // authorization check: verifies if the conversation belongs to the logged-in user
    if(req.user._id.toString() !== conversation.user.toString()) {
      const error = new Error('Not authorized to access this message');
      error.statusCode = 403;
      throw error;
    }

    // creates message
    const message = await Message.create({
      conversation: conversationId,
      role,
      content,
      metadata: {
        tokensUsed: 0,
        responseTime: 0
      }
    });

    // updates conversation message count
    conversation.messageCount += 1;
    await conversation.save();      // this also updates updatedAt

    // populates conversation details before sending
    await message.populate('conversation', 'title');

    res.status(200).json({
      success: true,
      message: 'Message created',
      data: message
    });
    
  } catch (error) {
    next(error);
  }
};

// deletes a new message in a conversation
// route: DELETE /api/messages/:id
export const deleteMessage = async (req, res, next) => {
  try {
    const messageId = req.params.id;

    const message = await Message.findById(messageId);

    if(!message) {
      const error = new Error ('Message not found');
      error.statusCode = 404;
      throw error;
    }

    // conversation id
    // console.log(message.conversation);

    const conversation = await Conversation.findById(message.conversation);

    if(!conversation) {
      const error = new Error('Conversation not found');
      error.statusCode = 404;
      throw error;
    }

    // authorization check: verifies if the conversation belongs to the logged-in user
    if(req.user._id.toString() !== conversation.user.toString()) {
      const error = new Error('Not authorized to delete this message');
      error.statusCode = 403;
      throw error;
    }
    
    // updates the message count in the conversation
    if(conversation && conversation.messageCount > 0) {
      conversation.messageCount -= 1;
      await conversation.save();
    }
    
    // deletes the message
    await Message.findByIdAndDelete(messageId);

    res.status(200).json({
      success: true,
      message: 'Message deleted successfully',
      data: message
    });

  } catch (error) {
    // cast error
    if(error.name === 'CastError') {
      error.message = 'Invalid message ID format';
      error.statusCode = 400;
    }
    next(error);
  }
};

