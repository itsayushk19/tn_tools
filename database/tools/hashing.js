import { useState } from 'react';
import { toast } from 'react-toastify';

export default function HashTool ({ id }) {
    const [inputText, setInputText] = useState('');
    const [outputText, setOutputText] = useState('');

    const toolId = id.split('-');
    const toolName = toolId[0];

    const handleInputChange = event => setInputText(event.target.value);

    const handleEncodeClick = async () => {
        if (inputText.trim() === '') {
            toast.error('Input field is empty', { autoClose: 2000 });
            return;
        }

        try {
            const response = await fetch('/api/hash', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    data: inputText,
                    algorithm: toolName,
                }),
            });
            const data = await response.json();
            setOutputText(data.hashedData);
            toast.success('Text encoded successfully!', { autoClose: 1500 });
        } catch (error) {
            console.error('Error:', error);
            toast.error('Error encoding text', { autoClose: 1500 });
        }
    };

    const handleDecodeClick = () => {
        // Prepare data to send to server
    };

    const handleCopyOutput = () => {
        if (!outputText) {
            toast.warn('Output field is empty!', { autoClose: 1000 });
        } else {
            navigator.clipboard.writeText(outputText);
            toast.success('Text Copied To Clipboard!', { autoClose: 500 });
        }
    };

    const handleClearOutput = () => {
        if (!outputText) {
            toast.warn('Output field is empty!', { autoClose: 1000 });
        } else {
            setOutputText('');
            toast.success('Output cleared!', { autoClose: 500 });
        }
    };

    return (
        <>
           <div className="grid lg:grid-flow-col">
        <div className="form__group field">
          <textarea
            className="form__field form_field_large code"
            placeholder=""
            name="input"
            id="input"
            required
            value={inputText}
            onChange={handleInputChange}
          />
          <label htmlFor="input" className="form__label txt-upper">
            <div>{toolName}</div>
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
            Generate
          </button>
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
          <div className="flex justify-stretch">
            <button
              className="tn_button tn_button_long tn_button_default ripple"
              id="copyBtn"
              onClick={handleCopyOutput}
            >
              Copy
            </button>
            <button
              className="tn_button tn_button_long tn_button_primary ripple"
              onClick={handleClearOutput}
            >
              Clear
            </button>
          </div>
        </div>
      </div>
        </>
    );
}