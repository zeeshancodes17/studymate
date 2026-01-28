
import { GoogleGenAI, Type } from "@google/genai";
import { MentorMode } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const getMentorResponse = async (
  message: string,
  mode: MentorMode,
  history: { role: 'user' | 'model', parts: { text: string }[] }[]
) => {
  const instructions = {
    [MentorMode.EXPLAIN]: "You are an expert tutor. Provide detailed, step-by-step explanations.",
    [MentorMode.EXAM]: "You are an exam coach. Focus on high-yield keywords and exam-style answers.",
    [MentorMode.TEACHING]: "You are a Socratic teacher. Ask questions to lead the student to the answer.",
    [MentorMode.SIMPLIFY]: "Explain like I'm 10 years old using simple analogies.",
    [MentorMode.RESEARCH]: "You are a research assistant. Use Google Search to find current academic sources, news, and verified data. Always cite your findings."
  };

  const config: any = {
    systemInstruction: instructions[mode],
    temperature: 0.7,
  };

  if (mode === MentorMode.RESEARCH) {
    config.tools = [{ googleSearch: {} }];
  }

  const response = await ai.models.generateContent({
    model: mode === MentorMode.RESEARCH ? 'gemini-3-pro-preview' : 'gemini-3-flash-preview',
    contents: [...history, { role: 'user', parts: [{ text: message }] }],
    config,
  });

  const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks
    ?.filter((chunk: any) => chunk.web)
    ?.map((chunk: any) => ({
      title: chunk.web.title,
      uri: chunk.web.uri
    }));

  return {
    text: response.text,
    sources: sources || []
  };
};

export const summarizeNote = async (content: string) => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Summarize the following study note into key takeaways:\n\n${content}`,
  });
  return response.text;
};

export const generateQuiz = async (topic: string) => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Generate a quiz about: ${topic}`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          questions: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                question: { type: Type.STRING },
                options: { type: Type.ARRAY, items: { type: Type.STRING } },
                correctAnswer: { type: Type.STRING },
                explanation: { type: Type.STRING }
              }
            }
          }
        }
      }
    }
  });
  return JSON.parse(response.text || '{}');
};

export const getCareerAdvice = async (interests: string, strengths: string) => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Suggest 3 career paths for interests: "${interests}" and strengths: "${strengths}".`,
  });
  return response.text;
};

export const generateIdeas = async (interests: string, academicFocus: string) => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Generate 3 project ideas for interests: "${interests}" and focus: "${academicFocus}".`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          ideas: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                type: { type: Type.STRING },
                difficulty: { type: Type.STRING },
                description: { type: Type.STRING },
                techStack: { type: Type.ARRAY, items: { type: Type.STRING } },
                learningOutcomes: { type: Type.ARRAY, items: { type: Type.STRING } }
              }
            }
          }
        }
      }
    }
  });
  return JSON.parse(response.text || '{}');
};
