import fs from "fs-extra";
import path from "path";
import remarkHtml from "remark-html";
import { remark } from "remark";

const directoryPath = path.join(process.cwd(), "database", "tools");

function parseFrontMatter(fileContents) {
  const regex = /---([\s\S]*?)---/;
  const matches = regex.exec(fileContents);
  const frontMatter = matches[0];
  const data = frontMatter.split("\n").reduce((acc, line) => {
    const [key, value] = line.split(":");
    if (key && value) {
      const trimmedKey = key.trim();
      const trimmedValue = value.trim();
      if (trimmedKey.toLowerCase() === "categories") {
        // Convert both "Text" and "text" to lowercase for comparison
        const categoryKey = trimmedKey.toLowerCase();
        const categoryValue = trimmedValue.toLowerCase();
        if (!acc[categoryKey]) {
          acc[categoryKey] = [];
        }
        acc[categoryKey].push(categoryValue);
      } else {
        acc[trimmedKey] = trimmedValue;
      }
    }
    return acc;
  }, {});
  return data;
}

async function getContent(fileContents) {
  const regex = /---([\s\S]*?)---([\s\S]*)/;
  const matches = regex.exec(fileContents);
  const content = matches[2];
  const processedContent = await remark().use(remarkHtml).process(content);
  return processedContent.toString();
}

export function getAllToolIds() {
  const fileNames = fs.readdirSync(directoryPath);

  const toolFiles = fileNames
    .filter((fileName) => path.extname(fileName) === ".md")
    .map((fileName) => {
      const filePath = path.join(directoryPath, fileName);
      const fileContents = fs.readFileSync(filePath, "utf-8");
      const frontMatter = parseFrontMatter(fileContents);

      return {
        category: frontMatter.category,
        tool: path.parse(fileName).name,
      };
    });
  return toolFiles;
}

export async function getToolData(toolName) {
  const filePath = path.join(
    process.cwd(),
    "database",
    "tools",
    `${toolName}.md`
  );
  const fileContents = await fs.promises.readFile(filePath, "utf-8");
  const frontMatter = parseFrontMatter(fileContents);
  const content = await getContent(fileContents);
  const [defaultSVG, activeSVG] = getToolSVGs(toolName);

  const toolData = {
    id: toolName,
    ...frontMatter,
    content,
    defaultSVG: defaultSVG,
    activeSVG: activeSVG,
  };

  return toolData;
}

export async function getAllToolsCategorized() {
  const toolIds = getAllToolIds();
  const toolData = {};

  for (const { category, tool } of toolIds) {
    const filePath = `${directoryPath}/${tool}.md`;
    const content = fs.readFileSync(filePath, "utf-8");
    const metaInfo = parseFrontMatter(content);
    const [defaultSVG, activeSVG] = getToolSVGs(tool);

    if (!toolData[category]) {
      toolData[category] = [];
    }

    toolData[category].push({
      id: tool,
      ...metaInfo,
      defaultSVG,
      activeSVG,
    });
  }

  return toolData;
}

export function getToolSVGs(id) {
  const defaultSVG = `/icons/tools/${id}/default.svg`;
  const activeSVG = `/icons/tools/${id}/active.svg`;

  return [defaultSVG, activeSVG];
}

export async function getCategory(category) {
  const categories = require("database/tools/categories.json");
  if (category === "categoryShowAll") {
    const allCategories = Object.entries(categories).map(
      ([category, categoryData]) => ({
        category,
        description: categoryData,
        svgIconPath: `/icons/tools/category/${category}.svg`,
      })
    );
    return allCategories;
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
