import {
  AIChatMessage,
  BaseChatMessage,
  ChatMessage,
  HumanChatMessage,
  StoredMessage,
  SystemChatMessage,
} from "langchain/schema";
import { Dispatch, SetStateAction, useCallback, useMemo } from "react";
import { StorageKeys } from "./constants";
import { ChatMode } from "../common/SettingsStoreProvider";
import { useStoredState } from "./useStoredState";

function deserializeMessage(message: StoredMessage): BaseChatMessage {
  switch (message.type) {
    case "human":
      return new HumanChatMessage(message.data.content);
    case "ai":
      return new AIChatMessage(message.data.content);
    case "system":
      return new SystemChatMessage(message.data.content);
    default:
      return new ChatMessage(message.data.content, message.type);
  }
}

export function useChatHistory(
  initialState: BaseChatMessage[],
  chatMode: ChatMode
): [boolean, BaseChatMessage[], Dispatch<SetStateAction<BaseChatMessage[]>>] {
  const [loading, storedHistory, setStoredHistory] = useStoredState<
    StoredMessage[]
  >({
    storageKey: StorageKeys.CHAT_HISTORY,
    defaultValue: initialState.map((message) => message.toJSON()),
    storageArea: "local",
    scope: chatMode === "with-page" ? "page" : "global",
  });

  const history = useMemo<BaseChatMessage[]>(() => {
    return storedHistory.map(deserializeMessage);
  }, [storedHistory]);

  const setHistory = useCallback<Dispatch<SetStateAction<BaseChatMessage[]>>>(
    (value) => {
      if (typeof value === "function") {
        setStoredHistory((prevStoredHistory) =>
          value(prevStoredHistory.map(deserializeMessage)).map((message) =>
            message.toJSON()
          )
        );
      } else {
        setStoredHistory(value.map((message) => message.toJSON()));
      }
    },
    [setStoredHistory]
  );

  return [loading, history, setHistory];
}
