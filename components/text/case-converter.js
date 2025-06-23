import { useState, useEffect } from "react";
import { toast } from "react-toastify";

export default function CodingTool({ id }) {
  const [inputText, setInputText] = useState("");
  const [voiceTypingEnabled, setVoiceTypingEnabled] = useState(false);

  const handleInputChange = (e) => setInputText(e.target.value);

  const handleCaseConversion = async (type) => {
    if (!inputText) {
      toast.warn("Input is empty!", { autoClose: 1000 });
      return;
    }

    try {
      const res = await fetch("/api/convert-case", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: inputText, type }),
      });

      const data = await res.json();
      if (res.ok) {
        setInputText(data.converted);
      } else {
        throw new Error(data.error);
      }
    } catch (err) {
      toast.error("Conversion failed.");
    }
  };

  const handleCopyOutput = () => {
    if (!inputText) {
      toast.warn("Output field is empty!", { autoClose: 1000 });
    } else {
      navigator.clipboard.writeText(inputText);
      toast.success("Text copied!", { autoClose: 500 });
    }
  };

  const handleClearOutput = () => {
    if (!inputText) {
      toast.warn("Nothing to clear!", { autoClose: 1000 });
    } else {
      setInputText("");
      toast.success("Cleared!", { autoClose: 500 });
    }
  };

  const handleToggleVoiceTyping = () => {
    setVoiceTypingEnabled((prev) => !prev);
  };

  useEffect(() => {
    let recognition;

    if (voiceTypingEnabled) {
      recognition = new window.webkitSpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;

      recognition.onresult = (e) => {
        const transcript = Array.from(e.results)
          .map((result) => result[0].transcript)
          .join("");
        setInputText(transcript);
      };

      recognition.onerror = (e) =>
        console.error("Speech error:", e.error);

      recognition.start();
    }

    return () => {
      recognition?.stop();
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
            text
          </label>
        </div>
      </div>

      <div className="flex flex-row justify-between">
        <div className="grid lg:grid-cols-3 gap-4">
          {["sentence", "upper", "lower", "title", "mixed", "inverse"].map(
            (type) => (
              <button
                key={type}
                onClick={() => handleCaseConversion(type)}
                className="tn_button tn_button_medium tn_button_bordered tn_button_round"
              >
                {type.charAt(0).toUpperCase() + type.slice(1)} Case
              </button>
            )
          )}
        </div>

        <div className="tn_button_group full-width">
          <button
            onClick={handleCopyOutput}
            className="tn_button tn_button_medium tn_button_bordered tn_button_round"
          >
            Copy
          </button>
          <button
            onClick={handleClearOutput}
            className="tn_button tn_button_medium tn_button_primary tn_button_round"
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
    </>
  );
}
