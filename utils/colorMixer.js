// utils/colorMixer.js

function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        red: parseInt(result[1], 16),
        green: parseInt(result[2], 16),
        blue: parseInt(result[3], 16),
      }
    : null;
}

function rgbToHex(r, g, b) {
  const componentToHex = (c) =>
    c.toString(16).padStart(2, "0");
  return `#${componentToHex(r)}${componentToHex(g)}${componentToHex(b)}`;
}

function mixColors(startColor, endColor, steps) {
  const start = hexToRgb(startColor);
  const end = hexToRgb(endColor);
  const mixed = [];

  if (!start || !end) return [];

  const stepSize = 1 / (steps + 1);

  for (let i = 0; i <= steps; i++) {
    const ratio = i * stepSize;
    const r = Math.round(start.red * (1 - ratio) + end.red * ratio);
    const g = Math.round(start.green * (1 - ratio) + end.green * ratio);
    const b = Math.round(start.blue * (1 - ratio) + end.blue * ratio);

    mixed.push(rgbToHex(r, g, b));
  }

  return mixed;
}

export { mixColors };
