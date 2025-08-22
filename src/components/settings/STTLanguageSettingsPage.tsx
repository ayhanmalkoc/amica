import { useTranslation } from 'react-i18next';

import { BasicPage, FormRow, NotUsingAlert } from './common';
import { config, updateConfig } from "@/utils/config";
import { getLanguageOptions } from "@/utils/sttLanguage";

export default function STTLanguageSettingsPage({
  sttLanguageAuto,
  setSTTLanguageAuto,
  sttLanguageManual,
  setSTTLanguageManual,
  setSettingsUpdated,
}: {
  sttLanguageAuto: boolean;
  setSTTLanguageAuto: (auto: boolean) => void;
  sttLanguageManual: string;
  setSTTLanguageManual: (language: string) => void;
  setSettingsUpdated: (updated: boolean) => void;
}) {
  const { t } = useTranslation();
  const languageOptions = getLanguageOptions();

  return (
    <BasicPage
      title={t("STT Language") + " " + t("Settings")}
      description={t("Configure speech-to-text language settings")}
    >
      { config("stt_backend") === "none" && (
        <NotUsingAlert>
          {t("not_using_alert", "You are not currently using {{name}} as your {{what}} backend. These settings will not be used.", {name: t("STT"), what: t("STT")})}
        </NotUsingAlert>
      )}
      
      <ul role="list" className="divide-y divide-gray-100 max-w-xs">
        <li className="py-4">
          <FormRow label={t("Auto-detect Language")}>
            <div className="flex items-center">
              <input
                id="stt-auto-detect"
                type="checkbox"
                checked={sttLanguageAuto}
                onChange={(e) => {
                  setSTTLanguageAuto(e.target.checked);
                  updateConfig("stt_language_auto", e.target.checked ? 'true' : 'false');
                  setSettingsUpdated(true);
                }}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label htmlFor="stt-auto-detect" className="ml-2 block text-sm text-gray-900">
                {t("Automatically detect speech language")}
              </label>
            </div>
          </FormRow>
        </li>
        
        {!sttLanguageAuto && (
          <li className="py-4">
            <FormRow label={t("Manual Language Selection")}>
              <select
                value={sttLanguageManual}
                onChange={(e) => {
                  setSTTLanguageManual(e.target.value);
                  updateConfig("stt_language_manual", e.target.value);
                  setSettingsUpdated(true);
                }}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              >
                {languageOptions
                  .filter(option => option.code !== 'auto')
                  .map((lang: {code: string, name: string}) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.name}
                  </option>
                ))}
              </select>
            </FormRow>
          </li>
        )}
        
        <li className="py-4">
          <div className="text-sm text-gray-600">
            <strong>{t("Current Status")}:</strong>
            <br />
            {sttLanguageAuto ? (
              <span className="text-green-600">
                {t("Auto-detection enabled")}
              </span>
            ) : (
              <span className="text-blue-600">
                {t("Manual language")}: {languageOptions.find((l: {code: string, name: string}) => l.code === sttLanguageManual)?.name || sttLanguageManual}
              </span>
            )}
          </div>
        </li>
      </ul>
    </BasicPage>
  );
}
