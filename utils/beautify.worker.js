import cssbeautify from 'cssbeautify'
const config = require('./beautify.config.json')
const UglifyJS = require("uglify-js");
const prettier = require("prettier");
const postcss = require('postcss');

// Add any other necessary imports and configurations for the beautification process
self.onmessage = (event) => {
  const { code, type } = event.data;
  
  try {
    const prettyCode = beautifyCode(code, type);
    self.postMessage({ prettyCode });
  } catch (error) {
    self.postMessage({ error: error.message });
  }
};

function beautifyCode(code, type) {
  try {
    if (type === 'css') {
      const prettyCSS = prettier.format(code, config[type]);
      if (prettyCSS.error) {
        throw new Error(`Can't Beautify CSS`);
      }
      return prettyCSS;
    } else if (type === 'js') {
      const prettyJS = prettier.format(code, config[type]);
      return prettyJS;
    } else if (type === 'html') {
      const prettyHTML = prettier.format(code, config[type]);
      return prettyHTML;
    } else if (type === 'typescript') {
      const prettyTS = prettier.format(code, config[type]);
      return prettyTS;
    } else if (type === 'json') {
      const prettyJSON = prettier.format(code, config[type]);
      return prettyJSON;
    } else if (type === 'markdown') {
      const prettyMD = prettier.format(code, config[type]);
      return prettyMD;
    }
  } catch (err) {
    throw new Error(err.message);
  }
}
