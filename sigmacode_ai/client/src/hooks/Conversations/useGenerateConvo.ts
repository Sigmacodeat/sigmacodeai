import { useRecoilValue } from 'recoil';
import { useCallback, useRef, useEffect } from 'react';
import { useGetModelsQuery } from 'librechat-data-provider/react-query';
import { LocalStorageKeys, isAssistantsEndpoint } from 'librechat-data-provider';
import type {
  TPreset,
  TModelsConfig,
  TConversation,
  TEndpointsConfig,
  EModelEndpoint,
} from 'librechat-data-provider';
import type { SetterOrUpdater } from 'recoil';
import type { AssistantListItem } from '~/common';
import { getEndpointField, buildDefaultConvo, getDefaultEndpoint, logger } from '~/utils';
import useAssistantListMap from '~/hooks/Assistants/useAssistantListMap';
import { useGetEndpointsQuery } from '~/data-provider';
import { mainTextareaId } from '~/common';
import store from '~/store';

const useGenerateConvo = ({
  index = 0,
  rootIndex,
  setConversation,
}: {
  index?: number;
  rootIndex: number;
  setConversation?: SetterOrUpdater<TConversation | null>;
}) => {
  const modelsQuery = useGetModelsQuery();
  const assistantsListMap = useAssistantListMap();
  const { data: endpointsConfig = {} as TEndpointsConfig } = useGetEndpointsQuery();

  const timeoutIdRef = useRef<NodeJS.Timeout>();
  const rootConvo = useRecoilValue(store.conversationByKeySelector(rootIndex));

  useEffect(() => {
    if (rootConvo?.conversationId != null && setConversation) {
      setConversation((prevState) => {
        if (!prevState) {
          return prevState;
        }
        const update = {
          ...prevState,
          conversationId: rootConvo.conversationId,
        } as TConversation;

        logger.log('conversation', 'Setting conversation from `useNewConvo`', update);
        return update;
      });
    }
  }, [rootConvo?.conversationId, setConversation]);

  const generateConversation = useCallback(
    ({
      template = {},
      preset,
      modelsData,
    }: {
      template?: Partial<TConversation>;
      preset?: Partial<TPreset>;
      modelsData?: TModelsConfig;
    } = {}) => {
      // start with a draft based on template; later build a completed TConversation
      let draft: Partial<TConversation> & {
        conversationId: string | null;
        title: string | null;
        endpoint: TConversation['endpoint'] | null;
        endpointType?: unknown;
        assistant_id?: string;
        model?: string | null | undefined;
        createdAt: string;
        updatedAt: string;
      } = {
        ...template,
        endpoint: template.endpoint ?? null,
        createdAt: template.createdAt ?? '',
        updatedAt: template.updatedAt ?? '',
        model: (template as TConversation).model ?? undefined,
        // enforce required strings after spreading template (avoid null from template)
        conversationId: 'new',
        title: 'New Chat',
      };

      if (rootConvo?.conversationId) {
        draft.conversationId = rootConvo.conversationId;
      }

      const modelsConfig = modelsData ?? modelsQuery.data;

      const defaultEndpoint = getDefaultEndpoint({
        convoSetup: preset ?? draft,
        endpointsConfig,
      });

      const endpointType = getEndpointField(endpointsConfig, defaultEndpoint, 'type');
      if (endpointType) {
        draft.endpointType = endpointType;
      } else if (draft.endpointType && !endpointType) {
        draft.endpointType = undefined;
      }

      const isAssistantEndpoint = isAssistantsEndpoint(defaultEndpoint);
      const assistants: AssistantListItem[] = assistantsListMap[defaultEndpoint ?? ''] ?? [];

      if (draft.assistant_id && !assistantsListMap[defaultEndpoint ?? '']?.[draft.assistant_id]) {
        draft.assistant_id = undefined;
      }

      if (!draft.assistant_id && isAssistantEndpoint) {
        draft.assistant_id =
          localStorage.getItem(`${LocalStorageKeys.ASST_ID_PREFIX}${index}${defaultEndpoint}`) ??
          assistants[0]?.id;
      }

      if (draft.assistant_id != null && isAssistantEndpoint && draft.conversationId === 'new') {
        const assistant = assistants.find((asst) => asst.id === draft.assistant_id);
        draft.model = assistant?.model;
      }

      if (draft.assistant_id != null && !isAssistantEndpoint) {
        draft.assistant_id = undefined;
      }

      const models = modelsConfig?.[defaultEndpoint ?? ''] ?? [];
      const completed = buildDefaultConvo({
        conversation: draft as TConversation,
        lastConversationSetup: preset as TConversation,
        endpoint: defaultEndpoint ?? ('' as EModelEndpoint),
        models,
      }) as TConversation;

      if (preset?.title != null && preset.title !== '') {
        completed.title = preset.title;
      }

      if (setConversation) {
        setConversation(completed);
      }

      clearTimeout(timeoutIdRef.current);
      timeoutIdRef.current = setTimeout(() => {
        const textarea = document.getElementById(mainTextareaId);
        if (textarea) {
          textarea.focus();
        }
      }, 150);
      return completed;
    },
    [assistantsListMap, endpointsConfig, index, modelsQuery.data, rootConvo, setConversation],
  );

  return { generateConversation };
};

export default useGenerateConvo;
