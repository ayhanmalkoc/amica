import { config } from '@/utils/config';
import { getSTTLanguage } from '@/utils/sttLanguage';

export async function openaiWhisper(
  file: File,
  prompt?: string,
) {
  const apiKey = config("openai_whisper_apikey");
  if (!apiKey) {
    throw new Error("Invalid OpenAI Whisper API Key");
  }

  // Request body
  const formData = new FormData();
  formData.append('file', file);
  formData.append('model', config('openai_whisper_model'));
  
  // Use dynamic language from STT settings
  const language = getSTTLanguage();
  if (language) {
    formData.append('language', language);
  }
  // If language is undefined, OpenAI Whisper will auto-detect
  
  if (prompt) {
    formData.append('prompt', prompt);
  }

  console.debug('whisper-openai req', formData, 'language:', language || 'auto-detect');

  const res = await fetch(`${config("openai_whisper_url")}/v1/audio/transcriptions`, {
    method: "POST",
    body: formData,
    headers: {
      "Authorization": `Bearer ${apiKey}`,
    },
  });
  if (! res.ok) {
    throw new Error(`OpenAI Whisper API Error (${res.status})`);
  }
  const data = await res.json();
  console.debug('whisper-openai res', data);

  // ✅ Debug STT encoding and character analysis
  const responseText = data.text.trim();
  console.debug('whisper-openai text analysis:', {
    originalText: responseText,
    textLength: responseText.length,
    charCodes: responseText.split('').map((char: string) => char.charCodeAt(0)),
    encoding: responseText.split('').map((char: string) => ({ 
      char, 
      unicode: char.charCodeAt(0),
      isLatin: char.charCodeAt(0) < 256,
      isAscii: char.charCodeAt(0) < 128,
      isTurkish: /[çğıöşüÇĞIİÖŞÜ]/.test(char)
    })),
    hasNonLatin: responseText.split('').some((char: string) => char.charCodeAt(0) > 255),
    hasChinese: /[\u4e00-\u9fff]/.test(responseText),
    hasArabic: /[\u0600-\u06ff]/.test(responseText),
    normalized: responseText.normalize('NFC')
  });

  return { text: responseText };
}
