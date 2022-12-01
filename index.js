import { ERRORS, STATUSES, notionApi, twitterApi, linkEmoji } from "./globalConfig.js";
import { getMedias } from "./utils/getMedias.js";
import { setStatus } from "./utils/setStatus.js";

const publishedRefs = [];

async function getRefs() {
  const { results } = await notionApi.databases.query({
    database_id: process.env.NOTION_DATABASE_ID,
    filter: {
      and: [
        {
          property: "Date",
          created_time: {
            after: "2022-11-29",
          },
        },
        {
          property: "Status",
          status: {
            equals: STATUSES.READY,
          },
        },
      ],
    },
  });
  results.forEach((ref) => {
    if (!publishedRefs.includes(ref.id)) {
      validateRef(ref);
    }
  });
}

async function validateRef(ref) {
  setStatus(ref, STATUSES.IN_PROGRESS);

  if (!ref.properties["Name"].title.length) {
    setStatus(ref, STATUSES.INCOMPLETE, ERRORS.MISSING_TITLE);
    return;
  }
  if (!ref.properties["Link"].url) {
    setStatus(ref, STATUSES.INCOMPLETE, ERRORS.MISSING_LINK);
    return;
  }
  if (!ref.properties["Twitter"].rich_text.length) {
    setStatus(ref, STATUSES.INCOMPLETE, ERRORS.MISSING_TWITTER);
    return;
  }
  if (
    !(
      ref.properties["Photos"].files.length ||
      (ref.cover && ref.cover.file && ref.cover.file.url.length)
    )
  ) {
    setStatus(ref, STATUSES.INCOMPLETE, ERRORS.MISSING_MEDIAS);
    return;
  }
  
  let medias = await getMedias(ref);
  if (!medias) {
    setStatus(ref, STATUSES.INCOMPLETE, ERRORS.UPLOAD_MEDIAS);
    return;
  }
  if (!Array.isArray(medias)) medias = [medias];
  
  postRef({
    id: ref.id,
    name: ref.properties["Name"].title[0].plain_text,
    link: ref.properties["Link"].url,
    twitter: ref.properties["Twitter"].rich_text[0].plain_text,
    media_ids: medias
  });
}

async function postRef(ref) {
  twitterApi.v2.tweet({ text: `${ref.name} by ${ref.twitter}\n\n${linkEmoji} ${ref.link}`, media: { media_ids: ref.media_ids } });
  publishedRefs.push(ref.id);
  setStatus(ref, STATUSES.PUBLISHED);
}

getRefs();