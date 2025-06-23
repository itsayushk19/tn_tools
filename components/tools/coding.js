import { useState } from "react"
import { toast } from "react-toastify"

export default function  CodingTool  ({ id })  {
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [savedPercentile, setSavedPercentile] = useState(0);
  const ToolID = id.split("-");
  const toolName = ToolID[0];
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

  const handleInputChange = (event) => setInputText(event.target.value);

  const handleEncodeClick = async () => {
    if (inputText.trim() === "") {
      toast.error(`Please Enter ${toolName} In The Input Field`, options);
      return;
    }
    try {
      const endpoint = ToolID.includes("minifier")
        ? "/api/minify"
        : "/api/beautify";
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code: inputText,
          type: toolName,
        }),
      });

      if (ToolID.includes("minifier")) {
        const successMessage = `Minified Successfuly`;
        const { minifiedCode, savedPercentile } = await response.json();
        toast.success(successMessage, options);
        setOutputText(minifiedCode);
        setSavedPercentile(savedPercentile);
      } else if (ToolID.includes("unminifier")) {
        const successMessage = `Beautified Successfuly`
        const {prettyCode, expandPercentile} = await response.json();
        setOutputText(prettyCode)
        toast.success(successMessage, options)
        setSavedPercentile(expandPercentile)
      }

      if (response.status == 200) {
      } else if (response.status !== 200) {
        try {
          throw new Error(`Oops! We Were Unable To Understand Your Code`);
        } catch (error) {
          toast.error(error.message, options);
        }
      }
    } catch (error) {
      toast.error(error.message, options);
    }
  };

  const handleCopyOutput = () => {
    if (!outputText) {
      toast.warn("Output field is empty!", { autoClose: 1000 });
    } else {
      navigator.clipboard.writeText(outputText);
      toast.success(`${toolName} Successfuly Copied!`, { autoClose: 500 });
    }
  };

  const handleClearOutput = () => {
    if (!outputText) {
      toast.warn("Output field is empty!", { autoClose: 1000 });
    } else {
      setOutputText("");
      toast.success("Output cleared!", { autoClose: 500 });
    }
  };

  return (
    <>
      <div className="grid lg:grid-flow-col">
        <div className="form__group field">
          <textarea
            className="form__field form_field_large code"
            placeholder="	"
            name="input"
            id="input"
            required
            value={inputText}
            onChange={handleInputChange}
          />
          <label htmlFor="input" className="form__label txt-upper">
            <div>Input {toolName}</div>
          </label>
        </div>
        <div className="flex flex-col justify-evenly content-center items-center">
          <button
            className="tn_button tn_button_medium tn_button_primary ripple ripple"
            onClick={handleEncodeClick}
          >
            <div className="c-ripple js-ripple">
              <span className="c-ripple__circle"></span>
            </div>
            {ToolID.includes("minifier") ? "Minify" : "Beautify"}
          </button>
      {ToolID.includes("minifier") ? (
    <div className="bg-red-200 text-red-600 text-center font-bold w-6/12 h-auto rounded border border-red-500">
      <div className="text-xl">{savedPercentile}%</div>
      <div className="text-s">Saved</div>
    </div>
  ) : (
    <div className="bg-green-200 text-green-600 text-center font-bold w-6/12 h-auto rounded border border-green-500">
      <div className="text-xl">{savedPercentile}%</div>
      <div className="text-sm">Expanded</div>
    </div>
  )}
        </div>
        <div className="tn_textarea_btn">
          <div className="form__group field">
            <textarea
              className="form__field form_field_large code readonly"
              placeholder="	"
              name="output"
              id="output"
              value={outputText}
              readOnly
            />
            <label htmlFor="output" className="form__label">
              Output
            </label>
          </div>
          <div className="tn_button_group full-width">
            <button
              className="tn_button tn_button_default ripple"
              id="copyBtn"
              onClick={handleCopyOutput}
            >
              Copy
            </button>
            <button
              className="tn_button tn_button_primary ripple"
              onClick={handleClearOutput}
            >
              Clear
            </button>
          </div>
        </div>
      </div>
    </>
  );
};