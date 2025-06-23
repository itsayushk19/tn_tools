// pages/[category]/[tool].js

import { getToolData, getAllToolsCategorized } from "/utils/tools";
import ToolLayout from "/components/layouts/Tool";

export async function getServerSideProps({ params }) {
  const categorizedTools = await getAllToolsCategorized();
  const { tool } = params;

  const toolData = await getToolData(tool);

  if (!toolData) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      toolData,
      categorizedTools,
    },
  };
}

export default function ToolPage({ toolData, categorizedTools }) {
  return (
    <ToolLayout toolData={toolData} categorizedTools={categorizedTools} />
  );
}
