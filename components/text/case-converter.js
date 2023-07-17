import { useState, useEffect } from "react";
import { toast } from "react-toastify";

export default function CodingTool({ id }) {
  const [inputText, setInputText] = useState("");
  const [voiceTypingEnabled, setVoiceTypingEnabled] = useState(false);
  const ToolID = id.split("-");

  const handleInputChange = (event) => {
    setInputText(event.target.value);
  };

  const handleCaseConversion = (conversionType) => {
    let convertedText = "";

    switch (conversionType) {
      case "sentence":
        convertedText = inputText.replace(/(^\w{1}|\.\s*\w{1})/g, (match) =>
          match.toUpperCase()
        );
        break;
      case "upper":
        convertedText = inputText.toUpperCase();
        break;
      case "lower":
        convertedText = inputText.toLowerCase();
        break;
      case "title":
        convertedText = inputText
          .toLowerCase()
          .split(" ")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ");
        break;
      case "mixed":
        convertedText = inputText
          .split("")
          .map((char, index) => {
            return index % 2 === 0 ? char.toLowerCase() : char.toUpperCase();
          })
          .join("");
        break;
      case "inverse":
        convertedText = inputText
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

    setInputText(convertedText);
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
      <div className="flex flex-row justify-between">
        <div className="grid lg:grid-cols-3 gap-4">
          <button
            onClick={() => handleCaseConversion("sentence")}
            className={`tn_button tn_button_medium tn_button_bordered tn_button_round`}
          >
            Sentence Case
          </button>
          <button
            onClick={() => handleCaseConversion("upper")}
            className={`tn_button tn_button_medium tn_button_bordered tn_button_round`}
          >
            Upper Case
          </button>
          <button
            onClick={() => handleCaseConversion("lower")}
            className={`tn_button tn_button_medium tn_button_bordered tn_button_round`}
          >
            Lower Case
          </button>
          <button
            onClick={() => handleCaseConversion("title")}
            className={`tn_button tn_button_medium tn_button_bordered tn_button_round`}
          >
            Title Case
          </button>
          <button
            onClick={() => handleCaseConversion("mixed")}
            className={`tn_button tn_button_medium tn_button_bordered tn_button_round`}
          >
            Mixed Case
          </button>
          <button
            onClick={() => handleCaseConversion("inverse")}
            className={`tn_button tn_button_medium tn_button_bordered tn_button_round`}
          >
            Inverse Case
          </button>
        </div>
        <div>
          <div className="tn_button_group full-width">
            <button
              onClick={handleCopyOutput}
              className={`tn_button tn_button_medium tn_button_bordered tn_button_round`}
            >
              Copy
            </button>
            <button
              onClick={handleClearOutput}
              className={`tn_button tn_button_medium  tn_button_primary tn_button_round`}
            >
              Reset
            </button>
            <button
              onClick={handleToggleVoiceTyping}
              className={`tn_button tn_button_medium tn_button_round ${
                voiceTypingEnabled ? "tn_button_primary" : ""
              }`}
            >
              {voiceTypingEnabled ? "Disable Voice Typing" : "Enable Voice Typing"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
