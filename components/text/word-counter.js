import { useState, useEffect } from "react";
import { toast } from "react-toastify";

const ServiceLimits = [
  { service: "Meta Title", limit: 60, type: "letter", limitType: "max" },
  { service: "Meta Description", limit: 160, type: "letter", limitType: "max" },
  { service: "Ideal Article", limit: 500, type: "word", limitType: "min" },
  {
    service: "YouTube Video Title",
    limit: 100,
    type: "letter",
    limitType: "max",
  },
  {
    service: "YouTube Video Description",
    limit: 5000,
    type: "letter",
    limitType: "max",
  },
  { service: "Snapchat Caption", limit: 80, type: "letter", limitType: "max" },
  {
    service: "Twitter Character Limit",
    limit: 280,
    type: "character",
    limitType: "max",
  },
  {
    service: "Instagram Caption Limit",
    limit: 2200,
    type: "character",
    limitType: "max",
  },
  {
    service: "Facebook Post Limit",
    limit: 63206,
    type: "character",
    limitType: "max",
  },
  {
    service: "LinkedIn Headline Limit",
    limit: 220,
    type: "character",
    limitType: "max",
  },
  {
    service: "Pinterest Pin Description Limit",
    limit: 500,
    type: "character",
    limitType: "max",
  },
  {
    service: "Reddit Title Limit",
    limit: 300,
    type: "character",
    limitType: "max",
  },
  {
    service: "WhatsApp Message Limit",
    limit: 4096,
    type: "character",
    limitType: "max",
  },
  {
    service: "Email Subject Line Limit",
    limit: 80,
    type: "character",
    limitType: "max",
  },
  {
    service: "YouTube Video Title Limit",
    limit: 100,
    type: "character",
    limitType: "max",
  },
  {
    service: "Google Ads Headline Limit",
    limit: 30,
    type: "character",
    limitType: "max",
  },
  {
    service: "Medium Article Title Limit",
    limit: 70,
    type: "character",
    limitType: "max",
  },
  {
    service: "Quora Answer Limit",
    limit: 20000,
    type: "character",
    limitType: "max",
  },
  {
    service: "Yelp Review Limit",
    limit: 5000,
    type: "character",
    limitType: "max",
  },
  {
    service: "Shopify Product Title Limit",
    limit: 255,
    type: "character",
    limitType: "max",
  },
  {
    service: "eBay Listing Title Limit",
    limit: 80,
    type: "character",
    limitType: "max",
  },
  {
    service: "WordPress Post Title Limit",
    limit: 70,
    type: "character",
    limitType: "max",
  },
  {
    service: "TripAdvisor Review Limit",
    limit: 1000,
    type: "character",
    limitType: "max",
  },
  {
    service: "GitHub Repository Description Limit",
    limit: 100,
    type: "character",
    limitType: "max",
  },
];

export default function LoremIpsumGenerator() {
  const [inputText, setInputText] = useState("");
  const [sentanceCount, setSentanceCount] = useState(0);
  const [wordCount, setWordCount] = useState(0);
  const [letterCount, setLetterCount] = useState(0);
  const [sortColumn, setSortColumn] = useState(""); // track the currently sorted column
  const [sortOrder, setSortOrder] = useState(""); // track the sort order (asc/desc)

  const handleInputChange = (event) => {
    const text = event.target.value;
    setInputText(text);

    // Count sentences
    const sentences = text.split(/[.|?|!]/).filter(Boolean);
    setSentanceCount(sentences.length);

    // Count words
    const words = text.split(/\s+/).filter(Boolean);
    setWordCount(words.length);

    // Count letters
    const letters = text.replace(/\s/g, "").split("");
    setLetterCount(letters.length);
  };

  const handleTableHeaderClick = (column) => {
    if (sortColumn === column) {
      // if the same column is clicked, reverse the sort order
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      // if a different column is clicked, set the sort column and default to ascending order
      setSortColumn(column);
      setSortOrder("asc");
    }
  };

  const sortServiceLimits = () => {
    const sortedLimits = [...ServiceLimits];

    if (sortColumn === "service") {
      sortedLimits.sort((a, b) =>
        sortOrder === "asc"
          ? a.service.localeCompare(b.service)
          : b.service.localeCompare(a.service)
      );
    } else if (sortColumn === "limit") {
      sortedLimits.sort((a, b) =>
        sortOrder === "asc" ? a.limit - b.limit : b.limit - a.limit
      );
    } else if (sortColumn === "count") {
      sortedLimits.sort((a, b) =>
        sortOrder === "asc" ? a.count - b.count : b.count - a.count
      );
    } else if (sortColumn === "type") {
      sortedLimits.sort((a, b) =>
        sortOrder === "asc"
          ? a.type.localeCompare(b.type)
          : b.type.localeCompare(a.type)
      );
    } else if (sortColumn === "limitType") {
      sortedLimits.sort((a, b) =>
        sortOrder === "asc"
          ? a.limitType.localeCompare(b.limitType)
          : b.limitType.localeCompare(a.limitType)
      );
    } else if (sortColumn === "status") {
      sortedLimits.sort((a, b) =>
        sortOrder === "asc"
          ? getStatus(a).localeCompare(getStatus(b))
          : getStatus(b).localeCompare(getStatus(a))
      );
    }

    return sortedLimits;
  };

  const getStatus = (limit) => {
    const count = limit.type === "letter" ? letterCount : wordCount;
    const limitTypeText = limit.limitType === "max" ? "Maximum" : "Minimum";

    if (!inputText) {
      return "Empty";
    } else if (limit.limitType === "max") {
      return count <= limit.limit ? "Passed" : "Failed";
    } else if (limit.limitType === "min") {
      return count >= limit.limit ? "Passed" : "Failed";
    }

    return "";
  };

  const renderServiceLimits = () => {
    const sortedLimits = sortServiceLimits();
    return sortedLimits.map((limit) => {
      const count = limit.type === "letter" ? letterCount : wordCount;
      const limitTypeText = limit.limitType === "max" ? "Maximum" : "Minimum";
      let status = "";

      if (inputText) {
        if (limit.limitType === "max") {
          // Check if count is less than or equal to the limit
          status = count <= limit.limit ? "Passed" : "Failed";
        } else if (limit.limitType === "min") {
          // Check if count is greater than or equal to the limit
          status = count >= limit.limit ? "Passed" : "Failed";
        }
      } else {
        status = "Empty";
      }

      let statusColor = "";
      if (status === "Empty") {
        statusColor = "rgb(99, 99, 136)";
      } else if (status === "Passed") {
        statusColor = "rgb(33, 191, 115)";
      } else if (status === "Failed") {
        statusColor = "rgb(255, 0, 61)";
      }

      return (
        <tr key={limit.service}>
          <td>{limit.service}</td>
          <td>{limit.limit}</td>
          <td>{count}</td>
          <td>{limit.type}</td>
          <td>{limitTypeText}</td>
          <td style={{ color: statusColor, fontWeight: "bold" }}>{status}</td>
        </tr>
      );
    });
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
      <div className="grid lg:grid-flow-col gap-5">
        <div className="form__field">
          <p className="text-4xl font-bold text-center">{sentanceCount}</p>
          <p className="text-center">Sentence</p>
        </div>
        <div className="form__field">
          <p className="text-4xl font-bold text-center">{wordCount}</p>
          <p className="text-center">Words</p>
        </div>
        <div className="form__field">
          <p className="text-4xl font-bold text-center">{letterCount}</p>
          <p className="text-center">Letters</p>
        </div>
      </div>
      <div>
        <h2 className="text-center mt-5">Service Limits</h2>
        <table className="table">
          <thead>
            <tr>
              <th onClick={() => handleTableHeaderClick("service")}>Service</th>
              <th onClick={() => handleTableHeaderClick("limit")}>Limit</th>
              <th onClick={() => handleTableHeaderClick("count")}>Count</th>
              <th onClick={() => handleTableHeaderClick("type")}>Type</th>
              <th onClick={() => handleTableHeaderClick("limitType")}>
                Limit Type
              </th>
              <th onClick={() => handleTableHeaderClick("status")}>Status</th>
            </tr>
          </thead>
          <tbody>{renderServiceLimits()}</tbody>
        </table>
      </div>
    </>
  );
}
