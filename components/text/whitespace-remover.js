import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";

export default function WhiteSpaceRemover() {
  const [inputText, setInputText] = useState("");
  const [voiceTypingEnabled, setVoiceTypingEnabled] = useState(false);
  const [conversionOptions, setConversionOptions] = useState({
    sentence: false,
    upper: false,
    lower: false,
    title: false,
    mixed: false,
    inverse: false,
  });

  const handleInputChange = (event) => {
    const text = event.target.value;
    setInputText(text);
  };

  const removeExtraWhitespace = (text) => {
    // Remove more than one whitespace between words
    const cleanedText = text.replace(/\s{2,}/g, " ");

    // Add one whitespace after punctuation signs if not present already
    const punctuations = /[.,!?;:]/g;
    const textWithWhitespaceAfterPunctuation = cleanedText.replace(
      punctuations,
      (match) => `${match} `
    );

    return textWithWhitespaceAfterPunctuation;
  };

  const handleRemoveWhitespaceClick = () => {
    // Apply all selected case conversions before removing whitespace
    let convertedText = inputText;
    for (const option in conversionOptions) {
      if (conversionOptions[option]) {
        convertedText = handleCaseConversion(option, convertedText);
      }
    }

    // Remove whitespace
    const cleanedText = removeExtraWhitespace(convertedText);
    setInputText(cleanedText);

    toast.success("Whitespace removed successfully!", {
      position: "top-center",
    });
  };

  const handleCaseConversion = (conversionType, text) => {
    let convertedText = "";

    switch (conversionType) {
      case "sentence":
        convertedText = text.replace(/(^\w{1}|\.\s*\w{1})/g, (match) =>
          match.toUpperCase()
        );
        break;
      case "upper":
        convertedText = text.toUpperCase();
        break;
      case "lower":
        convertedText = text.toLowerCase();
        break;
      case "title":
        convertedText = text
          .toLowerCase()
          .split(" ")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ");
        break;
      case "mixed":
        convertedText = text
          .split("")
          .map((char, index) => {
            return index % 2 === 0 ? char.toLowerCase() : char.toUpperCase();
          })
          .join("");
        break;
      case "inverse":
        convertedText = text
          .split("")
          .map((char) => {
            return char === char.toLowerCase()
              ? char.toUpperCase()
              : char.toLowerCase();
          })
          .join("");
        break;
      default:
        break;
    }

    return convertedText;
  };

  const handleCopyOutput = () => {
    if (!inputText) {
      toast.warn("Output field is empty!", { autoClose: 1000 });
    } else {
      navigator.clipboard.writeText(inputText);
      toast.success(`Your Text Successfully Copied!`, { autoClose: 500 });
    }
  };

  const handleClearOutput = () => {
    if (!inputText) {
      toast.warn("Output field is empty!", { autoClose: 1000 });
    } else {
      setInputText("");
      toast.success("Output cleared!", { autoClose: 500 });
    }
  };

  const handleToggleVoiceTyping = () => {
    setVoiceTypingEnabled(!voiceTypingEnabled);
  };

  useEffect(() => {
    let recognition;

    const startSpeechRecognition = () => {
      recognition = new window.webkitSpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;

      recognition.onstart = () => {
        console.log("Speech recognition started");
      };

      recognition.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map((result) => result[0].transcript)
          .join("");

        setInputText(transcript);
      };

      recognition.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
      };

      recognition.onend = () => {
        console.log("Speech recognition ended");
      };

      recognition.start();
    };

    if (voiceTypingEnabled) {
      startSpeechRecognition();
    } else {
      if (recognition) {
        recognition.stop();
      }
    }

    return () => {
      if (recognition) {
        recognition.stop();
      }
    };
  }, [voiceTypingEnabled]);

  const buttonDisabled = inputText.length === 0;

  const handleToggleConversionOption = (option) => {
    // Block conflicting combinations
    const updatedOptions = { ...conversionOptions };
    switch (option) {
      case "upper":
        updatedOptions.lower = false;
        updatedOptions.mixed = false;
        updatedOptions.inverse = false;
        updatedOptions.sentence = false;
        updatedOptions.title = false;
        break;
      case "lower":
        updatedOptions.upper = false;
        updatedOptions.mixed = false;
        updatedOptions.inverse = false;
        updatedOptions.title = false;
        updatedOptions.sentence = false;
        break;
      case "mixed":
        updatedOptions.upper = false;
        updatedOptions.lower = false;
        updatedOptions.title = false;
        updatedOptions.sentence = false;
        updatedOptions.inverse = false;
        updatedOptions.mixed = false;
        break;
      case "inverse":
        updatedOptions.upper = false;
        updatedOptions.lower = false;
        updatedOptions.title = false;
        updatedOptions.sentence = false;
        updatedOptions.mixed = false;

      case "title":
        updatedOptions.upper = false;
        updatedOptions.lower = false;
        updatedOptions.mixed = false;
        updatedOptions.inverse = false;
        break;
      case "sentence":
        updatedOptions.upper = false;
        updatedOptions.lower = false;
        updatedOptions.mixed = false;
        updatedOptions.inverse = false;
      default:
        break;
    }
    updatedOptions[option] = !conversionOptions[option];
    setConversionOptions(updatedOptions);
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
      <div className="grid lg:grid-cols-2 gap-10">
        <div className="grid lg:grid-cols-3 gap-4">
          <button
            onClick={() => handleToggleConversionOption("sentence")}
            className={`tn_button tn_button_medium tn_button_bordered tn_button_round ${
              conversionOptions.sentence
                ? "tn_button_primary"
                : "tn_button_default"
            }`}
          >
            Sentence Case
          </button>
          <button
            onClick={() => handleToggleConversionOption("upper")}
            className={`tn_button tn_button_medium tn_button_bordered tn_button_round ${
              conversionOptions.upper
                ? "tn_button_primary"
                : "tn_button_default"
            }`}
          >
            Upper Case
          </button>
          <button
            onClick={() => handleToggleConversionOption("lower")}
            className={`tn_button tn_button_medium tn_button_bordered tn_button_round ${
              conversionOptions.lower
                ? "tn_button_primary"
                : "tn_button_default"
            }`}
          >
            Lower Case
          </button>
          <button
            onClick={() => handleToggleConversionOption("title")}
            className={`tn_button tn_button_medium tn_button_bordered tn_button_round ${
              conversionOptions.title
                ? "tn_button_primary"
                : "tn_button_default"
            }`}
          >
            Title Case
          </button>
          <button
            onClick={() => handleToggleConversionOption("mixed")}
            className={`tn_button tn_button_medium tn_button_bordered tn_button_round ${
              conversionOptions.mixed
                ? "tn_button_primary"
                : "tn_button_default"
            }`}
          >
            Mixed Case
          </button>
          <button
            onClick={() => handleToggleConversionOption("inverse")}
            className={`tn_button tn_button_medium tn_button_bordered tn_button_round ${
              conversionOptions.inverse
                ? "tn_button_primary"
                : "tn_button_default"
            }`}
          >
            Inverse Case
          </button>
        </div>
        <div className="grid lg:grid-cols-2 gap-5">
          <div className="grid gap-5">
            <button
              onClick={handleToggleVoiceTyping}
              className={`tn_button tn_button_medium ${
                voiceTypingEnabled ? "tn_button_primary" : ""
              }`}
            >
              {voiceTypingEnabled
                ? "Disable Voice Typing"
                : "Enable Voice Typing"}
            </button>
            <button
              className={`tn_button tn_button_medium tn_button_primary ripple ${
                buttonDisabled ? "tn_button_disabled" : ""
              }`}
              onClick={handleRemoveWhitespaceClick}
              disabled={buttonDisabled}
            >
              Remove Whitespace
            </button>
          </div>
          <div className="tn_button_group grid gap-5">
            <button
              onClick={handleCopyOutput}
              className={`tn_button tn_button_medium tn_button_bordered`}
            >
              Copy
            </button>
            <button
              onClick={handleClearOutput}
              className={`tn_button tn_button_medium tn_button_primary`}
            >
              Reset
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
