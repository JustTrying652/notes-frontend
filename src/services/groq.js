const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_API_KEY = process.env.REACT_APP_GROQ_API_KEY;

const groqRequest = async (prompt) => {
  const response = await fetch(GROQ_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 1024,
    }),
  });
  const data = await response.json();
  return data.choices[0].message.content;
};

export const summarizeNote = (content) =>
  groqRequest(`Summarize the following note into clear bullet points. Return only the bullet points, nothing else:\n\n${content}`);

export const improveWriting = (content) =>
  groqRequest(`Improve the writing of the following note. Make it clearer, more concise and well structured. Return only the improved text, nothing else:\n\n${content}`);

export const generateTitle = (content) =>
  groqRequest(`Generate a short, descriptive title for the following note. Return only the title, nothing else:\n\n${content}`);