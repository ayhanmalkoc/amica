/**
 * STT Language Management Utilities
 * Handles automatic and manual language selection for Speech-to-Text
 */

import { config } from "@/utils/config";

// Supported languages for OpenAI Whisper
export const SUPPORTED_STT_LANGUAGES = {
  auto: "Auto-detect",
  en: "English",
  tr: "Turkish", 
  es: "Spanish",
  de: "German",
  zh: "Chinese",
  ka: "Georgian",
  fr: "French",
  it: "Italian",
  pt: "Portuguese",
  ru: "Russian",
  ja: "Japanese",
  ko: "Korean",
  ar: "Arabic",
  hi: "Hindi",
  nl: "Dutch",
  sv: "Swedish",
  no: "Norwegian",
  da: "Danish",
  fi: "Finnish",
  pl: "Polish",
} as const;

export type STTLanguageCode = keyof typeof SUPPORTED_STT_LANGUAGES;

/**
 * Get the current language for STT based on auto/manual settings
 * @returns Language code for OpenAI Whisper API (undefined for auto-detect)
 */
export function getSTTLanguage(): string | undefined {
  const autoMode = config("stt_language_auto") === "true";
  
  if (autoMode) {
    // Return undefined for auto-detection
    return undefined;
  }
  
  // Return manual language selection
  const manualLanguage = config("stt_language_manual");
  return manualLanguage || "tr"; // Default to Turkish if not set
}

/**
 * Check if STT is in auto-detection mode
 */
export function isSTTAutoMode(): boolean {
  return config("stt_language_auto") === "true";
}

/**
 * Get the manual language setting
 */
export function getSTTManualLanguage(): string {
  return config("stt_language_manual") || "tr";
}

/**
 * Get display name for a language code
 */
export function getLanguageDisplayName(code: string): string {
  return SUPPORTED_STT_LANGUAGES[code as STTLanguageCode] || code;
}

/**
 * Get array of language options for UI
 */
export function getLanguageOptions() {
  return Object.entries(SUPPORTED_STT_LANGUAGES).map(([code, name]) => ({
    code,
    name,
  }));
}

/**
 * Validate if a language code is supported
 */
export function isSupportedLanguage(code: string): boolean {
  return code in SUPPORTED_STT_LANGUAGES;
}
