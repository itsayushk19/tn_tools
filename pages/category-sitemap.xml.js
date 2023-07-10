import React from "react";
import { getAllToolsCategorized } from "utils/tools";

function generateCategorySitemap(categories, baseUrl) {
  let sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  sitemapXml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

  categories.forEach((category) => {
    const categoryUrl = `${baseUrl}/tools/${category}`;
    sitemapXml += `\t<url>\n`;
    sitemapXml += `\t\t<loc>${categoryUrl}</loc>\n`;
    sitemapXml += `\t</url>\n`;
  });

  sitemapXml += `</urlset>`;
  return sitemapXml;
}

function SiteMap() {
  // getServerSideProps will do the heavy lifting
}

export async function getServerSideProps({ req, res }) {
  const tools = await getAllToolsCategorized();
  const categories = Object.keys(tools);
  const baseUrl = `${req.headers["x-forwarded-proto"]}://${req.headers["host"]}`;

  const sitemapXml = generateCategorySitemap(categories, baseUrl);

  res.setHeader("Content-Type", "text/xml");
  res.write(sitemapXml);
  res.end();

  return {
    props: {},
  };
}

export default SiteMap;
