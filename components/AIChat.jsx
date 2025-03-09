import { getOllamaRecommendation } from '../../ollama';
import { useSupabase } from '../backend/api/supabaseClient';

export default function AIChat() {
  const { session, supabase } = useSupabase();

  const handleVoiceInput = async (audioBlob) => {
    // Convert speech to text using Mozilla DeepSpeech (OSS)
    const text = await transcribeAudio(audioBlob);

    // Store conversation in Supabase
    try {
      const { data, error } = await supabase
        .from('consultations')
        .insert([{ user_id: session.user.id, query: text }]);

      if (error) {
        console.error('Error storing consultation:', error);
        return;
      }

      // Get recommendation from Ollama
      const recommendation = await getOllamaRecommendation(text);

      // Store AI response in Supabase
      const { data: aiData, error: aiError } = await supabase
        .from('consultations')
        .update({ ai_response: recommendation })
        .eq('id', data[0].id);

      if (aiError) {
        console.error('Error storing AI response:', aiError);
        return;
      }

      return recommendation;
    } catch (error) {
      console.error('Error in handleVoiceInput:', error);
      return 'Error getting recommendation';
    }
  };

  const transcribeAudio = async (audioBlob) => {
    // Placeholder for speech-to-text library
    console.log('Transcribing audio...', audioBlob);
    return 'This is a transcribed text from audio';
  };

  const jazzQuotes = [
    "Hey there, I'm Jazz Jenkins, your Client Success Manager! Ready to make some magic happen?",
    "What's crackin'? Jazz Jenkins here, ready to guide you through this like a Chicago wind!",
    "Yo, it's Jazz Jenkins! Let's get you set up and feelin' good, alright?",
    "Hey, I'm Jazz Jenkins, your Client Success Manager. Let's make this onboarding process smooth like a Chicago blues riff!",
  ];

  const randomQuote = jazzQuotes[Math.floor(Math.random() * jazzQuotes.length)];

  return (
    <div>
      {/* Add UI elements here, e.g., a button to trigger voice input */}
      <button onClick={() => handleVoiceInput('audioBlob')}>Get Personalized Recommendation</button>
      <p>{randomQuote}</p>
    </div>
  );
}
