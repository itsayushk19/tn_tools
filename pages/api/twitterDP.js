// pages/api/twitter.js
import { createServer } from "http";
import { parse } from "url";
import https from "https";
import { load } from "cheerio";

const fetchTwitterProfilePicture = (username) => {
  return new Promise((resolve, reject) => {
    const sanitizedUsername = username.replace("@", "").trim();
    const twitterUrl = `https://twitter.com/${sanitizedUsername}/photo`;

    https
      .get(twitterUrl, (response) => {
        let data = "";

        response.on("data", (chunk) => {
          data += chunk;
        });

        response.on("end", () => {
          const $ = load(data);
          const profilePictureUrl = $('img[src*="/profile_images/"]').attr(
            "src"
          );

          if (profilePictureUrl) {
            resolve(profilePictureUrl);
          } else {
            reject(new Error("Profile picture not found"));
          }
        });
      })
      .on("error", (error) => {
        reject(error);
      });
  });
};

export default async function handler(req, res) {
  const { query } = parse(req.url, true);
  const { username } = query;

  try {
    const profilePictureUrl = await fetchTwitterProfilePicture(username);
    res.status(200).json({ profilePictureUrl });
  } catch (error) {
    res.status(404).json({ error: "Profile picture not found" });
  }
}
