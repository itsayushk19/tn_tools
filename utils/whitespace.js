export function cleanText(text, options) {
  let convertedText = text;

  // Case conversions
  if (options.sentence) {
    convertedText = convertedText.replace(/(^\w{1}|\.\s*\w{1})/g, (match) =>
      match.toUpperCase()
    );
  }
  if (options.upper) convertedText = convertedText.toUpperCase();
  if (options.lower) convertedText = convertedText.toLowerCase();
  if (options.title) {
    convertedText = convertedText
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }
  if (options.mixed) {
    convertedText = convertedText
      .split("")
      .map((char, i) => (i % 2 === 0 ? char.toLowerCase() : char.toUpperCase()))
      .join("");
  }
  if (options.inverse) {
    convertedText = convertedText
      .split("")
      .map((char) =>
        char === char.toLowerCase() ? char.toUpperCase() : char.toLowerCase()
      )
      .join("");
  }

  // Remove multiple spaces
  convertedText = convertedText.replace(/\s{2,}/g, " ");

  // Add space after punctuation
  convertedText = convertedText.replace(/[.,!?;:](?!\s)/g, (match) => `${match} `);

  return convertedText.trim();
}
