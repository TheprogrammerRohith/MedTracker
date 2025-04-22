import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = '';

const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

export async function getGeminiReply(userInput) {
  try {
    const chat = model.startChat({
      history: [], // optional message history
    });

    const result = await chat.sendMessage(userInput);
    const response = result.response;
    const text = response.text(); // still valid
    return text;
  } catch (error) {
    console.error('Gemini error:', error);
    return 'Sorry, I had trouble answering that. Please try again!';
  }
}
