import htmlMinifier from "html-minifier";
import uglifycss from "uglifycss";
const config = require("./minify.config.json");
const UglifyJS = require("uglify-js");

export default function minifyCode(code, type) {
  if (!config) {
    throw new Error(`Failed To Fetch The Configurations`);
  }

  const options = config[type];

  if (!code || !type) {
    throw new Error(
      `One or more required parameters are missing from the request (Code and or the Type)`
    );
  }

  try {
    if (type === "html") {
      return htmlMinifier.minify(code, options);
    } else if (type === "css") {
      return uglifycss.processString(code, options);
    } else if (type === "js") {
      const miniJS = UglifyJS.minify(code, options);
      if (miniJS.error) {
        throw new Error(`Error Minifying JS Code: ${miniJS.error.message}`);
      }
      return miniJS.code;
    } else {
      throw new Error(`Unsupported code type: ${type}`);
    }
  } catch (err) {
    throw new Error(err.message);
  }
}
