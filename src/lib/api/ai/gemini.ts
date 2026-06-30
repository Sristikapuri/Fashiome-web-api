// lib/api/ai/gemini.ts
"use server";

const GEMINI_API_KEY = process.env.NEXT_PUBLIC_API_KEY || "";
const GEMINI_BASE_URL = "https://generativelanguage.googleapis.com/v1beta/models";
const GEMINI_MODEL = "gemini-2.5-flash";

export interface GeminiPart {
  text: string;
}

export interface GeminiContent {
  role: "user" | "model";
  parts: GeminiPart[];
}

export interface GeminiCandidate {
  content: GeminiContent;
  finishReason: string;
}

export interface GeminiResponse {
  candidates?: GeminiCandidate[];
  error?: { code: number; message: string; status: string };
  message?: string;
}

export async function generateContent(
  systemInstruction: string,
  context: string,
  prompt: string
): Promise<GeminiResponse> {
  if (!GEMINI_API_KEY) {
    return {
      message: "Gemini API key is not configured.",
    };
  }

  const endpoint = `${GEMINI_BASE_URL}/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;

  const requestBody = {
    contents: [
      {
        role: "user",
        parts: [
          {
            text: `${context}\n\nUser: ${prompt}`,
          },
        ],
      },
    ],
    systemInstruction: {
      parts: [
        {
          text: systemInstruction,
        },
      ],
    },
    generationConfig: {
      temperature: 1.0,
      topP: 0.95,
      topK: 40,
      maxOutputTokens: 1024,
    },
  };

  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
      cache: "no-store",
    });

    const data: GeminiResponse = await res.json();

    if (!res.ok) {
      return {
        message:
          data?.error?.message ||
          `Gemini API error: ${res.status} ${res.statusText}`,
      };
    }

    return data;
  } catch (error) {
    return {
      message:
        error instanceof Error
          ? error.message
          : "Failed to connect to Gemini API.",
    };
  }
}
