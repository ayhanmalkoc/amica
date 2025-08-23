import { BasicPage, FormRow, NotUsingAlert } from './common';
import { TextInput } from '@/components/textInput';
import { SecretTextInput } from '@/components/secretTextInput';
import { config, updateConfig } from "@/utils/config";
import { useTranslation } from 'react-i18next';


export function OpenRouterSettings({
  openRouterApiKey,
  setOpenRouterApiKey,
  openRouterUrl,
  setOpenRouterUrl,
  openRouterModel,
  setOpenRouterModel,
  setSettingsUpdated,
}: {
  openRouterApiKey: string;
  setOpenRouterApiKey: (key: string) => void;
  openRouterUrl: string;
  setOpenRouterUrl: (url: string) => void;
  openRouterModel: string;
  setOpenRouterModel: (model: string) => void;
  setSettingsUpdated: (updated: boolean) => void;
}) {
  const { t } = useTranslation();

  return (
    <BasicPage
      title={t("OpenRouter Settings")}
      description={t('OpenRouterSettings_desc', 'Configure OpenRouter settings. You can get an API key from https://openrouter.ai')}
    >
      { config("chatbot_backend") !== "openrouter" && (
        <NotUsingAlert>
          {t("not_using_alert", "You are not currently using {{name}} as your {{what}} backend. These settings will not be used.", {name: "OpenRouter", what: t("ChatBot")})}
        </NotUsingAlert>
      ) }
      <ul role="list" className="divide-y divide-gray-100 max-w-xs">
        <li className="py-4">
          <FormRow label={t("OpenRouter API Key")}>
            <SecretTextInput
              value={openRouterApiKey}
              onChange={(event: React.ChangeEvent<any>) => {
                setOpenRouterApiKey(event.target.value);
                updateConfig("openrouter_apikey", event.target.value);
                setSettingsUpdated(true);
              }}
            />
          </FormRow>
        </li>
        <li className="py-4">
          <FormRow label={t("OpenRouter URL")}>
            <TextInput
              value={openRouterUrl}
              onChange={(event: React.ChangeEvent<any>) => {
                setOpenRouterUrl(event.target.value);
                updateConfig("openrouter_url", event.target.value);
                setSettingsUpdated(true);
              }}
            />
          </FormRow>
        </li>
        <li className="py-4">
          <FormRow label={t("OpenRouter Model")}>
            <TextInput
              value={openRouterModel}
              onChange={(event: React.ChangeEvent<any>) => {
                setOpenRouterModel(event.target.value);
                updateConfig("openrouter_model", event.target.value);
                setSettingsUpdated(true);
              }}
            />
          </FormRow>
        </li>
      </ul>
    </BasicPage>
  );
}
