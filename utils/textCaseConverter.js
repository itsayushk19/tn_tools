export function convertCase(text, type) {
  switch (type) {
    case "sentence":
      return text.replace(/(^\w{1}|\.\s*\w{1})/g, (match) =>
        match.toUpperCase()
      );
    case "upper":
      return text.toUpperCase();
    case "lower":
      return text.toLowerCase();
    case "title":
      return text
        .toLowerCase()
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
    case "mixed":
      return text
        .split("")
        .map((char, index) =>
          index % 2 === 0 ? char.toLowerCase() : char.toUpperCase()
        )
        .join("");
    case "inverse":
      return text
        .split("")
        .map((char) =>
          char === char.toLowerCase()
            ? char.toUpperCase()
            : char.toLowerCase()
        )
        .join("");
    default:
      return text;
  }
}
