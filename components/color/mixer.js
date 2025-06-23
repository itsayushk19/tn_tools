import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { saveAs } from "file-saver";
import CustomDropdown from "../elemental/dropDownSelection";
import colorDictionary from "../css/colors.json";

export default function ColorMixTool({ id }) {
  const [startColor, setStartColor] = useState("");
  const [endColor, setEndColor] = useState("");
  const [BGColor, setBGColor] = useState("");
  const [steps, setSteps] = useState(1);
  const [mixedColors, setMixedColors] = useState([]);
  const [isInputEmpty, setIsInputEmpty] = useState(true);

  const options = {
    position: "top-center",
    autoClose: 1000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "dark",
  };

  useEffect(() => {
    setIsInputEmpty(startColor.trim() === "" || endColor.trim() === "");
  }, [startColor, endColor]);

  const handleStartColorChange = (e) => {
    setStartColor(resolveNamedColor(e.target.value));
  };

  const handleEndColorChange = (e) => {
    setEndColor(resolveNamedColor(e.target.value));
  };

  const resolveNamedColor = (color) => {
    const parts = color.toLowerCase().split(/\s+/);
    if (parts.length === 2 && ["light", "dark"].includes(parts[0])) {
      const variation = parts[0];
      const base = parts[1];
      const baseData = colorDictionary[base];
      if (baseData && baseData[variation]) return baseData[variation];
    } else if (parts.length === 1) {
      const baseData = colorDictionary[parts[0]];
      if (baseData) return baseData.hex;
    }
    if (color.length === 6 && /^[A-Fa-f0-9]{6}$/.test(color)) return "#" + color;
    return color;
  };

  const handleStepsChange = (option) => setSteps(option);

  const handleMixClick = async () => {
    if (isInputEmpty) {
      toast.error("Please enter start and end colors.", options);
      return;
    }
    setBGColor(startColor);

    try {
      const res = await fetch("/api/mix-colors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ startColor, endColor, steps }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to mix");

      const converted = data.colors.map((hex) => {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return {
          hex: hex.replace("#", ""),
          rgba: `rgba(${r}, ${g}, ${b}, 1)`,
          hsla: "hsla(...)",
          original: hex,
        };
      });

      setMixedColors(converted);
    } catch (err) {
      console.error(err);
      toast.error("Color mixing failed");
    }
  };

  const handleCopy = (text) => {
    navigator.clipboard
      .writeText(text)
      .then(() => toast.success(`${text} copied!`, { autoClose: 1000 }))
      .catch(() => toast.error("Copy failed!", { autoClose: 1000 }));
  };

  return (
    <>
      <div className="grid lg:grid-flow-col gap-4">
        <div className="form__group field paletteField">
          <textarea
            className="form__field form_field_slim form_field_color"
            placeholder=" "
            name="startColor"
            required
            value={startColor}
            onChange={handleStartColorChange}
          />
          <div className="colorPalette" style={{ background: startColor }}></div>
          <label htmlFor="startColor" className="form__label txt-upper">Start Color</label>
        </div>

        <div className="form__group field paletteField">
          <textarea
            className="form__field form_field_slim form_field_color"
            placeholder=" "
            name="endColor"
            required
            value={endColor}
            onChange={handleEndColorChange}
          />
          <div className="colorPalette" style={{ background: endColor }}></div>
          <label htmlFor="endColor" className="form__label txt-upper">End Color</label>
        </div>

        <div className="form__group field">
          <CustomDropdown
            options={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]}
            onSelect={handleStepsChange}
            size="slim"
            label="Steps"
            selectedOption={steps}
          />
        </div>
      </div>

      <div className="flex justify-center mt-4">
        <button
          className={`tn_button tn_button_medium tn_button_primary ripple ${
            isInputEmpty ? "tn_button_disabled" : ""
          }`}
          onClick={handleMixClick}
          disabled={isInputEmpty}
        >
          Mix Colors
        </button>
      </div>

      <div className="grid lg:grid-cols-1 gap-4 mt-8" style={{ justifyItems: "center" }}>
        {mixedColors.map((color, i) => (
          <div key={i} className="colorCard form__field form__field__med form__field__no__margin">
            <div className="colorPane" style={{ background: `#${color.hex}` }}></div>
            <div className="colorInfo">
              {["original", "hex", "rgba", "hsla"].map((key) => (
                <div key={key} className="grid-container">
                  <strong className="colorMeta">{key.toUpperCase()}</strong>
                  <div className="colorMetaValue" onClick={() => handleCopy(color[key])}>
                    {color[key]}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
