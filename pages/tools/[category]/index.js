import ArchieveLayout from "components/layouts/Archieve";
import { getAllToolsCategorized, getCategory, getAllToolLabels } from "/utils/tools";

export default function Archieve({ categorizedTools, category, categoryObject, toolLabels }) {
  return (
    <>
      <ArchieveLayout
        categorizedTools={categorizedTools}
        category={category}
        categoryObject={categoryObject}
        toolLabels={toolLabels}
      ></ArchieveLayout>
    </>
  );
}

export async function getStaticProps({ params }) {
  const category = params.category;
  const categorizedTools = await getAllToolsCategorized();
  const categoryObject = await getCategory(category);
  const toolLabels = await getAllToolLabels()

  return {
    props: {
      categorizedTools,
      category,
      categoryObject,
      toolLabels
    },
  };
}

export async function getStaticPaths() {
  const categorizedTools = await getAllToolsCategorized();

  const paths = Object.keys(categorizedTools).map((category) => ({
    params: { category },
  }));

  return {
    paths,
    fallback: false,
  };
}
