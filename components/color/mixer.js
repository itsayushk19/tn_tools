import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { saveAs } from "file-saver";
import CustomDropdown from "../elemental/dropDownSelection";
import colorDictionary from "../css/colors.json"

export default function ColorMixTool({ id }) {
  const [startColor, setStartColor] = useState("");
  const [endColor, setEndColor] = useState("");
  const [BGColor, setBGColor] = useState("");
  const [steps, setSteps] = useState(1);
  const [mixedColors, setMixedColors] = useState([]);
  const [isInputEmpty, setIsInputEmpty] = useState(true);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [firstColorFormat, setFirstColorFormat] = useState(`hex`);
  const [lastColorFormat, setLastColorFormat] = useState(`hex`);

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

  const exportColors = (format) => {
    if (mixedColors.length === 0) {
      toast.error("No colors to export!", options);
      return;
    }

    let convertedData;

    switch (format) {
      case "csv":
        convertedData = convertToCSV(mixedColors);
        saveAs(
          new Blob([convertedData], { type: "text/csv;charset=utf-8" }),
          "colors.csv"
        );
        break;
      case "xml":
        convertedData = convertToXML(mixedColors);
        saveAs(
          new Blob([convertedData], { type: "text/xml;charset=utf-8" }),
          "colors.xml"
        );
        break;
      case "json":
        convertedData = convertToJSON(mixedColors);
        saveAs(
          new Blob([convertedData], { type: "application/json;charset=utf-8" }),
          "colors.json"
        );
        break;
      case "text":
        convertedData = convertToText(mixedColors);
        saveAs(
          new Blob([convertedData], { type: "text/plain;charset=utf-8" }),
          "colors.txt"
        );
        break;
      case "excel":
        convertedData = convertToExcel(mixedColors);
        saveAs(convertedData, "colors.xlsx");
        break;
      default:
        toast.error("Invalid export format!", options);
        return;
    }

    toast.success(`Colors exported as ${format.toUpperCase()} successfully!`, {
      autoClose: 2000,
    });
  };

  const handleStartColorChange = (event) => {
    const color = event.target.value.trim();
    setStartColor(color);

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
          setStartColor(primaryColorData.light);
          return;
        } else if (lightOrDark === "dark" && primaryColorData.dark) {
          setStartColor(primaryColorData.dark);
          return;
        }
      }

      // If the light/dark variation is not available, fall back to using the entered color
      setStartColor(color);
      return;
    }

    // If no light/dark or invalid input, continue with existing logic
    setStartColor(color);

    // Check for primary color or variations (light/dark)
    if (colorParts.length >= 1) {
      const primaryColor = colorParts[0];
      const primaryColorData = colorDictionary[primaryColor];

      if (primaryColorData) {
        const lightOrDark = colorParts[1];

        if (lightOrDark === "light" && primaryColorData.light) {
          setStartColor(primaryColorData.light);
          return;
        } else if (lightOrDark === "dark" && primaryColorData.dark) {
          setStartColor(primaryColorData.dark);
          return;
        } else if (!lightOrDark) {
          // If no light/dark specified, set the hex color
          setStartColor(primaryColorData.hex);
          return;
        }
      }
    }

    if (isValidColor(color)) {
      const colorFormats = ["hex", "rgb", "rgba", "hsl", "hsla"];

      for (const format of colorFormats) {
        if (color.toLowerCase().startsWith(format)) {
          setFirstColorFormat(format);
          break;
        }
      }
    } else if (color.length === 6 && /^[A-Fa-f0-9]{6}$/.test(color)) {
      const formattedColor = "#" + color;
      setStartColor(formattedColor);
      setFirstColorFormat("hex");
    }
  };

  const handleEndColorChange = (event) => {
    const color = event.target.value;
    setEndColor(color);

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
          setEndColor(primaryColorData.light);
          return;
        } else if (lightOrDark === "dark" && primaryColorData.dark) {
          setEndColor(primaryColorData.dark);
          return;
        }
      }

      // If the light/dark variation is not available, fall back to using the entered color
      setEndColor(color);
      return;
    }

    // If no light/dark or invalid input, continue with existing logic
    setEndColor(color);

    // Check for primary color or variations (light/dark)
    if (colorParts.length >= 1) {
      const primaryColor = colorParts[0];
      const primaryColorData = colorDictionary[primaryColor];

      if (primaryColorData) {
        const lightOrDark = colorParts[1];

        if (lightOrDark === "light" && primaryColorData.light) {
          setEndColor(primaryColorData.light);
          return;
        } else if (lightOrDark === "dark" && primaryColorData.dark) {
          setEndColor(primaryColorData.dark);
          return;
        } else if (!lightOrDark) {
          // If no light/dark specified, set the hex color
          setEndColor(primaryColorData.hex);
          return;
        }
      }
    }

    if (isValidColor(color)) {
      const colorFormats = ["hex", "rgb", "rgba", "hsl", "hsla"];

      for (const format of colorFormats) {
        if (color.toLowerCase().startsWith(format)) {
          setLastColorFormat(format);
          break;
        }
      }
    } else if (color.length === 6 && /^[A-Fa-f0-9]{6}$/.test(color)) {
      const formattedColor = "#" + color;
      setEndColor(formattedColor);
      setLastColorFormat("hex");
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

  const handleStepsChange = (option) => {
    setSteps(option);
  };

  const mixColors = () => {
    const mixed = [];
    const start = parseColor(startColor);
    const end = parseColor(endColor);

    const stepSize = 1 / (steps + 1);
    for (let i = 0; i <= steps; i++) {
      const ratio = i * stepSize;
      const mixedColor = mix(start, end, ratio);
      const hexColor = rgbToHex(
        mixedColor.red,
        mixedColor.green,
        mixedColor.blue
      );
      const convertedColor = convertColor(hexColor);
      mixed.push(convertedColor);
    }

    setMixedColors(mixed);
  };

  const parseColor = (color) => {
    if (color.startsWith("#")) {
      const hex = color.substring(1);
      const red = parseInt(hex.substring(0, 2), 16);
      const green = parseInt(hex.substring(2, 4), 16);
      const blue = parseInt(hex.substring(4, 6), 16);
      return { red, green, blue };
    } else if (color.startsWith("rgb")) {
      const match = color.match(/(\d+),\s*(\d+),\s*(\d+)/);
      if (match) {
        const red = parseInt(match[1]);
        const green = parseInt(match[2]);
        const blue = parseInt(match[3]);
        return { red, green, blue };
      }
    }
    return { red: 0, green: 0, blue: 0 };
  };

  const mix = (start, end, ratio) => {
    const mixedColor = {
      red: Math.round(start.red * (1 - ratio) + end.red * ratio),
      green: Math.round(start.green * (1 - ratio) + end.green * ratio),
      blue: Math.round(start.blue * (1 - ratio) + end.blue * ratio),
    };
    return mixedColor;
  };

  const rgbToHex = (r, g, b) => {
    const componentToHex = (c) => {
      const hex = c.toString(16);
      return hex.length === 1 ? "0" + hex : hex;
    };

    return `#${componentToHex(r)}${componentToHex(g)}${componentToHex(b)}`;
  };

  const convertColor = (color) => {
    // Remove whitespace and convert to lowercase
    const trimmedColor = color.trim().toLowerCase();

    if (trimmedColor.startsWith("#")) {
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

  const handleMixClick = () => {
    if (isInputEmpty) {
      toast.error("Please enter start and end colors.", options);
      return;
    }
    setBGColor(startColor);
    mixColors();
  };

  const handleCopy = (color) => {
    navigator.clipboard
      .writeText(color)
      .then(() => {
        toast.success(`${color} copied!`, { autoClose: 1000 });
      })
      .catch((error) => {
        console.error("Copy failed:", error);
        toast.error("Copy failed!", { autoClose: 1000 });
      });
  };

  return (
    <>
      <div className="grid lg:grid-flow-col gap-4">
        <div className="form__group field">
          <div className="form__group field paletteField">
            <textarea
              className="form__field form_field_slim form_field_color "
              placeholder=" "
              name="startColor"
              id="startColor"
              required
              value={startColor}
              onChange={handleStartColorChange}
            />
            <div
              className="colorPalette"
              style={{ background: `${startColor}` }}
            ></div>
            <label htmlFor="startColor" className="form__label txt-upper">
              Start Color
            </label>
          </div>
        </div>
        <div className="form__group field">
          <div className="form__group field paletteField">
            <div
              className="colorPalette"
              style={{ background: `${endColor}` }}
            ></div>
            <textarea
              className="form__field form_field_slim form_field_color "
              placeholder=" "
              name="endColor"
              id="endColor"
              required
              value={endColor}
              onChange={handleEndColorChange}
            />
            <label htmlFor="endColor" className="form__label txt-upper">
              End Color
            </label>
          </div>
        </div>
        <div className="form__group field">
          <CustomDropdown
            options={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]} // Replace with your options array
            onSelect={handleStepsChange} // Pass the callback function to onSelect prop
            size="slim" // Replace with the desired size
            label="Select an option" // Replace with the desired label
            selectedOption={steps} // Replace with the desired
          />
        </div>
      </div>
      <div className="flex flex-col justify-evenly content-center items-center">
        <button
          className={`tn_button tn_button_medium tn_button_primary ripple ripple ${
            isInputEmpty ? "tn_button_disabled" : ""
          }`}
          onClick={handleMixClick}
          disabled={isInputEmpty}
        >
          <div className="c-ripple js-ripple">
            <span className="c-ripple__circle"></span>
          </div>
          Mix Colors
        </button>
      </div>
      <div
        className="grid lg:grid-cols-1 justify gap-4 mt-8"
        style={{ justifyItems: "center" }}
      >
        {mixedColors.map((color, index) => (
          <div
            className="colorCard form__field form__field__med form__field__no__margin "
            key={index}
          >
            <div
              className="colorPane"
              style={{
                background: `#${color.hex}`,
              }}
            ></div>
            <div className="colorInfo">
              <div className="grid-container">
                <div>
                  <strong style={{ fontWeight: "bold" }} className="colorMeta">
                    Color Card
                  </strong>
                </div>
                <div
                  className="colorMetaValue"
                  onClick={() => handleCopy(color.original)}
                >
                  {color.original}
                </div>
              </div>
              <div className="grid-container">
                <div>
                  <strong className="colorMeta">Hex</strong>
                </div>
                <div
                  className="colorMetaValue"
                  onClick={() => handleCopy(color.hex)}
                >
                  {color.hex}
                </div>
              </div>
              <div className="grid-container">
                <div>
                  <strong className="colorMeta">RGBA</strong>
                </div>
                <div
                  className="colorMetaValue"
                  onClick={() => handleCopy(color.rgba)}
                >
                  {color.rgba}
                </div>
              </div>
              <div className="grid-container">
                <div>
                  <strong className="colorMeta">HSLA</strong>
                </div>
                <div
                  className="colorMetaValue"
                  onClick={() => handleCopy(color.hsla)}
                >
                  {color.hsla}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
