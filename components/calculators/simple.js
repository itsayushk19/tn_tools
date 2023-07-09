import React, { useState } from "react";

export default function SimpleCalculator() {
  const [operation, setOperation] = useState(""); // State to store the current operation
  const [typedValue, setTypedValue] = useState(""); // State to store the typed value
  const [showHistory, setShowHistory] = useState(false);
  const [history, setHistory] = useState([]);

  // Function to handle button click events
  const handleButtonClick = (value) => {
    if (value === "C") {
      // Clear the operation and typed value
      setOperation("");
      setTypedValue("");
    } else if (value === "=") {
      // Perform the calculation
      try {
        const result = eval(operation);
        setOperation(`${operation} =`);
        setTypedValue(result.toString());
        // Add the current operation to the history array
        setHistory((prevHistory) => [...prevHistory, operation]);
      } catch (error) {
        // Handle any errors during evaluation
        console.error("Error: ", error);
      }
    } else if (value === "<") {
      // Remove the last character from the typed value and operation
      setTypedValue((prevValue) => prevValue.slice(0, -1));
      setOperation((prevValue) => prevValue.slice(0, -1));
    } else if (value === "checkHistory") {
      // Show or hide the history div based on the current state
      setShowHistory(!showHistory);
    } else if (value === "sqr") {
      const squaredValue = Math.pow(parseFloat(typedValue), 2);
      setTypedValue(squaredValue.toString());
      const operationWithSquare = `sqr(${typedValue}) = ${squaredValue.toString()}`;
      setOperation(operationWithSquare);
      // Add the squared operation to the history array
      setHistory((prevHistory) => [...prevHistory, operationWithSquare]);
    } else {
      // Append the clicked button value to the typed value and operation
      setTypedValue((prevValue) => prevValue + value);
      setOperation((prevValue) => prevValue + value);
    }
  };  

  return (
    <>
      <div className="container">
        <div className="calc-body">
          <div className="calc-screen">
            <button onClick={() => handleButtonClick("checkHistory")}>
              <i className="fas fa-history checkHistory"></i>
            </button>
            <div className={`calc-operation ${showHistory ? "expanded" : ""}`}>
              {showHistory && history.length > 0 ? (
                <div className="history">
                  {history.map((item, index) => (
                    <div key={index}>{item}</div>
                  ))}
                </div>
              ) : (
                showHistory && <div className="no-history">No history</div>
              )}
              {operation}
            </div>
            <div className="calc-typed">
              {typedValue}
              <span className="blink-me">_</span>
            </div>
          </div>
          <div className="calc-button-row">
            <div className="button c" onClick={() => handleButtonClick("C")}>
              C
            </div>
            <div className="button l" onClick={() => handleButtonClick("sqr")}>
              x²
            </div>
            <div className="button l" onClick={() => handleButtonClick("%")}>
              %
            </div>
            <div className="button l" onClick={() => handleButtonClick("/")}>
              /
            </div>
          </div>
          <div className="calc-button-row">
            <div className="button" onClick={() => handleButtonClick("7")}>
              7
            </div>
            <div className="button" onClick={() => handleButtonClick("8")}>
              8
            </div>
            <div className="button" onClick={() => handleButtonClick("9")}>
              9
            </div>
            <div className="button l" onClick={() => handleButtonClick("*")}>
              x
            </div>
          </div>
          <div className="calc-button-row">
            <div className="button" onClick={() => handleButtonClick("4")}>
              4
            </div>
            <div className="button" onClick={() => handleButtonClick("5")}>
              5
            </div>
            <div className="button" onClick={() => handleButtonClick("6")}>
              6
            </div>
            <div className="button l" onClick={() => handleButtonClick("-")}>
              -
            </div>
          </div>
          <div className="calc-button-row">
            <div className="button" onClick={() => handleButtonClick("1")}>
              1
            </div>
            <div className="button" onClick={() => handleButtonClick("2")}>
              2
            </div>
            <div className="button" onClick={() => handleButtonClick("3")}>
              3
            </div>
            <div className="button l" onClick={() => handleButtonClick("+")}>
              +
            </div>
          </div>
          <div className="calc-button-row">
            <div className="button" onClick={() => handleButtonClick(".")}>
              .
            </div>
            <div className="button" onClick={() => handleButtonClick("0")}>
              0
            </div>
            <div className="button" onClick={() => handleButtonClick("<")}>
              <i className="fas fa-backspace"></i>
            </div>
            <div className="button l" onClick={() => handleButtonClick("=")}>
              =
            </div>
          </div>
        </div>
      </div>
      <style jsx>{`
        .container {
          width: 100%;
          margin: auto;
        }

        .calc-body {
          width: 100%;
          margin: auto;
          min-height: 400px;
          border: solid 1px #3a4655;
          box-shadow: 0 8px 50px -7px black;
        }

        .calc-screen {
          background: #3a4655;
          width: 100%;
          padding: 20px;
        }

        .calc-operation {
          text-align: right;
          color: #727b86;
          font-size: 21px;
          padding-bottom: 10px;
          border-bottom: dotted 1px;
          user-select: none;
        }

        .calc-operation.expanded {
          height: 50%;
          z-index: 99999;
          background: #3a4655;
          position: relative;
          animation: expandHeight 0.5s forwards;
        }

        .calc-typed {
          margin-top: 20px;
          font-size: 45px;
          text-align: right;
          color: #fff;
          user-select: none;
        }

        .calc-button-row {
          width: 100%;
          background: #3c4857;
        }

        .button {
          width: 25%;
          background: #425062;
          color: #fff;
          padding: 20px;
          display: inline-block;
          font-size: 25px;
          text-align: center;
          vertical-align: middle;
          margin-right: -4px;
          border-right: solid 2px #3c4857;
          border-bottom: solid 2px #3c4857;
          transition: all 0.2s ease-in-out;
          cursor: pointer;
          user-select: none;
        }

        .button.l {
          color: #aeb3ba;
          background: #404d5e;
        }

        .button.c {
          color: #d95d4e;
          background: #404d5e;
        }

        .button:hover {
          background: #cf5a56;
          transform: rotate(5deg);
        }

        .button.c:hover,
        .button.l:hover {
          background: #cf5a56;
          color: #fff;
        }

        .blink-me {
          color: #cf5a56;
        }

        .checkHistory {
          color: white;
          margin-left: 1em;
        }

        .history {
          max-height: 50%;
          overflow-y: auto;
          overflow-x: hidden;
          padding: 1em;
          background-color: #3a4655;
        }

        .history h2 {
          color: #727b86;
          font-size: 18px;
          margin-bottom: 10px;
        }

        .no-history {
          text-align: center;
        }

        @keyframes expandHeight {
          from {
            height: 150px;
          }
          to {
            height: 250px;
          }
        }
      `}</style>
    </>
  );
}
