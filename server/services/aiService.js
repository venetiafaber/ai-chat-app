import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
// load .env
dotenv.config();

// initializes Gemini AI 
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * get Ai chat response
 * {Array} conversationHistory - an array of previous messages
 * {String} userMessage - current user message
 * returns {Object} { reply, tokensUsed, responseTime }
 */
export const getAIResponse =  async (conversationHistory, userMessage) => {
 try {
  const startTime = Date.now();

  // gets the model
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash"
  });

  // formats conversation history for Gemini
  const formattedHistory = conversationHistory.map(msg => ({
    role: msg.role === 'ai' ? 'model' : 'user',
    parts: [{ text: msg.content }]
  }));

  // start chat with history
  const chat = model.startChat({
    history: formattedHistory,
    generationConfig: {
      maxOutputTokens: 1000,
      temperature: 0.7
    }
  });

  // sends message and gets response
  const result = await chat.sendMessage(userMessage);
  const response = result.response;
  // extracts text
  const aiReply = response.text();

  // calculates response time
  const responseTime = Date.now() - startTime;

  // gets token usage (for metadata)
  const tokensUsed = response.usageMetadata?.totalTokenCount || 0;

  return {
    reply: aiReply,
    tokensUsed,
    responseTime
  }

 } catch (error) {
  console.error('Gemini API Error', error);

  // handles specific errors
  if(error.message.includes('API key')) {
    throw new Error('Invalid or missing Gemini API key');
  }

  if(error.message.includes('quota')) {
    throw new Error('API quota exceeded. Please try again later');
  }

  if(error.message.includes('safety')) {
    throw new Error('Content was blocked by safety filters');
  }

  throw new Error('Failed to get AI response. Please try again');

 }
};

// generates conversation title based on first message
export const generateConversationTitle = async (firstMessage) => {
  try {
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash'
    });

    const prompt = `Generate a short, concise title (max 6 words) for a 
                    conversation that starts with ${firstMessage}. Only respond with title, nothing else.`

    const result = await model.generateContent(prompt);
    const title = result.response.text().trim();

    // removes quotes if AI added them
    return title.replace(/^["']|["']$/g, '');

  } catch (error) {
    console.error('Error generating title: ', error);
    // Fallback to first few words of message
    return firstMessage.slice(0, 40) + (firstMessage.length > 40 ? '...' : '');
  }
};