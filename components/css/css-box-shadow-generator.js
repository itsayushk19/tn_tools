import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import colorDictionary from "./colors.json";
import Highlight from "react-highlight";
import CustomDropdown from "../elemental/dropDownSelection";
import CustomCheckbox from "../elemental/checkBox";

const options = ["Option 1", "Option 2", "Option 3", "Option 4"];

export default function LoremIpsumGenerator() {
  const defaultSettings = {
    HorizOff: "-22",
    VertOff: "3",
    Blur: "10",
    Spread: "3",
    firstColor: "#ffffff",
    firstColorFormat: "hex",
    secondColor: "#d05c58",
    secondColorFormat: "hex",
    thirdColor: "#dddddd",
    thirdColorFormat: "rgb",
    selectedOption: 1,
    inset: false,
  };
  const [HorizOff, setHorizzOff] = useState(defaultSettings.HorizOff);
  const [VertOff, setVertOff] = useState(defaultSettings.VertOff);
  const [Blur, setBlur] = useState(defaultSettings.Blur);
  const [Spread, setSpread] = useState(defaultSettings.Spread);
  const [firstColor, setFirstColor] = useState(defaultSettings.firstColor);
  const [firstColorFormat, setFirstColorFormat] = useState(
    defaultSettings.firstColorFormat
  );
  const [secondColor, setSecondColor] = useState(defaultSettings.secondColor);
  const [secondColorFormat, setSecondColorFormat] = useState(
    defaultSettings.secondColorFormat
  );
  const [thirdColor, setThirdColor] = useState(defaultSettings.thirdColor);
  const [thirdColorFormat, setThirdColorFormat] = useState(
    defaultSettings.thirdColorFormat
  );
  const [selectedOption, setSelectedOption] = useState(
    defaultSettings.selectedOption
  );
  const [inset, setInset] = useState(defaultSettings.inset);
  const [outputCSS, setOutputCSS] = useState("");

  const handleCopy = () => {
    // Copy the CSS code to the clipboard
    navigator.clipboard.writeText(outputCSS);
    toast.success("CSS code copied to clipboard!", {
      position: toast.POSITION.TOP_RIGHT,
    });
  };

  const handleReset = () => {
    // Reset the values to their default settings
    setHorizzOff(defaultSettings.HorizOff);
    setVertOff(defaultSettings.VertOff);
    setBlur(defaultSettings.Blur);
    setSpread(defaultSettings.Spread);
    setFirstColor(defaultSettings.firstColor);
    setFirstColorFormat(defaultSettings.firstColorFormat);
    setSecondColor(defaultSettings.secondColor);
    setSecondColorFormat(defaultSettings.secondColorFormat);
    setThirdColor(defaultSettings.thirdColor);
    setThirdColorFormat(defaultSettings.thirdColorFormat);
    setSelectedOption(defaultSettings.selectedOption);
    setInset(defaultSettings.inset);
  };

  useEffect(() => {
    // Build the box-shadow CSS string
    const boxShadow = `${HorizOff}px ${VertOff}px ${Blur}px ${Spread}px ${thirdColor}`;

    // Build the full CSS string with all vendor prefixes for box shadow
    const outputCSS = `
      -webkit-box-shadow: inset ${boxShadow};
      -moz-box-shadow: inset ${boxShadow};
      box-shadow: inset ${boxShadow};
    `;

    // Update the state variable
    setOutputCSS(outputCSS);
  }, [HorizOff, VertOff, Blur, Spread, thirdColor, inset]);

  const handleInsetToggle = () => {
    setInset(!inset);
  };

  const handleOptionChange = (option) => {
    setSelectedOption(option);
  };

  const handleHorizOffChange = (event) => {
    const value = event.target.value;
    setHorizzOff(value);
  };

  const handleVertOffChange = (event) => {
    const value = event.target.value;
    setVertOff(value);
  };

  const handleBlurChange = (event) => {
    const value = event.target.value;
    setBlur(value);
  };

  const handleSpreadChange = (event) => {
    const value = event.target.value;
    setSpread(value);
  };
  const handleOptionSelect = (selectedOption) => {
    console.log("Selected option:", selectedOption);
    // Do something with the selected option, e.g., update state or perform an action.
  };

  const handleColorChange = (event, setColor, setColorFormat) => {
    const color = event.target.value.trim(); // Remove leading and trailing whitespaces

    // Check for light/dark first before primary color
    const colorParts = color.toLowerCase().split(/\s+/);
    if (
      colorParts.length === 2 &&
      (colorParts[0] === "light" || colorParts[0] === "dark")
    ) {
      const lightOrDark = colorParts[0];
      const primaryColor = colorParts[1];
      const primaryColorData = colorDictionary[primaryColor];

      if (primaryColorData) {
        if (lightOrDark === "light" && primaryColorData.light) {
          setColor(primaryColorData.light);
          return;
        } else if (lightOrDark === "dark" && primaryColorData.dark) {
          setColor(primaryColorData.dark);
          return;
        }
      }

      // If the light/dark variation is not available, fall back to using the entered color
      setColor(color);
      return;
    }

    // If no light/dark or invalid input, continue with existing logic
    setColor(color);

    // Check for primary color or variations (light/dark)
    if (colorParts.length >= 1) {
      const primaryColor = colorParts[0];
      const primaryColorData = colorDictionary[primaryColor];

      if (primaryColorData) {
        const lightOrDark = colorParts[1];

        if (lightOrDark === "light" && primaryColorData.light) {
          setColor(primaryColorData.light);
          return;
        } else if (lightOrDark === "dark" && primaryColorData.dark) {
          setColor(primaryColorData.dark);
          return;
        } else if (!lightOrDark) {
          // If no light/dark specified, set the hex color
          setColor(primaryColorData.hex);
          return;
        }
      }
    }

    // If the entered color is not a primary color or variation, continue with existing logic
    if (isValidColor(color)) {
      const colorFormats = ["hex", "rgb", "rgba", "hsl", "hsla"];

      for (const format of colorFormats) {
        if (color.toLowerCase().startsWith(format)) {
          setColorFormat(format);
          break;
        }
      }
    } else if (color.length === 6 && /^[A-Fa-f0-9]{6}$/.test(color)) {
      const formattedColor = "#" + color;
      setColor(formattedColor);
    }
  };

  const isValidColor = (color) => {
    // Hex color validation (e.g., #FFF, #FFFFFF)
    if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(color)) {
      return true;
    }

    // RGB/RGBA color validation (e.g., rgb(255, 255, 255), rgba(255, 255, 255, 0.5))
    if (
      /^rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*(,\s*\d+(\.\d+)?)?\s*\)$/.test(
        color
      )
    ) {
      return true;
    }

    // HSL/HSLA color validation (e.g., hsl(0, 100%, 50%), hsla(0, 100%, 50%, 0.5))
    if (
      /^hsla?\(\s*(\d{1,3})\s*,\s*(\d{1,3})%\s*,\s*(\d{1,3})%\s*(,\s*\d+(\.\d+)?)?\s*\)$/.test(
        color
      )
    ) {
      return true;
    }

    return false;
  };

  return (
    <>
      <div className="grid lg:grid-flow-col gap-5">
        <CustomCheckbox options={options} orientation={"vertical"} />
      </div>
      <div className="grid lg:grid-flow-col gap-5">
        <CustomDropdown
          options={options}
          onSelect={handleOptionSelect}
          size="slim"
          label="Label"
        />
      </div>
      <div className="grid lg:grid-cols-3 gap-5">
        <div className="grid lg:grid-cols-1 pane">
          <div className="flex flex-col justify-between">
            <div className="vertiCal">
              <label className="tn_text text-sm" htmlFor="HorizOff">
                Horizontal Offset:{" "}
                <strong>
                  <input
                    type="number"
                    className="bg-transparent w-14 text-sm"
                    style={{ border: "1px solid lightgray", padding: "0.2em" }}
                    value={HorizOff}
                    onChange={handleHorizOffChange}
                  ></input>
                </strong>
              </label>
              <input
                type="range"
                id="HorizOff"
                min={-40}
                max={40}
                value={HorizOff}
                onChange={handleHorizOffChange}
              />
            </div>
            <div className="vertiCal">
              <label className="tn_text text-sm" htmlFor="VertOff">
                Vertical Offset:{" "}
                <strong>
                  <input
                    type="number"
                    className="bg-transparent w-14 text-sm"
                    style={{ border: "1px solid lightgray", padding: "0.2em" }}
                    value={VertOff}
                    onChange={handleVertOffChange}
                  ></input>
                </strong>
              </label>
              <input
                type="range"
                id="vertOff"
                min={-40}
                max={40}
                value={VertOff}
                onChange={handleVertOffChange}
              />
            </div>
            <div className="vertiCal">
              <label
                className="tn_text text-sm"
                htmlFor="avgSentencesPerParagraph"
              >
                Blur:{" "}
                <strong>
                  <input
                    type="number"
                    className="bg-transparent w-14 text-sm"
                    style={{ border: "1px solid lightgray", padding: "0.2em" }}
                    value={Blur}
                    onChange={handleBlurChange}
                  ></input>
                </strong>
              </label>
              <input
                type="range"
                id="blur"
                min={0}
                max={20}
                value={Blur}
                onChange={handleBlurChange}
              />
            </div>
            <div className="vertiCal">
              <label className="tn_text text-sm" htmlFor="Spread">
                Spread:{" "}
                <strong>
                  <input
                    type="number"
                    className="bg-transparent w-14 text-sm"
                    style={{ border: "1px solid lightgray", padding: "0.2em" }}
                    value={Spread}
                    onChange={handleSpreadChange}
                  ></input>
                </strong>
              </label>
              <input
                type="range"
                id="spread"
                min={0}
                max={20}
                value={Spread}
                onChange={handleSpreadChange}
              />
            </div>
            <div className="vertiCal">
              <button
                onClick={handleInsetToggle}
                className={`tn_button tn_button_small tn_button_round ${
                  inset ? "tn_button_primary" : ""
                }`}
              >
                {inset ? "Disable Inset" : "Enable Inset"}
              </button>
            </div>
          </div>
        </div>
        <div className="grid lg:grid-cols-1 form__field">
          <div className="form__group field paletteField">
            <textarea
              className="form__field form_field_slim form_field_color"
              placeholder=" "
              name="firstColor"
              id="firstColor"
              required
              value={firstColor}
              onChange={(e) =>
                handleColorChange(e, setFirstColor, setFirstColorFormat)
              }
            />
            <div
              className="colorPalette"
              style={{ background: `${firstColor}` }}
            ></div>
            <label htmlFor="BG" className="form__label txt-upper">
              Background Color
            </label>
          </div>
          <div className="form__group field paletteField">
            <div
              className="colorPalette"
              style={{ background: `${secondColor}` }}
            ></div>
            <textarea
              className="form__field form_field_slim form_field_color"
              placeholder=" "
              name="secondColor"
              id="secondColor"
              required
              value={secondColor}
              onChange={(e) =>
                handleColorChange(e, setSecondColor, setSecondColorFormat)
              }
            />
            <label htmlFor="BoxColor" className="form__label txt-upper">
              Box Color
            </label>
          </div>
          <div className="form__group field paletteField">
            <div
              className="colorPalette"
              style={{ background: `${thirdColor}` }}
            ></div>
            <textarea
              className="form__field form_field_slim form_field_color "
              placeholder=" "
              name="thirdColor"
              id="thirdColor"
              required
              value={thirdColor}
              onChange={(e) =>
                handleColorChange(e, setThirdColor, setThirdColorFormat)
              }
            />
            <label htmlFor="ShadowColor" className="form__label txt-upper">
              Shadow Color
            </label>
          </div>
        </div>
        <div className="grid lg:grid-cols-1 form__field pl-0">
          <div className="shadowPreview">
            <div
              style={{
                boxShadow: `${thirdColor} ${VertOff} ${HorizOff} ${Blur} ${Spread}`,
              }}
              className="shadowPreview_render"
            ></div>
          </div>
        </div>
      </div>
      <div className="grid pane">
        <Highlight className="language-css">{outputCSS}</Highlight>
      </div>
      <div className="tn_button_group flex justify-center">
        <button
          onClick={handleCopy}
          className={`tn_button tn_button_medium tn_button_bordered tn_button_round`}
        >
          Copy
        </button>
        <button
          onClick={handleReset}
          className={`tn_button tn_button_medium  tn_button_primary tn_button_round ml-5`}
        >
          Reset
        </button>
      </div>

      <style jsx>{`
        .shadowPreview {
          width: 100%;
          box-sizing: border-box;
          height: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          background: ${firstColor};
        }

        .shadowPreview_render {
          width: 50%;
          height: 50%;
          box-sizing: border-box;
          background: ${secondColor};
          border-radius: 20px;
          box-shadow: ${inset ? "inset" : ""} ${thirdColor} ${VertOff}px
            ${HorizOff}px ${Blur}px ${Spread}px;
          transition: all 0.1s ease-in-out;
        }
      `}</style>
    </>
  );
}
