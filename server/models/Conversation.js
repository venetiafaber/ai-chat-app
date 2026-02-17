import mongoose from "mongoose";

// create schema
const conversationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
    default: 'New Conversation',
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  messageCount: {
    type: Number,
    default: 0    // tracks the no. of messages in a conversation (denormalization technique)
  },
  isActive: {
    type: Boolean,
    default: true,
  }
},{
  timestamps: true
});

// create model
// mongoose.model('Conversation', conversationSchema); -> 'Conversation' is the collection in the db, which MongoDB pluralizes automatically 
// const Conversation -> js variable used to import in other files
const Conversation = mongoose.model('Conversation', conversationSchema);

// export model
export default Conversation;