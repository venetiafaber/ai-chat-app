import Message from '../models/Message.js';
import Conversation from '../models/Conversation.js';
import { generateConversationTitle, getAIResponse } from '../services/aiService.js';

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

// desc: creates a new message in a conversation with AI response
// route: POST /api/messages
// access: Private
export const createMessage = async (req, res, next) => {
  try {
    const { conversationId, content } = req.body;  //remove role req.bodt

    if(!conversationId || !content) {
      const error = new Error('Conversation ID and content are required');
      error.statusCode = 400;
      throw error;
    }

    // validate role
    // if(!['user', 'ai'].includes(role)) {      // Array.includes()
    //   const error = new Error('Role must be either "user" or "ai"');
    //   error.statusCode = 400;
    //   throw error;
    // }

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

    // step 1: saves user's message
    const userMessage = await Message.create({
      conversation: conversationId,
      role: 'user',
      content,
      metadata: {
        tokensUsed: 0,
        responseTime: 0
      }
    });

    // step 2: get conversation history (last 10 messages)
    const conversationHistory = await Message.find({
      conversation: conversationId
    })
      .sort({ createdAt: -1 })  // newest first
      .limit(10)                
      .select('role content')   // only role and content

    // step 3: get AI response
    const { reply, tokensUsed, responseTime } = await getAIResponse(conversationHistory, content);

    // step 4: save AI's response
    const aiMessage = await Message.create({
      conversation: conversationId,
      role: 'ai',
      content: reply,
      metadata: {
        tokensUsed,
        responseTime
      }
    });

    // updates conversation message count
    conversation.messageCount += 2;     // user message + ai message

    // if this is the first message, generate a title
    if(conversation.messageCount === 2 && conversation.title === 'New Conversation') {
      const title = await generateConversationTitle(content);
      conversation.title = title;
    }

    await conversation.save();          // this also updates updatedAt

    // populates conversation details before sending
    // await message.populate('conversation', 'title');

    // step 6: returns both messages
    res.status(200).json({
      success: true,
      message: 'Messages created',
      data: {
        userMessage,
        aiMessage,
        conversation: {
          _id: conversation._id,
          title: conversation.title,
          messageCount: conversation.messageCount
        }
      }
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

