import { useState, useEffect } from "react";
import { toast } from "react-toastify";

export default function CodingTool({ id }) {
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [borderColor, setBorderColor] = useState("");
  const ToolID = id.split("-");
  const [firstColorFormat, setFirstColorFormat] = useState(`hex`);
  const [lastColorFormat, setLastColorFormat] = useState(`rgb`);
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

  const handleColorPickerOpen = () => {
    if (inputRef.current) {
      inputRef.current.click(); // Trigger the click event on the hidden input element
    }
  };

  const handleColorPickerChange = (event) => {
    const selectedColor = event.target.value;
    setInputText(selectedColor);
    setBorderColor(isValidColor(selectedColor) ? selectedColor : "");
  };

  const handleFirstColorFormatChange = (event) => {
    const selectedFormat = event.target.value;

    if (selectedFormat === lastColorFormat) {
      // Vibrate or oscillate the dropdown form to indicate the selection is wrong
      const dropdownForm = document.querySelector("#firstColorDropdownForm");
      dropdownForm.classList.add("error-animation");
      setTimeout(() => {
        dropdownForm.classList.remove("error-animation");
      }, 500);
    } else {
      setFirstColorFormat(selectedFormat);
    }
  };

  const handleLastColorFormatChange = (event) => {
    const selectedFormat = event.target.value;

    if (selectedFormat === firstColorFormat) {
      // Vibrate or oscillate the dropdown form to indicate the selection is wrong
      const dropdownForm = document.querySelector("#lastColorDropdownForm");
      dropdownForm.classList.add("error-animation");
      setTimeout(() => {
        dropdownForm.classList.remove("error-animation");
      }, 500);
    } else {
      setLastColorFormat(selectedFormat);
    }
  };

  const handleInputChange = (event) => {
    const color = event.target.value.trim();

    setInputText(color);
    setBorderColor(isValidColor(color) ? color : "");

    if (isValidColor(color)) {
      // Get the first color format that matches the entered color
      const colorFormats = ["hex", "rgb", "rgba", "hsl", "hsla"];

      for (const format of colorFormats) {
        if (color.toLowerCase().startsWith(format)) {
          setFirstColorFormat(format);
          break;
        }
      }
    } else if (color.length === 6 && /^[A-Fa-f0-9]{6}$/.test(color)) {
      // If the input is a 6-digit hexadecimal code without the "#"
      const formattedColor = "#" + color;
      setInputText(formattedColor);
      setBorderColor(formattedColor);
      setFirstColorFormat("hex");
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

  const convertColor = (color) => {
    // Remove whitespace and convert to lowercase
    const trimmedColor = color.trim().toLowerCase();

    if (
      /^cmyk\(\s*(\d{1,3})%\s*,\s*(\d{1,3})%\s*,\s*(\d{1,3})%\s*,\s*(\d{1,3})%\s*\)$/.test(
        color
      )
    ) {
      const cmykMatch = color.match(
        /cmyk\(\s*(\d{1,3})%\s*,\s*(\d{1,3})%\s*,\s*(\d{1,3})%\s*,\s*(\d{1,3})%\s*\)/i
      );

      const cyan = parseInt(cmykMatch[1], 10);
      const magenta = parseInt(cmykMatch[2], 10);
      const yellow = parseInt(cmykMatch[3], 10);
      const black = parseInt(cmykMatch[4], 10);

      // Convert CMYK to RGB
      const normalizedCyan = cyan / 100;
      const normalizedMagenta = magenta / 100;
      const normalizedYellow = yellow / 100;
      const normalizedBlack = black / 100;

      const red = Math.round(
        255 * (1 - normalizedCyan) * (1 - normalizedBlack)
      );
      const green = Math.round(
        255 * (1 - normalizedMagenta) * (1 - normalizedBlack)
      );
      const blue = Math.round(
        255 * (1 - normalizedYellow) * (1 - normalizedBlack)
      );

      const rgb = `rgb(${red}, ${green}, ${blue})`;
      const rgba = `rgba(${red}, ${green}, ${blue}, 1)`;

      // Convert RGB to HSL
      const normalizedRed = red / 255;
      const normalizedGreen = green / 255;
      const normalizedBlue = blue / 255;

      const max = Math.max(normalizedRed, normalizedGreen, normalizedBlue);
      const min = Math.min(normalizedRed, normalizedGreen, normalizedBlue);
      let hue, saturation, lightness;

      const delta = max - min;
      lightness = (max + min) / 2;

      if (delta === 0) {
        hue = 0;
        saturation = 0;
      } else {
        if (max === normalizedRed) {
          hue = ((normalizedGreen - normalizedBlue) / delta) % 6;
        } else if (max === normalizedGreen) {
          hue = (normalizedBlue - normalizedRed) / delta + 2;
        } else {
          hue = (normalizedRed - normalizedGreen) / delta + 4;
        }

        saturation = delta / (1 - Math.abs(2 * lightness - 1));
      }

      hue = Math.round(hue * 60);
      saturation = Math.round(saturation * 100);
      lightness = Math.round(lightness * 100);

      const hsl = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
      const hsla = `hsla(${hue}, ${saturation}%, ${lightness}%, 1)`;

      return {
        hex,
        rgb,
        rgba,
        hsl,
        hsla,
        cmyk: color,
      };
    } else if (trimmedColor.startsWith("#")) {
      // Hex color
      const hex = trimmedColor.replace("#", "");
      const red = parseInt(hex.substr(0, 2), 16);
      const green = parseInt(hex.substr(2, 2), 16);
      const blue = parseInt(hex.substr(4, 2), 16);

      const rgb = `rgb(${red}, ${green}, ${blue})`;
      const rgba = `rgba(${red}, ${green}, ${blue}, 1)`;

      // Convert hex to HSL
      const normalizedRed = red / 255;
      const normalizedGreen = green / 255;
      const normalizedBlue = blue / 255;

      const max = Math.max(normalizedRed, normalizedGreen, normalizedBlue);
      const min = Math.min(normalizedRed, normalizedGreen, normalizedBlue);
      let hue, saturation, lightness;

      const delta = max - min;
      lightness = (max + min) / 2;

      if (delta === 0) {
        hue = 0;
        saturation = 0;
      } else {
        if (max === normalizedRed) {
          hue = ((normalizedGreen - normalizedBlue) / delta) % 6;
        } else if (max === normalizedGreen) {
          hue = (normalizedBlue - normalizedRed) / delta + 2;
        } else {
          hue = (normalizedRed - normalizedGreen) / delta + 4;
        }

        saturation = delta / (1 - Math.abs(2 * lightness - 1));
      }

      hue = Math.round(hue * 60);
      saturation = Math.round(saturation * 100);
      lightness = Math.round(lightness * 100);

      const hsl = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
      const hsla = `hsla(${hue}, ${saturation}%, ${lightness}%, 1)`;

      return {
        hex,
        rgb,
        rgba,
        hsl,
        hsla,
      };
    } else if (trimmedColor.startsWith("rgb")) {
      // RGB color
      const rgbMatch = trimmedColor.match(
        /rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/i
      );
      if (rgbMatch) {
        const red = parseInt(rgbMatch[1], 10);
        const green = parseInt(rgbMatch[2], 10);
        const blue = parseInt(rgbMatch[3], 10);

        const hexRed = red.toString(16).padStart(2, "0");
        const hexGreen = green.toString(16).padStart(2, "0");
        const hexBlue = blue.toString(16).padStart(2, "0");

        const hex = `#${hexRed}${hexGreen}${hexBlue}`;
        const rgba = `rgba(${red}, ${green}, ${blue}, 1)`;

        // Convert RGB to HSL
        const normalizedRed = red / 255;
        const normalizedGreen = green / 255;
        const normalizedBlue = blue / 255;

        const max = Math.max(normalizedRed, normalizedGreen, normalizedBlue);
        const min = Math.min(normalizedRed, normalizedGreen, normalizedBlue);
        let hue, saturation, lightness;

        const delta = max - min;
        lightness = (max + min) / 2;

        if (delta === 0) {
          hue = 0;
          saturation = 0;
        } else {
          if (max === normalizedRed) {
            hue = ((normalizedGreen - normalizedBlue) / delta) % 6;
          } else if (max === normalizedGreen) {
            hue = (normalizedBlue - normalizedRed) / delta + 2;
          } else {
            hue = (normalizedRed - normalizedGreen) / delta + 4;
          }

          saturation = delta / (1 - Math.abs(2 * lightness - 1));
        }

        hue = Math.round(hue * 60);
        saturation = Math.round(saturation * 100);
        lightness = Math.round(lightness * 100);

        const hsl = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
        const hsla = `hsla(${hue}, ${saturation}%, ${lightness}%, 1)`;

        return {
          hex,
          hsl,
          hsla,
        };
      }
    } else if (trimmedColor.startsWith("hsl")) {
      // HSL color
      const hslMatch = trimmedColor.match(
        /hsl\(\s*(\d+)\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*\)/i
      );
      if (hslMatch) {
        const hue = parseInt(hslMatch[1], 10);
        const saturation = parseInt(hslMatch[2], 10);
        const lightness = parseInt(hslMatch[3], 10);

        // Convert HSL to RGB
        const normalizedHue = hue / 360;
        const normalizedSaturation = saturation / 100;
        const normalizedLightness = lightness / 100;

        if (normalizedSaturation === 0) {
          const rgbValue = Math.round(normalizedLightness * 255);
          const rgb = `rgb(${rgbValue}, ${rgbValue}, ${rgbValue})`;
          const rgba = `rgba(${rgbValue}, ${rgbValue}, ${rgbValue}, 1)`;

          const hexRed = rgbValue.toString(16).padStart(2, "0");
          const hexGreen = rgbValue.toString(16).padStart(2, "0");
          const hexBlue = rgbValue.toString(16).padStart(2, "0");
          const hex = `#${hexRed}${hexGreen}${hexBlue}`;

          return {
            hex,
            rgb,
            rgba,
            hsl,
            hsla,
          };
        } else {
          const q =
            normalizedLightness < 0.5
              ? normalizedLightness * (1 + normalizedSaturation)
              : normalizedLightness +
                normalizedSaturation -
                normalizedLightness * normalizedSaturation;
          const p = 2 * normalizedLightness - q;

          const hueToRGB = (t) => {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1 / 6) return p + (q - p) * 6 * t;
            if (t < 1 / 2) return q;
            if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
            return p;
          };

          const red = Math.round(hueToRGB(normalizedHue + 1 / 3) * 255);
          const green = Math.round(hueToRGB(normalizedHue) * 255);
          const blue = Math.round(hueToRGB(normalizedHue - 1 / 3) * 255);

          const rgb = `rgb(${red}, ${green}, ${blue})`;
          const rgba = `rgba(${red}, ${green}, ${blue}, 1)`;

          const hexRed = red.toString(16).padStart(2, "0");
          const hexGreen = green.toString(16).padStart(2, "0");
          const hexBlue = blue.toString(16).padStart(2, "0");
          const hex = `#${hexRed}${hexGreen}${hexBlue}`;

          return {
            hex,
            rgb,
            rgba,
            hsl,
            hsla,
          };
        }
      }
    }

    // If the color cannot be detected or converted, return the input color itself
    return {
      original: color,
    };
  };

  const handleEncodeClick = () => {
    if (inputText.trim() === "") {
      toast.error(`Please Enter ${firstColor} In The Input Field`, options);
      return;
    }

    const convertedColor = convertColor(inputText);
    const brightness = getColorBrightness(convertedColor.hex);

    setColorCodes({
      hex: convertedColor.hex,
      rgba: convertedColor.rgba,
      hsla: convertedColor.hsla,
      brightness: brightness,
    });

    setOutputText(convertedColor[lastColorFormat]);
  };

  const handleCopyOutput = () => {
    if (!outputText) {
      toast.warn("Output field is empty!", { autoClose: 1000 });
    } else {
      navigator.clipboard.writeText(outputText);
      toast.success(`${firstColor} Successfully Copied!`, { autoClose: 500 });
    }
  };

  const handleCopy = (codeValue) => {
    navigator.clipboard
      .writeText(codeValue)
      .then(() => {
        toast.success(`${codeValue} Copied!`, { autoClose: 1000 });
      })
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

  const getColorBrightness = (hexColor) => {
    if (!hexColor) {
      return ""; // Return empty string if color code is not available
    }

    // Remove '#' from the hex color
    const hex = hexColor.substring(1);

    // Convert the hex color to RGB
    const red = parseInt(hex.substring(0, 2), 16);
    const green = parseInt(hex.substring(2, 4), 16);
    const blue = parseInt(hex.substring(4, 6), 16);

    // Calculate the brightness using the YIQ formula
    const brightness = (red * 299 + green * 587 + blue * 114) / 1000;

    return brightness < 128 ? "Dark" : "Light";
  };

  return (
    <>
      <div className="grid lg:grid-flow-col">
        <div className="form__group field">
          <textarea
            className="form__field form_field_slim form_field_color code"
            placeholder=" "
            name="input"
            id="input"
            required
            value={inputText}
            onChange={handleInputChange}
            style={{ borderColor: borderColor }}
          />
          <label htmlFor="input" className="form__label txt-upper">
            {firstColorFormat.toUpperCase()}
          </label>
          <form className="field_drop_selection" id="firstColorDropdownForm">
            <div id="select-box">
              <input type="checkbox" id="options-view-button" />
              <div id="select-button" className="brd">
                <div id="selected-value">
                  <span>Select Color</span>
                </div>
              </div>
              <div id="options">
                <div className="option">
                  <input
                    className="s-c top"
                    type="radio"
                    name="firstColorFormat"
                    value="hex"
                    checked={firstColorFormat === "hex"}
                    onChange={handleFirstColorFormatChange}
                  />
                  <input
                    className="s-c bottom"
                    type="radio"
                    name="firstColorFormat"
                    value="Hex"
                    checked={firstColorFormat === "Hex"}
                    onChange={handleFirstColorFormatChange}
                  />
                  <span className="label">Hex</span>
                  <span className="opt-val">Hex</span>
                </div>
                <div className="option">
                  <input
                    className="s-c top"
                    type="radio"
                    name="firstColorFormat"
                    value="rgb"
                    checked={firstColorFormat === "rgb"}
                    onChange={handleFirstColorFormatChange}
                  />
                  <input
                    className="s-c bottom"
                    type="radio"
                    name="firstColorFormat"
                    value="RGB"
                    checked={firstColorFormat === "RGB"}
                    onChange={handleFirstColorFormatChange}
                  />
                  <span className="label">RGB</span>
                  <span className="opt-val">RGB</span>
                </div>
                <div className="option">
                  <input
                    className="s-c top"
                    type="radio"
                    name="firstColorFormat"
                    value="rgba"
                    checked={firstColorFormat === "rgba"}
                    onChange={handleFirstColorFormatChange}
                  />
                  <input
                    className="s-c bottom"
                    type="radio"
                    name="firstColorFormat"
                    value="RGB"
                    checked={firstColorFormat === "RGBA"}
                    onChange={handleFirstColorFormatChange}
                  />
                  <span className="label">RGBA</span>
                  <span className="opt-val">RGBA</span>
                </div>
                <div className="option">
                  <input
                    className="s-c top"
                    type="radio"
                    name="firstColorFormat"
                    value="hsl"
                    checked={firstColorFormat === "hsl"}
                    onChange={handleFirstColorFormatChange}
                  />
                  <input
                    className="s-c bottom"
                    type="radio"
                    name="firstColorFormat"
                    value="HSL"
                    checked={firstColorFormat === "HSL"}
                    onChange={handleFirstColorFormatChange}
                  />
                  <span className="label">HSL</span>
                  <span className="opt-val">HSL</span>
                </div>
                <div className="option">
                  <input
                    className="s-c top"
                    type="radio"
                    name="firstColorFormat"
                    value="hsla"
                    checked={firstColorFormat === "hsla"}
                    onChange={handleFirstColorFormatChange}
                  />
                  <input
                    className="s-c bottom"
                    type="radio"
                    name="firstColorFormat"
                    value="HSLA"
                    checked={firstColorFormat === "HSLA"}
                    onChange={handleFirstColorFormatChange}
                  />
                  <span className="label">HSLA</span>
                  <span className="opt-val">HSLA</span>
                </div>
                <div id="option-bg"></div>
              </div>
            </div>
          </form>
        </div>
        <div className="flex flex-col justify-evenly content-center items-center">
          <button
            className={`tn_button tn_button_medium tn_button_primary ripple ripple ${
              isInputEmpty ? "tn_button_disabled" : ""
            }`}
            onClick={handleEncodeClick}
            disabled={isInputEmpty}
          >
            <div className="c-ripple js-ripple">
              <span className="c-ripple__circle"></span>
            </div>
            Convert
          </button>
        </div>
        <div className="tn_textarea_btn">
          <div className="form__group field">
            <textarea
              className="form__field form_field_slim form_field_color code readonly"
              placeholder=" "
              name="output"
              id="output"
              value={outputText}
              readOnly
            />
            <label htmlFor="output" className="form__label">
              {lastColorFormat.toUpperCase()}
            </label>
            <form className="field_drop_selection" id="lastColorDropdownForm">
              <div id="select-box">
                <input type="checkbox" id="options-view-button" />
                <div id="select-button" className="brd">
                  <div id="selected-value">
                    <span>Select Color</span>
                  </div>
                </div>
                <div id="options">
                  <div className="option">
                    <input
                      className="s-c top"
                      type="radio"
                      name="lastColorFormat"
                      value="hex"
                      checked={lastColorFormat === "hex"}
                      onChange={handleLastColorFormatChange}
                    />
                    <input
                      className="s-c bottom"
                      type="radio"
                      name="lastColorFormat"
                      value="Hex"
                      checked={lastColorFormat === "Hex"}
                      onChange={handleLastColorFormatChange}
                    />
                    <span className="label">Hex</span>
                    <span className="opt-val">Hex</span>
                  </div>
                  <div className="option">
                    <input
                      className="s-c top"
                      type="radio"
                      name="lastColorFormat"
                      value="rgb"
                      checked={lastColorFormat === "rgb"}
                      onChange={handleLastColorFormatChange}
                    />
                    <input
                      className="s-c bottom"
                      type="radio"
                      name="lastColorFormat"
                      value="RGB"
                      checked={lastColorFormat === "RGB"}
                      onChange={handleLastColorFormatChange}
                    />
                    <span className="label">RGB</span>
                    <span className="opt-val">RGB</span>
                  </div>
                  <div className="option">
                    <input
                      className="s-c top"
                      type="radio"
                      name="lastColorFormat"
                      value="rgba"
                      checked={lastColorFormat === "rgba"}
                      onChange={handleLastColorFormatChange}
                    />
                    <input
                      className="s-c bottom"
                      type="radio"
                      name="lastColorFormat"
                      value="RGB"
                      checked={lastColorFormat === "RGBA"}
                      onChange={handleLastColorFormatChange}
                    />
                    <span className="label">RGBA</span>
                    <span className="opt-val">RGBA</span>
                  </div>
                  <div className="option">
                    <input
                      className="s-c top"
                      type="radio"
                      name="lastColorFormat"
                      value="hsl"
                      checked={lastColorFormat === "hsl"}
                      onChange={handleLastColorFormatChange}
                    />
                    <input
                      className="s-c bottom"
                      type="radio"
                      name="lastColorFormat"
                      value="HSL"
                      checked={lastColorFormat === "HSL"}
                      onChange={handleLastColorFormatChange}
                    />
                    <span className="label">HSL</span>
                    <span className="opt-val">HSL</span>
                  </div>
                  <div className="option">
                    <input
                      className="s-c top"
                      type="radio"
                      name="lastColorFormat"
                      value="hsla"
                      checked={lastColorFormat === "hsla"}
                      onChange={handleLastColorFormatChange}
                    />
                    <input
                      className="s-c bottom"
                      type="radio"
                      name="lastColorFormat"
                      value="HSLA"
                      checked={lastColorFormat === "HSLA"}
                      onChange={handleLastColorFormatChange}
                    />
                    <span className="label">HSLA</span>
                    <span className="opt-val">HSLA</span>
                  </div>
                  <div id="option-bg"></div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div className="colorCard form__field form__field__med form__field__no__margin ">
          <div
            className="colorPane"
            style={{
              background: colorCodes.hex
                ? colorCodes.hex.startsWith("#")
                  ? colorCodes.hex
                  : `#${colorCodes.hex}`
                : undefined,
            }}
          >
            {!colorCodes.hex && (
              <div className="colorNotExist">
                <span>?</span>
              </div>
            )}
          </div>
          <div className="colorInfo">
            {!colorCodes.hex ? (
              <div>
                {
                  <div className="grid-container empty">
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                  </div>
                }
              </div>
            ) : (
              <div className="grid-container">
                <div>
                  <strong className="colorMeta">Hex</strong>
                </div>
                <div
                  className="colorMetaValue"
                  onClick={() => handleCopy(`#${colorCodes.hex}`)}
                >
                  {colorCodes.hex}
                </div>
                <div>
                  <strong className="colorMeta">RGBA</strong>
                </div>
                <div
                  className="colorMetaValue"
                  onClick={() => handleCopy(colorCodes.rgba)}
                >
                  {colorCodes.rgba}
                </div>
                <div>
                  <strong className="colorMeta">HSLA</strong>
                </div>
                <div
                  className="colorMetaValue"
                  onClick={() => handleCopy(colorCodes.hsla)}
                >
                  {colorCodes.hsla}
                </div>
                <div>
                  <strong className="colorMeta">Type</strong>
                </div>
                <div
                  className="colorMetaValue"
                  onClick={() => handleCopy(colorCodes.brightness)}
                >
                  {colorCodes.brightness}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
