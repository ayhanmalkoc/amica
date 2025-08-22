import { BasicPage, FormRow, NotUsingAlert } from './common';
import { TextInput } from '@/components/textInput';
import { SecretTextInput } from '@/components/secretTextInput';
import { config, updateConfig } from "@/utils/config";
import { useTranslation } from 'react-i18next';


export function ChatGPTSettingsPage({
  openAIApiKey,
  setOpenAIApiKey,
  openAIUrl,
  setOpenAIUrl,
  openAIModel,
  setOpenAIModel,
  setSettingsUpdated,
}: {
  openAIApiKey: string;
  setOpenAIApiKey: (key: string) => void;
  openAIUrl: string;
  setOpenAIUrl: (url: string) => void;
  openAIModel: string;
  setOpenAIModel: (model: string) => void;
  setSettingsUpdated: (updated: boolean) => void;
}) {
  const { t } = useTranslation();

  return (
    <BasicPage
      title={t("ChatGPT Settings")}
      description={t('ChatGPTSettings_desc', 'Configure ChatGPT settings. You can get an API key from platform.openai.com. You can generally use other OpenAI compatible URLs and models here too, such as OpenRouter or LM Studio.')}
    >
      { config("chatbot_backend") !== "chatgpt" && (
        <NotUsingAlert>
          {t("not_using_alert", "You are not currently using {{name}} as your {{what}} backend. These settings will not be used.", {name: "ChatGPT", what: t("ChatBot")})}
        </NotUsingAlert>
      ) }
      <ul role="list" className="divide-y divide-gray-100 max-w-xs">
        <li className="py-4">
          <FormRow label={t("OpenAI API Key")}>
            <SecretTextInput
              value={openAIApiKey}
              onChange={(event: React.ChangeEvent<any>) => {
                setOpenAIApiKey(event.target.value);
                updateConfig("openai_apikey", event.target.value);
                setSettingsUpdated(true);
              }}
            />
          </FormRow>
        </li>
        <li className="py-4">
          <FormRow label={t("OpenAI URL")}>
            <TextInput
              value={openAIUrl}
              onChange={(event: React.ChangeEvent<any>) => {
                setOpenAIUrl(event.target.value);
                updateConfig("openai_url", event.target.value);
                setSettingsUpdated(true);
              }}
            />
          </FormRow>
        </li>
        <li className="py-4">
          <FormRow label={t("OpenAI Model")}>
            <TextInput
              value={openAIModel}
              onChange={(event: React.ChangeEvent<any>) => {
                setOpenAIModel(event.target.value);
                updateConfig("openai_model", event.target.value);
                setSettingsUpdated(true);
              }}
            />
          </FormRow>
        </li>
      </ul>
    </BasicPage>
  );
}
