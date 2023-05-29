export type GetPageContentRequest = {
  action: "getPageContent";
};
export type GetPageContentResponse = {
  pageContent: string;
  links: { text: string; href: string }[];
};

chrome.runtime.onMessage.addListener(function (
  request: GetPageContentRequest,
  _sender,
  sendResponse
) {
  if (request.action === "getPageContent") {
    const primaryContentElement =
      document.body.querySelector("article") ??
      document.body.querySelector("main") ??
      document.body;

    const links = Array.from(primaryContentElement.querySelectorAll("a"))
      .filter((a) => !a.href.startsWith(document.URL) && a.text.length > 3)
      .map((a) => ({
        text: a.text,
        href: a.href,
      }));

    sendResponse({
      pageContent: primaryContentElement.innerText,
      links: links,
    } as GetPageContentResponse);
  }
});
