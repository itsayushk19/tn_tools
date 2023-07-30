import { useState } from "react";
import { toast } from "react-toastify";

export default function WhiteSpaceRemover() {
  const [inputText, setInputText] = useState("");

  const handleInputChange = (event) => {
    const text = event.target.value;
    setInputText(text);
  };

  const removeAndFormatWhiteSpace = () => {
    const formattedText = inputText
      .replace(/\s+/g, " ") // Replace multiple whitespaces with a single space
      .replace(/(\s+)([.,;:!])/g, "$2 "); // Add a space after punctuation if not present

    setInputText(formattedText);
    toast.success("Whitespace removed and text formatted successfully!");
  };

  return (
    <>
      <div className="grid lg:grid-flow-col">
        <div className="form__group field">
          <textarea
            className="form__field form_field_large"
            placeholder=" "
            name="input"
            id="input"
            value={inputText}
            onChange={handleInputChange}
            required
          />
          <label htmlFor="input" className="form__label txt-upper">
            {`text`}
          </label>
        </div>
      </div>
      <div className="flex flex-col justify-evenly content-center items-center">
        {inputText.trim() === "" ? (
          <button
            className="tn_button tn_button_medium tn_button_primary ripple ripple tn_button_disabled"
            onClick={removeAndFormatWhiteSpace}
            disabled
          >
            Remove Whitespace
          </button>
        ) : (
          <button
            className="tn_button tn_button_medium tn_button_primary ripple ripple tn_button_secondary"
            onClick={removeAndFormatWhiteSpace}
          >
            Remove Whitespace
          </button>
        )}
      </div>
    </>
  );
}
