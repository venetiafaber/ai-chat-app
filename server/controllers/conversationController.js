import Conversation from "../models/Conversation.js";

// gets all conversations for a user
// route: GET /api/conversations
export const getConversations = async (req, res, next) => {
  try {
    // const { userId } = req.query; 
    // gets userId from authenticated user, instead of passing userId as a query parameter
    const userId = req.user._id;

    // validation code for user id is not needed because user is authenticated using authentication middleware
    // if (!userId) {
    //   const error = new Error("User Id is required");
    //   error.statusCode = 400;
    //   throw error;
    // }

    // find all active conversations for this user and sort by most recently updated first
    const conversations = await Conversation.find({
      user: userId,
      isActive: true,
    })
      .sort({ updatedAt: -1 })    // sorts in descending
      .populate("user", "username email avatar");   // includes user details

    res.json({
      success: true,
      count: conversations.length,
      data: conversations,
    });

  } catch (error) {
    next(error);
  }
};

// creates a new conversation
// route: POST /api/conversations
export const createConversation = async (req, res, next) => {
  try {
    // const { userId, title } = req.body;
    const userId = req.user._id;    // from authenticated user
    const { title } = req.body;

    // validation - not needed since user is authenticated from middleware 
    // if (!userId) {
    //   const error = new Error("User ID is required");
    //   error.statusCode = 400;
    //   throw error;
    // }

    // creates conversation
    const conversation = await Conversation.create({
      user: userId,
      title: title || "New Conversation",
      messageCount: 0,
      isActive: true,
    });

    // populates user details before sending response
    await conversation.populate("user", "username avatar");

    res.status(201).json({
      success: true,
      message: "Conversation created",
      data: conversation,
    });

  } catch (error) {
    next(error);
  }
};

// get a single conversation by its id
// route: GET /api/conversations/:id
export const getConversation = async (req, res, next) => {
  try {
    const conversationId = req.params.id;

    const conversation = await Conversation.findById(conversationId)
      .populate("user", "username email avatar",
    );

    if (!conversation) {
      const error = new Error("Conversation not found");
      error.statusCode = 404;
      throw error;
    }

    if (!conversation.isActive) {
      const error = new Error("This conversation has been deleted");
      error.statusCode = 404;
      throw error;
    }

    // authorization check: verifies if the conversation belongs to the logged-in user
    if (req.user._id.toString() !== conversation.user._id.toString()) {
      const error = new Error('Not authorized to access conversation of another user');
      error.statusCode = 403;   //forbidden
      throw error;
    }

    res.status(200).json({
      success: true,
      message: "Conversation found",
      data: conversation,
    });

  } catch (error) {
    if(error.name === 'CastError') {
      error.message = 'Invalid conversation ID format';
      error.statusCode = 400;
    }
    next(error);
  }
};

// update a conversation by its id
// route: PUT /api/conversations/:id
export const updateConversation = async (req, res, next) => {
  try {
    const conversationId = req.params.id;
    const { title } = req.body;

    const conversation = await Conversation.findById(conversationId);

    if (!conversation) {
      const error = new Error("Conversation not found");
      error.statusCode = 404;
      throw error;
    }

    if (!conversation.isActive) {
      const error = new Error("Cannot update deleted conversation");
      error.statusCode = 400;
      throw error;
    }

    // authorization check: verifies if the conversation belongs to the logged-in user
    if(req.user._id.toString() !== conversation.user.toString()) {
      const error = new Error('Not authorized to update conversation of another user');
      error.statusCode = 403;
      throw error;
    }

    // updates title
    if (title) conversation.title = title;
    
    const updatedConversation = await conversation.save();

    res.status(200).json({
      success: true,
      message: "Conversation updated",
      data: updatedConversation,
    });

  } catch (error) {
    next(error);
  }
};

// deletes a conversation by its id
// route: DELETE /api/conversations/:id
export const deleteConversation = async (req, res, next) => {
  try {
    const conversationId = req.params.id;

    const conversation = await Conversation.findById(conversationId);

    if (!conversation) {
      const error = new Error("Conversation not found");
      error.statusCode = 404;
      throw error;
    }

    // authorization check: verifies if the conversation belongs to the logged-in user
    if(req.user._id.toString() !== conversation.user.toString()) {
      const error = new Error('Not authorized to delete conversation of another user');
      error.statusCode = 403;
      throw error;
    }

    // soft delete: sets isActive to false
    conversation.isActive = false;
    await conversation.save();

    res.status(200).json({
      success: true,
      message: "Conversation deleted successfully",
    });

  } catch (error) {
    next(error);
  }
};
