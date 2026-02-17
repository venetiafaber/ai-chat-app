import mongoose from "mongoose";

// schema
const messageSchema = new mongoose.Schema({
  conversation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Conversation',
    required: true
  },
  role: {
    type: String,
    enum: ['user', 'ai'],
    required: true
  },
  content: {
    type: String,
    required: [true, 'Message cannot be empty'],
    maxlength: [5000, 'Message cannot exceed 5000 characters']
  },
  metadata: {
    tokensUsed: {
      type: Number,
      default: 0
    },
    responseTime: {
      type: Number,
      default: 0
    }
  }
}, {
  timestamps: true
});

// model 
const Message = mongoose.model('Message', messageSchema);

export default Message;