import ArchieveLayout from "components/layouts/Archieve";
import { getAllToolsCategorized, getCategory } from "/utils/tools";

export default function Archieve({ categorizedTools, category, categoryObject }) {
  return (
    <>
      <ArchieveLayout
        categorizedTools={categorizedTools}
        category={category}
        categoryObject={categoryObject}
      ></ArchieveLayout>
    </>
  );
}

export async function getStaticProps({ params }) {
  const category = params.category;
  const categorizedTools = await getAllToolsCategorized();
  const categoryObject = await getCategory(category);

  return {
    props: {
      categorizedTools,
      category,
      categoryObject,
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
