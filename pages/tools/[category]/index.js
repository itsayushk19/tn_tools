import ArchieveLayout from "components/layouts/Archieve";
import { getAllToolsCategorized, getCategory } from "/utils/tools";

export default function Archieve({ categorizedTools, category, categoryObject }) {
  return (
    <>
      <ArchieveLayout
        categorizedTools={categorizedTools}
        category={category}
        categoryObject = {categoryObject}
      ></ArchieveLayout>
    </>
  );
}

export async function getServerSideProps(context) {
  const category = `coding`
  const categorizedTools = await getAllToolsCategorized()
  const categoryObject = await getCategory(category) 

  return {
    props: {
      categorizedTools,
      category,
      categoryObject
    },
  };
}
