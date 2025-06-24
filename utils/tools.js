import path from "path";
import fs from "fs-extra";
import { remark } from "remark";
import remarkHtml from "remark-html";
import { getDBConnection } from "./db.js";

// Markdown files (for content only)
const contentDir = path.join(process.cwd(), "content");

function getToolSVGs(id) {
  const defaultSVG = `/icons/tools/${id}/default.svg`;
  const activeSVG = `/icons/tools/${id}/active.svg`;
  return [defaultSVG, activeSVG];
}

export async function getAllToolIds() {
  const db = await getDBConnection();
  const tools = await db.all("SELECT name AS tool, category FROM tools");
  await db.close();
  return tools;
}

async function getContent(toolName) {
  const filePath = path.join(contentDir, `${toolName}.md`);
  const fileContents = await fs.readFile(filePath, "utf-8");
  const match = fileContents.match(/---[\s\S]*?---([\s\S]*)/);
  const content = match ? match[1] : "";
  const processed = await remark().use(remarkHtml).process(content);
  return processed.toString();
}

export async function getToolData(toolName) {
  const db = await getDBConnection();
  const tool = await db.get(
    "SELECT * FROM tools WHERE name = ?",
    toolName
  );
  await db.close();

  if (!tool) return null;

  const content = await getContent(toolName);
  const [defaultSVG, activeSVG] = getToolSVGs(toolName);

  return {
    id: toolName,
    ...tool,
    content,
    defaultSVG,
    activeSVG,
  };
}

export async function getAllToolsCategorized() {
  const db = await getDBConnection();
  const rows = await db.all("SELECT * FROM tools");
  await db.close();

  const categorized = {};

  for (const tool of rows) {
    const [defaultSVG, activeSVG] = getToolSVGs(tool.name);

    if (!categorized[tool.category]) {
      categorized[tool.category] = [];
    }

    categorized[tool.category].push({
      id: tool.name,
      ...tool,
      defaultSVG,
      activeSVG,
    });
  }

  return categorized;
}

export function getVersion() {
  const changelogPath = path.join(process.cwd(), "content", "CHANGELOG.md");

  try {
    const changelogContent = fs.readFileSync(changelogPath, "utf-8");
    const versionRegex = /## \[(\d+\.\d+)\s+-\s+([^\]]+)\]/g;
    const matches = Array.from(changelogContent.matchAll(versionRegex));

    if (matches && matches.length > 0) {
      const lastMatch = matches[matches.length - 1];
      const version = lastMatch[1];
      const label = lastMatch[2];
      return { version, label };
    }
  } catch (error) {
    console.error("Error reading CHANGELOG.md:", error);
  }

  return {
    version: "Unknown",
    label: "Unknown",
  };
}

export async function getCategory(category) {
  const categories = require("content/categories.json");

  if (category === "categoryShowAll") {
    return Object.entries(categories).map(([cat, desc]) => ({
      category: cat,
      description: desc,
      svgIconPath: `/icons/tools/category/${cat}.svg`,
    }));
  }

  const { short, long } = categories[category];
  return {
    category: [
      {
        short,
        long,
        svgIconPath: `/icons/tools/${category}.svg`,
      },
    ],
  };
}

export async function getAllToolLabels () {
  const db = await getDBConnection()
  const rows = await db.all("SELECT name, category, tag FROM tools")
  await db.close()

  console.log('function called')


return rows.map(({ name, category, tag }) => ({ name, category, tag }));
}