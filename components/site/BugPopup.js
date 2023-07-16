import { useState, useEffect } from "react";
import { useRouter } from "next/router";

export default function BugPopup( {popupVisible, setPopupVisible }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [selectedTool, setSelectedTool] = useState("");
  const [sendLink, setSendLink] = useState(true);

  const closePopup = () => {
    setPopupVisible(false);
  };

  const router = useRouter();

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleToolChange = (e) => {
    setSelectedTool(e.target.value);
  };

  const handleMessageChange = (e) => {
    setMessage(e.target.value);
  };

  const handleSendLinkChange = (e) => {
    setSendLink(e.target.checked);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const currentToolPath = sendLink ? window.location.href : "Not Provided";

    try {
      const response = await fetch("/api/sendMail", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Referer: window.location.href,
        },
        body: JSON.stringify({
          name,
          email,
          message,
          sendLink,
        }),
      });

      if (response.ok) {
        window.alert("Success")
        console.log("Email sent successfully");
      } else {
        window.alert("Failed")
        console.error("Error sending email");
      }
    } catch (error) {
      window.alert("Failed", error)
      console.error("Error sending email:", error);
    }

    // Reset form fields and close the popup
    setName("");
    setEmail("");
    setMessage("");
    setSendLink(true); // Reset checkbox to true
    closePopup()
  };
  return (
    <>
      {popupVisible && (
        <div className="popup">
          <div className="popup__content">
            <h2>Describe The Issue You Are Facing</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="name">Your Kind Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={name}
                  onChange={handleNameChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={email}
                  onChange={handleEmailChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="message">What would you like to say</label>
                <textarea
                  id="message"
                  name="message"
                  value={message}
                  required
                  onChange={handleMessageChange}
                ></textarea>
              </div>
              <div className="form-group">
                <div className="sub-group">
                  <label htmlFor="sendLink">
                    Are you currently on the tool where you&apos;re experiencing
                    the issue?
                  </label>
                  <input
                    type="checkbox"
                    id="sendLink"
                    name="sendLink"
                    checked={sendLink}
                    onChange={handleSendLinkChange}
                    className="custom-checkbox"
                  />
                </div>
              </div>
              <button className="popupSubmit" type="submit">
                Submit
              </button>
            </form>
          </div>
        </div>
      )}
      <style jsx>{`
        .popup {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          background-color: rgba(0, 0, 0, 0.6);
          z-index: 9999;
          opacity: 0;
          animation: ${popupVisible
            ? "fadeIn 0.3s forwards"
            : "fadeOut 0.3s forwards"};
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes fadeOut {
          from {
            opacity: 1;
          }
          to {
            opacity: 0;
          }
        }

        .popup__content {
          background-color: #cf5a56;
          padding: 2em;
          border-radius: 10px;
          box-shadow: 0 0 10px rgba(270, 90, 86, 0.8);
          max-width: 400px;
          width: 100%;
        }

        .close {
          position: absolute;
          top: 10px;
          right: 10px;
          font-size: 24px;
          cursor: pointer;
        }

        h2 {
          margin-top: 0;
          color: white;
        }

        form {
          display: flex;
          flex-direction: column;
        }

        .form-group {
          margin-bottom: 10px;
        }

        .sub-group {
          display: grid;
          grid-template-columns: auto auto;
          align-items: center;
        }

        label {
          color: white;
        }

        input,
        textarea {
          width: 100%;
          padding: 6px;
          border: 1px solid #ccc;
          border-radius: 10px;
          background-color: antiquewhite;
          color: black;
          font-size: 14px;
        }

        .popupSubmit {
          padding: 8px 16px;
          background-color: white;
          color: #cf5a56;
          border: none;
          border-radius: 10px;
          cursor: pointer;
          font-weight: bold;
        }

        .custom-checkbox {
          /* Hide the default checkbox */
          appearance: none;
          -webkit-appearance: none;
          -moz-appearance: none;
          outline: none;
          margin: 0;
          padding: 0;
          border: none;
          cursor: pointer;
          position: relative;
          width: 18px;
          height: 18px;
          background-color: transparent;
          border-radius: 3px;
          border: 2px solid #ccc;
        }

        .custom-checkbox:checked {
          /* Change the color of the checked checkbox */
          background-color: white;
          border-color: #cf5a56;
        }

        .custom-checkbox:checked:after {
          /* Show a checkmark icon for the checked state */
          content: "";
          position: absolute;
          top: 3px;
          left: 6px;
          width: 4px;
          height: 9px;
          border: solid #cf5a56;
          border-width: 0 2px 2px 0;
          transform: rotate(45deg);
        }
        .bug_button {
          background-color: #cf5a56;
          color: white;
          padding: 0.5em 1em;
          text-transform: uppercase;
          font-size: 14px;
        }
      `}</style>
    </>
  );
}
