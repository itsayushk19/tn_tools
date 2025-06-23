import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import CustomDropdown from "../elemental/dropDownSelection";

export default function CodingTool({ id }) {
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [borderColor, setBorderColor] = useState("");
  const ToolID = id.split("-");
  const [firstColorFormat, setFirstColorFormat] = useState("HEX");
  const [lastColorFormat, setLastColorFormat] = useState("RGB");
  const [colorCodes, setColorCodes] = useState({});
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
    setIsInputEmpty(inputText.trim() === "");
  }, [inputText]);

  const handleSwitchClick = () => {
    setFirstColorFormat(lastColorFormat);
    setLastColorFormat(firstColorFormat);
  };

  const handleFirstColorFormatChange = (option) => {
    if (option === lastColorFormat) {
      const dropdownForm = document.querySelector("#firstColorDropdownForm");
      dropdownForm.classList.add("error-animation");
      setTimeout(() => dropdownForm.classList.remove("error-animation"), 500);
    } else {
      setFirstColorFormat(option);
    }
  };

  const handleLastColorFormatChange = (option) => {
    if (option === firstColorFormat) {
      const dropdownForm = document.querySelector("#lastColorDropdownForm");
      dropdownForm.classList.add("error-animation");
      setTimeout(() => dropdownForm.classList.remove("error-animation"), 500);
    } else {
      setLastColorFormat(option);
    }
  };

  const handleInputChange = (event) => {
    const color = event.target.value.trim().toUpperCase();
    setInputText(color);
    setBorderColor(isValidColor(color) ? color : "");

    if (isValidColor(color)) {
      const colorFormats = ["HEX", "RGB", "RGBA", "HSL", "HSLA"];
      for (const format of colorFormats) {
        if (color.toLowerCase().startsWith(format.toLowerCase())) {
          setFirstColorFormat(format);
          break;
        }
      }
    } else if (color.length === 6 && /^[A-Fa-f0-9]{6}$/.test(color)) {
      const formattedColor = "#" + color;
      setInputText(formattedColor);
      setBorderColor(formattedColor);
      setFirstColorFormat("HEX");
    }
  };

  const isValidColor = (color) => {
    return (
      /^#([A-Fa-f0-9]{3}){1,2}$/.test(color) ||
      /^RGBA?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*(,\s*\d+(\.\d+)?)?\s*\)$/.test(color) ||
      /^HSLA?\(\s*(\d{1,3})\s*,\s*(\d{1,3})%\s*,\s*(\d{1,3})%\s*(,\s*\d+(\.\d+)?)?\s*\)$/.test(color)
    );
  };

  const handleEncodeClick = async () => {
    if (inputText.trim() === "") {
      toast.error(`Please Enter ${firstColorFormat} In The Input Field`, options);
      return;
    }

    try {
      const res = await fetch("/api/convert-color", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ color: inputText }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Conversion failed", options);
        return;
      }

      const brightness = getColorBrightness(data.HEX);
      setColorCodes({ ...data, brightness });
      setOutputText(data[lastColorFormat]);
    } catch (err) {
      toast.error("Server error. Try again.", options);
      console.error(err);
    }
  };

  const handleCopyOutput = () => {
    if (!outputText) {
      toast.warn("Output field is empty!", { autoClose: 1000 });
    } else {
      navigator.clipboard.writeText(outputText);
      toast.success(`${firstColorFormat} Successfully Copied!`, { autoClose: 500 });
    }
  };

  const handleCopy = (codeValue) => {
    navigator.clipboard
      .writeText(codeValue)
      .then(() => toast.success(`${codeValue} Copied!`, { autoClose: 1000 }))
      .catch((error) => {
        console.error("Copy failed:", error);
        toast.error("Copy failed!", { autoClose: 1000 });
      });
  };

  const handleClearOutput = () => {
    if (!outputText) {
      toast.warn("Output field is empty!", { autoClose: 1000 });
    } else {
      setOutputText("");
      toast.success("Output cleared!", { autoClose: 500 });
    }
  };

  const getColorBrightness = (HEXColor) => {
    if (!HEXColor) return "";
    const hex = HEXColor.replace("#", "");
    const red = parseInt(hex.slice(0, 2), 16);
    const green = parseInt(hex.slice(2, 4), 16);
    const blue = parseInt(hex.slice(4, 6), 16);
    const brightness = (red * 299 + green * 587 + blue * 114) / 1000;
    return brightness < 128 ? "Dark" : "Light";
  };

  return (
    <>
      <div className="grid lg:grid-flow-col">
        <div className="form__group field">
          <div className="field paletteField">
            <textarea
              className="form__field form_field_slim form_field_color"
              placeholder=" "
              value={inputText}
              onChange={handleInputChange}
              id="firstColor"
              required
            />
            <div className="colorPalette" style={{ background: `${inputText}` }} />
            <label htmlFor="BG" className="form__label txt-upper">Background Color</label>
          </div>
          <div id="firstColorDropdownForm">
            <CustomDropdown
              options={["HEX", "RGB", "HSL", "RGBA", "HSLA", "CMYK"]}
              onSelect={handleFirstColorFormatChange}
              selectedOption={firstColorFormat}
              size="slim"
              label="Label"
            />
          </div>
        </div>

        <div className="flex flex-col justify-evenly content-center items-center">
          <button
            className={`tn_button tn_button_medium tn_button_primary tn_button_round ripple ${
              isInputEmpty ? "tn_button_disabled" : ""
            }`}
            onClick={handleEncodeClick}
            disabled={isInputEmpty}
          >
            <div className="c-ripple js-ripple"><span className="c-ripple__circle"></span></div>
            Convert
          </button>
          <button
            onClick={handleSwitchClick}
            className="tn_button tn_button_medium tn_button_default tn_button_round"
          >
            Switch
          </button>
        </div>

        <div className="tn_textarea_btn">
          <div className="form__group field">
            <textarea
              className="form__field form_field_slim form_field_color readonly"
              placeholder=" "
              name="output"
              id="output"
              value={outputText}
              readOnly
            />
            <label htmlFor="output" className="form__label">
              {lastColorFormat.toUpperCase()}
            </label>
            <div id="lastColorDropdownForm">
              <CustomDropdown
                options={["HEX", "RGB", "HSL", "RGBA", "HSLA", "CMYK"]}
                onSelect={handleLastColorFormatChange}
                selectedOption={lastColorFormat}
                size="slim"
                label="Label"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-center items-center">
        <div className="colorCard form__field form__field__med form__field__no__margin">
          <div
            className="colorPane"
            style={{
              background: colorCodes.HEX?.startsWith("#") ? colorCodes.HEX : `#${colorCodes.HEX}`,
            }}
          >
            {!colorCodes.HEX && <div className="colorNotExist"><span>?</span></div>}
          </div>
          <div className="colorInfo">
            {!colorCodes.HEX ? (
              <div className="grid-container empty"><div></div><div></div><div></div><div></div></div>
            ) : (
              <div className="grid-container">
                <div><strong className="colorMeta">HEX</strong></div>
                <div className="colorMetaValue" onClick={() => handleCopy(`#${colorCodes.HEX}`)}>{colorCodes.HEX}</div>
                <div><strong className="colorMeta">RGBA</strong></div>
                <div className="colorMetaValue" onClick={() => handleCopy(colorCodes.RGBA)}>{colorCodes.RGBA}</div>
                <div><strong className="colorMeta">HSLA</strong></div>
                <div className="colorMetaValue" onClick={() => handleCopy(colorCodes.HSLA)}>{colorCodes.HSLA}</div>
                <div><strong className="colorMeta">Type</strong></div>
                <div className="colorMetaValue" onClick={() => handleCopy(colorCodes.brightness)}>{colorCodes.brightness}</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
