import { GetPageContentRequest, GetPageContentResponse } from "../content";

export async function getCurrentPageContent() {
  const [tab] = await chrome.tabs.query({
    active: true,
    currentWindow: true,
  });

  if (!tab.id) return;

  return await chrome.tabs.sendMessage<
    GetPageContentRequest,
    GetPageContentResponse
  >(tab.id, {
    action: "getPageContent",
  });
}
