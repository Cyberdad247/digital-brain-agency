import axios from 'axios';

const OLLAMA_API_URL = 'https://api.ollama.com'; // Replace with actual Ollama API URL
const OLLAMA_API_KEY = 'your-ollama-api-key'; // Replace with your Ollama API key

export const getPersonas = async () => {
  try {
    const response = await axios.get(`${OLLAMA_API_URL}/personas`, {
      headers: {
        Authorization: `Bearer ${OLLAMA_API_KEY}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching personas from Ollama:', error);
    throw error;
  }
};

export const createPersona = async (persona) => {
  try {
    const response = await axios.post(`${OLLAMA_API_URL}/personas`, persona, {
      headers: {
        Authorization: `Bearer ${OLLAMA_API_KEY}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error creating persona in Ollama:', error);
    throw error;
  }
};

export const getOllamaRecommendation = async (text) => {
  try {
    const response = await axios.post(
      `${OLLAMA_API_URL}/chat`,
      { prompt: text },
      {
        headers: {
          Authorization: `Bearer ${OLLAMA_API_KEY}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error getting recommendation from Ollama:', error);
    throw error;
  }
};
