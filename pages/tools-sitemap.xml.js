import React from "react";
import { getAllToolsCategorized } from "utils/tools";

function parseDate(dateString) {
            const parts = dateString.split("-");
            const year = parts[0];
            const month = parts[2];
            const day = parts[1];
            return `${year}-${month}-${day}`;
          }

function generateSitemap(tools, baseUrl) {
  let sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  sitemapXml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

  Object.entries(tools).forEach(([category, tools]) => {
    tools.forEach((tool) => {
      const toolUrl = `${baseUrl}/tools/${category}/${tool.id}`;
      const toolDate = parseDate(tool.date);
      sitemapXml += `\t<url>\n`;
      sitemapXml += `\t\t<loc>${toolUrl}</loc>\n`;
      sitemapXml += `\t\t<lastmod>${toolDate}</lastmod>\n`;
      sitemapXml += `\t</url>\n`;
    });
  });

  sitemapXml += `</urlset>`;
  return sitemapXml;
}

function SiteMap() {
  // getServerSideProps will do the heavy lifting
}

export async function getServerSideProps({ req, res }) {
  const tools = await getAllToolsCategorized();
  const baseUrl = `${req.headers["x-forwarded-proto"]}://${req.headers["host"]}`;

  const sitemapXml = generateSitemap(tools, baseUrl);

  res.setHeader("Content-Type", "text/xml");
  // we send the XML to the browser
  res.write(sitemapXml);
  res.end();

  return {
    props: {},
  };
}

export default SiteMap;