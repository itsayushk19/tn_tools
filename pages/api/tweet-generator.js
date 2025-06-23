// pages/api/generateTweetImage.js
import puppeteer from "puppeteer-core";
import chromium from "chrome-aws-lambda";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const { html } = req.body;
    if (!html) {
      return res.status(400).json({ error: "HTML content is required" });
    }

    const browser = await puppeteer.launch({
      args: chromium.args,
      executablePath: await chromium.executablePath,
      headless: chromium.headless,
    });

    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });

    console.log("✅ Page loaded HTML successfully");

    const element = await page.$("#tweet-image");
    if (!element) {
      throw new Error("Could not find tweet-image container");
    }

    const buffer = await element.screenshot({ type: "png" });
    await browser.close();

    res.setHeader("Content-Type", "image/png");
    res.send(buffer);

  } catch (err) {
    console.error("❌ Error in /api/generateTweetImage:", err);
    return res.status(500).json({ error: err.message });
  }
};
