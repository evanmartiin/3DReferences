import dotenv from "dotenv";
dotenv.config();

import { Client } from "@notionhq/client";
import { TwitterApi } from "twitter-api-v2";

export const notionApi = new Client({ auth: process.env.NOTION_API_TOKEN });
export const twitterApi = new TwitterApi({
  appKey: process.env.TWITTER_API_KEY,
  appSecret: process.env.TWITTER_API_KEY_SECRET,
  accessToken: process.env.TWITTER_ACCESS_TOKEN,
  accessSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
});

export const STATUSES = {
  READY: "Ready",
  IN_PROGRESS: "In progress",
  INCOMPLETE: "Incomplete",
  PUBLISHED: "Published",
};

export const ERRORS = {
  MISSING_TITLE: "Missing title",
  MISSING_LINK: "Missing link",
  MISSING_TWITTER: "Missing Twitter",
  MISSING_MEDIAS: "Missing medias",
  UPLOAD_MEDIAS: "Error during media uploading",
};

export const linkEmoji = String.fromCodePoint(parseInt("1F517", 16));