import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import CustomDropdown from "../elemental/dropDownSelection";
import colorDictionary from "../css/colors.json";

export default function CodingTool({ id }) {
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [borderColor, setBorderColor] = useState("");
  const ToolID = id.split("-");
  const [firstColorFormat, setFirstColorFormat] = useState(`HEX`);
  const [lastColorFormat, setLastColorFormat] = useState(`RGB`);
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
    // Swap the values of firstColorFormat and lastColorFormat
    const tempFormat = firstColorFormat;
    setFirstColorFormat(lastColorFormat);
    setLastColorFormat(tempFormat);
  };

  const handleFirstColorFormatChange = (option) => {
    const selectedFormat = option;

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

  const handleLastColorFormatChange = (option) => {
    const selectedFormat = option;

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
    const color = event.target.value.trim().toUpperCase();

    setInputText(color);
    setBorderColor(isValidColor(color) ? color : "");

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
          setInputText(primaryColorData.light);
          return;
        } else if (lightOrDark === "dark" && primaryColorData.dark) {
          setInputText(primaryColorData.dark);
          return;
        }
      }

      // If the light/dark variation is not available, fall back to using the entered color
      setInputText(color);
      return;
    }

    // If no light/dark or invalid input, continue with existing logic
    setInputText(color);

    // Check for primary color or variations (light/dark)
    if (colorParts.length >= 1) {
      const primaryColor = colorParts[0];
      const primaryColorData = colorDictionary[primaryColor];

      if (primaryColorData) {
        const lightOrDark = colorParts[1];

        if (lightOrDark === "light" && primaryColorData.light) {
          setInputText(primaryColorData.light);
          return;
        } else if (lightOrDark === "dark" && primaryColorData.dark) {
          setInputText(primaryColorData.dark);
          return;
        } else if (!lightOrDark) {
          // If no light/dark specified, set the HEX color
          setInputText(primaryColorData.HEX);
          return;
        }
      }
    }

    if (isValidColor(color)) {
      // Get the first color format that matches the entered color
      const colorFormats = ["HEX", "RGB", "RGBA", "HSL", "HSLA"];

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
      setFirstColorFormat("HEX");
    }
  };

  const isValidColor = (color) => {
    // HEX color validation (e.g., #FFF, #FFFFFF)
    if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(color)) {
      return true;
    }

    // RGB/RGBA color validation (e.g., RGB(255, 255, 255), RGBA(255, 255, 255, 0.5))
    if (
      /^RGBA?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*(,\s*\d+(\.\d+)?)?\s*\)$/.test(
        color
      )
    ) {
      return true;
    }

    // HSL/HSLA color validation (e.g., hsl(0, 100%, 50%), HSLA(0, 100%, 50%, 0.5))
    if (
      /^HSLA?\(\s*(\d{1,3})\s*,\s*(\d{1,3})%\s*,\s*(\d{1,3})%\s*(,\s*\d+(\.\d+)?)?\s*\)$/.test(
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

    // Function to convert RGB to HEX
    const RGBToHEX = (red, green, blue) => {
      const HEXRed = red.toString(16).padStart(2, "0");
      const HEXGreen = green.toString(16).padStart(2, "0");
      const HEXBlue = blue.toString(16).padStart(2, "0");
      return `#${HEXRed}${HEXGreen}${HEXBlue}`;
    };

    // Function to convert RGB to HSL
    const RGBToHSL = (red, green, blue) => {
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

      return { hue, saturation, lightness };
    };

    // CMYK color
    if (
      /^CMYK\(\s*(\d{1,3})%\s*,\s*(\d{1,3})%\s*,\s*(\d{1,3})%\s*,\s*(\d{1,3})%\s*\)$/i.test(
        trimmedColor
      )
    ) {
      const CMYKMatch = trimmedColor.match(
        /^CMYK\(\s*(\d{1,3})%\s*,\s*(\d{1,3})%\s*,\s*(\d{1,3})%\s*,\s*(\d{1,3})%\s*\)$/i
      );

      const cyan = parseInt(CMYKMatch[1], 10);
      const magenta = parseInt(CMYKMatch[2], 10);
      const yellow = parseInt(CMYKMatch[3], 10);
      const black = parseInt(CMYKMatch[4], 10);

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

      const HEX = RGBToHEX(red, green, blue);
      const RGB = `RGB(${red}, ${green}, ${blue})`;
      const RGBA = `RGBA(${red}, ${green}, ${blue}, 1)`;
      const HSL = `HSL(${RGBToHSL(red, green, blue).hue}, ${
        RGBToHSL(red, green, blue).saturation
      }%, ${RGBToHSL(red, green, blue).lightness}%)`;
      const HSLA = `HSLA(${RGBToHSL(red, green, blue).hue}, ${
        RGBToHSL(red, green, blue).saturation
      }%, ${RGBToHSL(red, green, blue).lightness}%, 1)`;

      return { HEX, RGB, RGBA, HSL, HSLA, CMYK: color };
    }

    // HEX color
    else if (trimmedColor.startsWith("#")) {
      const HEX = trimmedColor.replace("#", "");
      if (!/^[0-9A-Fa-f]{6}$/.test(HEX)) {
        // Invalid HEX color format
        return { error: "Invalid HEX color format" };
      }

      const red = parseInt(HEX.substr(0, 2), 16);
      const green = parseInt(HEX.substr(2, 2), 16);
      const blue = parseInt(HEX.substr(4, 2), 16);

      // Convert HEX to CMYK
      const normalizedRed = red / 255;
      const normalizedGreen = green / 255;
      const normalizedBlue = blue / 255;
      const black = Math.min(
        1 - normalizedRed,
        1 - normalizedGreen,
        1 - normalizedBlue
      );
      const cyan = (1 - normalizedRed - black) / (1 - black);
      const magenta = (1 - normalizedGreen - black) / (1 - black);
      const yellow = (1 - normalizedBlue - black) / (1 - black);

      const CMYK = `CMYK(${Math.round(cyan * 100)}%, ${Math.round(
        magenta * 100
      )}%, ${Math.round(yellow * 100)}%, ${Math.round(black * 100)}%)`;

      const RGB = `RGB(${red}, ${green}, ${blue})`;
      const RGBA = `RGBA(${red}, ${green}, ${blue}, 1)`;
      const HSL = `HSL(${RGBToHSL(red, green, blue).hue}, ${
        RGBToHSL(red, green, blue).saturation
      }%, ${RGBToHSL(red, green, blue).lightness}%)`;
      const HSLA = `HSLA(${RGBToHSL(red, green, blue).hue}, ${
        RGBToHSL(red, green, blue).saturation
      }%, ${RGBToHSL(red, green, blue).lightness}%, 1)`;

      return { HEX, RGB, RGBA, HSL, HSLA, CMYK };
    }

    // RGB color
    else if (trimmedColor.startsWith("RGB")) {
      const RGBMatch = trimmedColor.match(
        /RGB\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/i
      );
      if (!RGBMatch) {
        // Invalid RGB color format
        return { error: "Invalid RGB color format" };
      }
      const red = parseInt(RGBMatch[1], 10);
      const green = parseInt(RGBMatch[2], 10);
      const blue = parseInt(RGBMatch[3], 10);

      const RGBToCMYK = (red, green, blue) => {
        const normalizedRed = red / 255;
        const normalizedGreen = green / 255;
        const normalizedBlue = blue / 255;
        const black = Math.min(
          1 - normalizedRed,
          1 - normalizedGreen,
          1 - normalizedBlue
        );
        const cyan = (1 - normalizedRed - black) / (1 - black);
        const magenta = (1 - normalizedGreen - black) / (1 - black);
        const yellow = (1 - normalizedBlue - black) / (1 - black);

        return `CMYK(${Math.round(cyan * 100)}%, ${Math.round(
          magenta * 100
        )}%, ${Math.round(yellow * 100)}%, ${Math.round(black * 100)}%)`;
      };

      const HEX = RGBToHEX(red, green, blue);
      const HSL = RGBToHSL(red, green, blue); // Removed conversion to HSL string here
      const RGBA = `RGBA(${red}, ${green}, ${blue}, 1)`;
      const HSLA = `HSLA(${HSL.hue}, ${HSL.saturation}%, ${HSL.lightness}%, 1)`;
      const CMYK = RGBToCMYK(red, green, blue); // Added CMYK conversion function here

      return { HEX, RGB, RGBA, HSL, HSLA, CMYK };
    }

    // HSL color
    else if (trimmedColor.startsWith("HSL")) {
      const HSLMatch = trimmedColor.match(
        /HSL\(\s*(\d+)\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*\)/i
      );
      if (!HSLMatch) {
        // Invalid HSL color format
        return { error: "Invalid HSL color format" };
      }

      const hue = parseInt(HSLMatch[1], 10);
      const saturation = parseInt(HSLMatch[2], 10);
      const lightness = parseInt(HSLMatch[3], 10);

      if (
        hue < 0 ||
        hue > 360 ||
        saturation < 0 ||
        saturation > 100 ||
        lightness < 0 ||
        lightness > 100
      ) {
        // Invalid HSL values
        return { error: "Invalid HSL values" };
      }

      // Convert HSL to RGB
      const normalizedHue = hue / 360;
      const normalizedSaturation = saturation / 100;
      const normalizedLightness = lightness / 100;

      let red, green, blue;
      if (normalizedSaturation === 0) {
        const RGBValue = Math.round(normalizedLightness * 255);
        red = RGBValue;
        green = RGBValue;
        blue = RGBValue;
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

        red = Math.round(hueToRGB(normalizedHue + 1 / 3) * 255);
        green = Math.round(hueToRGB(normalizedHue) * 255);
        blue = Math.round(hueToRGB(normalizedHue - 1 / 3) * 255);
      }

      const HEX = RGBToHEX(red, green, blue);
      const RGB = `RGB(${red}, ${green}, ${blue})`;
      const RGBA = `RGBA(${red}, ${green}, ${blue}, 1)`;

      return { HEX, RGB, RGBA, HSL, HSLA };
    }

    // If the color cannot be detected or converted, return an error
    return { error: "Invalid color format" };
  };

  const handleEncodeClick = () => {
    if (inputText.trim() === "") {
      toast.error(`Please Enter ${firstColor} In The Input Field`, options);
      return;
    }

    const convertedColor = convertColor(inputText);
    const brightness = getColorBrightness(convertedColor.HEX);

    setColorCodes({
      HEX: convertedColor.HEX,
      RGB: convertedColor.RGB,
      RGBA: convertedColor.RGBA,
      HSL: convertedColor.HSL,
      HSLA: convertedColor.HSLA,
      CMYK: convertedColor.CMYK,
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

  const getColorBrightness = (HEXColor) => {
    if (!HEXColor) {
      return ""; // Return empty string if color code is not available
    }

    // Remove '#' from the HEX color
    const HEX = HEXColor.substring(1);

    // Convert the HEX color to RGB
    const red = parseInt(HEX.substring(0, 2), 16);
    const green = parseInt(HEX.substring(2, 4), 16);
    const blue = parseInt(HEX.substring(4, 6), 16);

    // Calculate the brightness using the YIQ formula
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
              name="firstColor"
              id="firstColor"
              required
              value={inputText}
              onChange={handleInputChange}
            />
            <div
              className="colorPalette"
              style={{ background: `${inputText}` }}
            ></div>
            <label htmlFor="BG" className="form__label txt-upper">
              Background Color
            </label>
          </div>
          <div id="firstColorDropdownForm" className="">
            <CustomDropdown
              options={["HEX", "RGB", "HSL", "RGBA", "HSLA", "CMYK"]}
              onSelect={handleFirstColorFormatChange}
              size="slim"
              label="Label"
              selectedOption={firstColorFormat}
            />
          </div>
        </div>
        <div className="flex flex-col justify-evenly content-center items-center">
          <button
            className={`tn_button tn_button_medium tn_button_primary tn_button_round ripple ripple ${
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
          <button onClick={handleSwitchClick} className="tn_button tn_button_medium tn_button_default tn_button_round">Switch</button>
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
            <div id="lastColorDropdownForm" className="">
              <CustomDropdown
                options={["HEX", "RGB", "HSL", "RGBA", "HSLA", "CMYK"]}
                onSelect={handleLastColorFormatChange}
                size="slim"
                label="Label"
                selectedOption={lastColorFormat}
              />
            </div>
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
              background: colorCodes.HEX
                ? colorCodes.HEX.startsWith("#")
                  ? colorCodes.HEX
                  : `#${colorCodes.HEX}`
                : undefined,
            }}
          >
            {!colorCodes.HEX && (
              <div className="colorNotExist">
                <span>?</span>
              </div>
            )}
          </div>
          <div className="colorInfo">
            {!colorCodes.HEX ? (
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
                  <strong className="colorMeta">HEX</strong>
                </div>
                <div
                  className="colorMetaValue"
                  onClick={() => handleCopy(`#${colorCodes.HEX}`)}
                >
                  {colorCodes.HEX}
                </div>
                <div>
                  <strong className="colorMeta">RGBA</strong>
                </div>
                <div
                  className="colorMetaValue"
                  onClick={() => handleCopy(colorCodes.RGBA)}
                >
                  {colorCodes.RGBA}
                </div>
                <div>
                  <strong className="colorMeta">HSLA</strong>
                </div>
                <div
                  className="colorMetaValue"
                  onClick={() => handleCopy(colorCodes.HSLA)}
                >
                  {colorCodes.HSLA}
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
