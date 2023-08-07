import ColorModal from "../elemental/colorModal";
import { useState } from "react";


export default function BarGraph() {
  const [selectedColor, setSelectedColor] = useState({
    doc: "#226df5",
    brandkit: "#000000",
    default: "",
  });

  return (
    <>
    <div className="grid lg:grid-cols-4">
    <ColorModal
        selectedColor={selectedColor}
        setSelectedColor={setSelectedColor}
      />
    </div>
    </>
  );
}
