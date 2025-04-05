import { GoogleGenerativeAI } from "@google/generative-ai";

export const generateQuestionsWithGemini = async (courseTitle) => {
  const genAi = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAi.getGenerativeModel({ model: "gemini-1.5-flash" }); // or 1.0-pro, 1.5-pro

  const prompt = `Generate 10 MCQ quiz questions for a course titled "${courseTitle}". 
Each question should have 4 options and one correct answer index (0-based).
Format response as a JSON array:
[
  {
    "question": "What is HTML used for?",
    "options": ["Styling", "Structuring web pages", "Database", "Server logic"],
    "correctAnswerIndex": 1
  }
]`;

  const result = await model.generateContent(prompt);

  const response = await result.response;
  const text = response.text();

  let questions = [];

  try {
    const match = text.match(/\[\s*{[\s\S]*?}\s*\]/);
    if (!match) throw new Error("No JSON array found in Gemini response.");

    questions = JSON.parse(match[0]);
  } catch (error) {
    console.error("gemini returned invalid JSON:", text);
    throw new Error("gemini returned invalid quiz data");
  }

  return questions;
};
