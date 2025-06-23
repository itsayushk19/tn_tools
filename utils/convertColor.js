// utils/convertColor.js

export default function convertColor(input) {
  const trim = (val) => val.trim().toUpperCase();
  const color = trim(input);

  const toHEX = (r, g, b) =>
    `#${[r, g, b].map(x => x.toString(16).padStart(2, '0')).join('')}`;

  const toHSL = (r, g, b) => {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;
    const d = max - min;

    if (d === 0) {
      h = s = 0;
    } else {
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = ((g - b) / d) + (g < b ? 6 : 0); break;
        case g: h = ((b - r) / d) + 2; break;
        case b: h = ((r - g) / d) + 4; break;
      }
      h *= 60;
    }

    return {
      HSL: `HSL(${Math.round(h)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`,
      HSLA: `HSLA(${Math.round(h)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%, 1)`
    };
  };

  const toCMYK = (r, g, b) => {
    if (r === 0 && g === 0 && b === 0) return "CMYK(0%, 0%, 0%, 100%)";
    const c = 1 - (r / 255),
          m = 1 - (g / 255),
          y = 1 - (b / 255);
    const k = Math.min(c, m, y);
    const divisor = (1 - k);
    return `CMYK(${Math.round((c - k) / divisor * 100)}%, ${Math.round((m - k) / divisor * 100)}%, ${Math.round((y - k) / divisor * 100)}%, ${Math.round(k * 100)}%)`;
  };

  const HSLtoRGB = (h, s, l) => {
    h /= 360; s /= 100; l /= 100;
    const hue2rgb = (p, q, t) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;

    const r = Math.round(hue2rgb(p, q, h + 1/3) * 255);
    const g = Math.round(hue2rgb(p, q, h) * 255);
    const b = Math.round(hue2rgb(p, q, h - 1/3) * 255);

    return { r, g, b };
  };

  const CMYKtoRGB = (c, m, y, k) => {
    const r = Math.round(255 * (1 - c / 100) * (1 - k / 100));
    const g = Math.round(255 * (1 - m / 100) * (1 - k / 100));
    const b = Math.round(255 * (1 - y / 100) * (1 - k / 100));
    return { r, g, b };
  };

  let r, g, b;

  // HEX
  const hexMatch = color.match(/^#?([A-F0-9]{6})$/i);
  if (hexMatch) {
    const hex = hexMatch[1];
    r = parseInt(hex.slice(0, 2), 16);
    g = parseInt(hex.slice(2, 4), 16);
    b = parseInt(hex.slice(4, 6), 16);
  }

  // RGB
  const rgbMatch = color.match(/^RGB\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/i);
  if (rgbMatch) {
    r = parseInt(rgbMatch[1]);
    g = parseInt(rgbMatch[2]);
    b = parseInt(rgbMatch[3]);
  }

  // RGBA
  const rgbaMatch = color.match(/^RGBA\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(0|1|0\.\d+)\s*\)$/i);
  if (rgbaMatch) {
    r = parseInt(rgbaMatch[1]);
    g = parseInt(rgbaMatch[2]);
    b = parseInt(rgbaMatch[3]);
  }

  // HSL
  const hslMatch = color.match(/^HSL\(\s*(\d{1,3})\s*,\s*(\d{1,3})%\s*,\s*(\d{1,3})%\s*\)$/i);
  if (hslMatch) {
    const h = parseInt(hslMatch[1]);
    const s = parseInt(hslMatch[2]);
    const l = parseInt(hslMatch[3]);
    ({ r, g, b } = HSLtoRGB(h, s, l));
  }

  // HSLA
  const hslaMatch = color.match(/^HSLA\(\s*(\d{1,3})\s*,\s*(\d{1,3})%\s*,\s*(\d{1,3})%\s*,\s*(0|1|0\.\d+)\s*\)$/i);
  if (hslaMatch) {
    const h = parseInt(hslaMatch[1]);
    const s = parseInt(hslaMatch[2]);
    const l = parseInt(hslaMatch[3]);
    ({ r, g, b } = HSLtoRGB(h, s, l));
  }

  // CMYK
  const cmykMatch = color.match(/^CMYK\(\s*(\d{1,3})%\s*,\s*(\d{1,3})%\s*,\s*(\d{1,3})%\s*,\s*(\d{1,3})%\s*\)$/i);
  if (cmykMatch) {
    const c = parseInt(cmykMatch[1]);
    const m = parseInt(cmykMatch[2]);
    const y = parseInt(cmykMatch[3]);
    const k = parseInt(cmykMatch[4]);
    ({ r, g, b } = CMYKtoRGB(c, m, y, k));
  }

  // Fallback if we couldn’t extract RGB
  if (typeof r !== "number" || typeof g !== "number" || typeof b !== "number") {
    return { error: "Invalid or unsupported color format." };
  }

  const HEX = toHEX(r, g, b);
  const RGB = `RGB(${r}, ${g}, ${b})`;
  const RGBA = `RGBA(${r}, ${g}, ${b}, 1)`;
  const { HSL, HSLA } = toHSL(r, g, b);
  const CMYK = toCMYK(r, g, b);

  return { HEX, RGB, RGBA, HSL, HSLA, CMYK };
}
