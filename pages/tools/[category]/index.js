import ArchieveLayout from "components/layouts/Archieve";
import { getAllToolsCategorized, getCategory } from "/utils/tools";

export async function Archieve() {
  const category = `coding`
  const categorizedTools = await getAllToolsCategorized()
  const categoryObject = await getCategory(category) 
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