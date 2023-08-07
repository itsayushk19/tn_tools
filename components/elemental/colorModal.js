import React, { useState, useEffect, useRef } from "react";
import css from "../../styles/colorModal.module.scss";
import { HexColorPicker, HexColorInput } from "react-colorful";
import docColorsJSON from "./colorModal/docColors.json";
import defaultColorsJSON from "./colorModal/defaultColors.json";

export default function ColorModal() {
  const [colors, setColors] = useState({
    docColor: "",
    brandkitColor: "",
    defaultColor: "",
  });
  const [docColors, setDocColors] = useState(docColorsJSON);
  const [brandkitColors, setBrandkitColors] = useState([]);
  const [colorPickerVisible, setColorPickerVisible] = useState(false);
  const [brandkitColorPickerVisible, setBrandkitColorPickerVisible] =
    useState(false);
  const colorPickerRef = useRef(null); // Ref for the color picker container
  const brandkitColorPickerRef = useRef(null); // Ref for the brandkit color picker container

  useEffect(() => {
    // Add event listener to handle clicks outside the color pickers
    const handleClickOutside = (event) => {
      if (
        (colorPickerVisible &&
          colorPickerRef.current &&
          !colorPickerRef.current.contains(event.target)) ||
        (brandkitColorPickerVisible &&
          brandkitColorPickerRef.current &&
          !brandkitColorPickerRef.current.contains(event.target))
      ) {
        if (colorPickerVisible) {
          toggleColorPicker("docColor");
        }
        if (brandkitColorPickerVisible) {
          toggleColorPicker("brandkitColor");
        }
      }
    };

    // Attach the event listener
    document.addEventListener("mousedown", handleClickOutside);

    // Clean up the event listener on component unmount
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [colorPickerVisible, brandkitColorPickerVisible]);

  const handleColorSelect = (color, type) => {
    setColors((prevColors) => ({ ...prevColors, [type]: color }));
    if (type === "brandkitColor") {
      toggleColorPicker("brandkitColor");
    } else if (type === "docColor") {
      toggleColorPicker("docColor");
    }
  };

  const handleColorChange = (color, type) => {
    setColors((prevColors) => ({ ...prevColors, [type]: color }));
    if (type === "brandkitColor") {
      const updatedColors = brandkitColors.map((c) =>
        c === colors.brandkitColor ? color : c
      );
      setBrandkitColors(updatedColors);

      // Save updated brandkitColors to localStorage
      localStorage.setItem("brandkit", JSON.stringify(updatedColors));
    } else if (type === "docColor") {
      const updatedColors = docColors.map((c) =>
        c === colors.docColor ? color : c
      );
      setDocColors(updatedColors);
    }
  };

  const toggleColorPicker = (type) => {
    if (type === "docColor") {
      setColorPickerVisible(!colorPickerVisible);
    } else if (type === "brandkitColor") {
      setBrandkitColorPickerVisible(!brandkitColorPickerVisible);
    }
  };

  useEffect(() => {
    // Retrieve brandkit colors from local storage
    const storedBrandkitColors = localStorage.getItem("brandkit");
    if (storedBrandkitColors) {
      setBrandkitColors(JSON.parse(storedBrandkitColors));
    }
  }, []);

  return (
    <div className={css.parent}>
      <div className={css.docColorParent}>
        <div className={css.headingP1}>
          <h2 className={css.heading}>Graph Colors</h2>
        </div>
        <div className={css.docColors}>
          <div
            className={`${css.docColorItem} ${css.rainbowBG} ${
              colors.docColor ? css.selected : ""
            }`}
            onClick={() => toggleColorPicker("docColor")}
          ></div>
          {docColors.map((color, index) => (
            <div
              key={index}
              className={`${css.docColorItem} ${
                colors.docColor === color ? css.selected : ""
              }`}
              onClick={() => handleColorSelect(color, "docColor")}
            >
              <div
                className={`${css.docColor} ${css.colorPallete}`}
                title={color}
                style={{
                  background: color,
                }}
              ></div>
            </div>
          ))}
        </div>
        {colorPickerVisible && (
          <div className={css.colorPickerPopup}>
            <div
              ref={colorPickerRef}
              className={`${css.colorPickerInner} responsiveColorPicker`}
            >
              <HexColorPicker
                className={css.colorPicker}
                color={colors.docColor}
                onChange={(color) => handleColorChange(color, "docColor")}
              />
              <HexColorInput
                className={css.colorInput}
                color={colors.docColor}
                onChange={(color) => handleColorChange(color, "docColor")}
              />
            </div>
          </div>
        )}
      </div>
      <div className={css.brandKitParent}>
        <div className={css.headingP1}>
          <h2 className={css.heading}>BrandKit</h2>
        </div>
        <div className={css.brandkitColors}>
          <div
            className={`${css.brandColorItem} ${css.rainbowBG}`}
            onClick={() => toggleColorPicker("brandkitColor")}
          ></div>
          {brandkitColors.map((color, index) => (
            <div
              key={index}
              className={`${css.brandColorItem} ${
                colors.brandkitColor === color ? css.selected : ""
              }`}
              onClick={() => handleColorSelect(color, "brandkitColor")}
            >
              <div
                className={`${css.brandColor} ${css.colorPallete}`}
                title={color}
                style={{
                  background: color,
                }}
              ></div>
            </div>
          ))}
        </div>
        {brandkitColorPickerVisible && (
          <div className={css.colorPickerPopup}>
            <div
              ref={brandkitColorPickerRef}
              className={`${css.colorPickerInner} responsiveColorPicker`}
            >
              <HexColorPicker
                className={css.colorPicker}
                color={colors.brandkitColor}
                onChange={(color) => handleColorChange(color, "brandkitColor")}
              />
              <HexColorInput
                className={css.colorInput}
                color={colors.brandkitColor}
                onChange={(color) => handleColorChange(color, "brandkitColor")}
              />
            </div>
          </div>
        )}
      </div>
      <div className={css.defaultColorParent}>
        <div className={css.headingP3}>
          <h2 className={css.heading}>Solid Colors</h2>
        </div>
        <div className={css.defaultColors}>
          {defaultColorsJSON.map((color, index) => (
            <div
              key={index}
              className={`${css.defaultColorItem} ${
                colors.defaultColor === color ? css.selected : ""
              }`}
              onClick={() => handleColorSelect(color, "defaultColor")}
            >
              <div
                className={`${css.defaultColor} ${css.colorPallete}`}
                title={color}
                style={{
                  background: color,
                }}
              ></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
