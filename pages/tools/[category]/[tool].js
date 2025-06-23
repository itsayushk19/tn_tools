// pages/[category]/[tool].js

import {
  getAllToolIds,
  getToolData,
  getAllToolsCategorized,
} from "/utils/tools"
import ToolLayout from "/components/layouts/Tool"

// This function runs at build time and specifies which paths should be pre-rendered
export async function getStaticPaths() {
  const toolFiles = await getAllToolIds()

  const paths = toolFiles.map(({ category, tool }) => ({
    params: { category: category.toLowerCase(), tool: tool.toLowerCase() },
  }))

  return {
    paths,
    fallback: false,
  }
}

export async function getStaticProps({ params }) {
  const categorizedTools = await getAllToolsCategorized();
  const { tool } = params;

  const toolData = await getToolData(tool);

  if (!toolData) {
    return {
      notFound: true, // This tells Next.js to show the 404 page
    };
  }

  console.log("toolData from getStaticProps:", toolData);


  return {
    props: {
      toolData,
      categorizedTools,
    },
  };
}


export default function ToolPage({ toolData, categorizedTools }) {

  // Render the page using toolData
  return (
    <ToolLayout toolData={toolData} categorizedTools={categorizedTools}/>
  )
}
