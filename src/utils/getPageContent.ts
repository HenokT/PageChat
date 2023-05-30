import {
  GetPageContentRequest,
  GetPageContentResponse,
} from "../content-script";

export async function getCurrentPageContent() {
  const [tab] = await chrome.tabs.query({
    active: true,
    currentWindow: true,
  });

  if (!tab.id) return;

  try {
    return await chrome.tabs.sendMessage<
      GetPageContentRequest,
      GetPageContentResponse
    >(tab.id, {
      action: "getPageContent",
    });
  } catch (error) {
    console.error(error);
    throw new Error("Unable to get page content");
  }
}
