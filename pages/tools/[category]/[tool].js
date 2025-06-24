// pages/[category]/[tool].js

import { getToolData, getAllToolsCategorized, getAllToolLabels } from "/utils/tools";
import ToolLayout from "/components/layouts/Tool";

export async function getServerSideProps({ params }) {
  const categorizedTools = await getAllToolsCategorized();
  const toolLabels = await getAllToolLabels();

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
      toolLabels
    },
  };
}

export default function ToolPage({ toolData, categorizedTools, toolLabels }) {
  return (
    <ToolLayout toolData={toolData} toolLabels={toolLabels} categorizedTools={categorizedTools} />
  );
}
