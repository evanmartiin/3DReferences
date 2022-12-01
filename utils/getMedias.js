import fetch from "node-fetch";
import { twitterApi } from "../globalConfig.js";

export async function getMedias(ref) {
  if (ref.properties["Photos"].files.length) {
    return Promise.all(
      ref.properties.Photos.files.slice(0, 4).map((file) => {
        return twitterApi.v1.uploadMedia(getBuffer(file.file.url), {
          mimeType: "png",
        });
      })
    );
  } else if (ref.cover && ref.cover.file && ref.cover.file.url.length) {
    return twitterApi.v1.uploadMedia(getBuffer(ref.cover.file.url), {
      mimeType: "png",
    });
  }
}

async function getBuffer(url) {
  try {
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    return buffer;
  } catch (error) {
    return { error };
  }
}
