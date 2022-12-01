import { notionApi } from "../globalConfig.js";

export async function setStatus(ref, status, error = null) {
  await notionApi.pages.update({
    page_id: ref.id,
    properties: {
      Status: {
        status: {
          name: status,
        },
      },
      Error: {
        rich_text: [
          {
            text: {
              content: error ? `[${new Date().toUTCString()}] ${error}` : "",
            },
          },
        ],
      },
    },
  });
}
