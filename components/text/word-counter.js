import { useState, useRef, useCallback } from "react";
import { toast } from "react-toastify";

const ServiceLimits = [
  { service: "Meta Title", limit: 60, type: "letter", limitType: "max" },
  { service: "Meta Description", limit: 160, type: "letter", limitType: "max" },
  { service: "Ideal Article", limit: 500, type: "word", limitType: "min" },
  { service: "YouTube Video Title", limit: 100, type: "letter", limitType: "max" },
  { service: "YouTube Video Description", limit: 5000, type: "letter", limitType: "max" },
  { service: "Snapchat Caption", limit: 80, type: "letter", limitType: "max" },
  { service: "Twitter Character Limit", limit: 280, type: "character", limitType: "max" },
  { service: "Instagram Caption Limit", limit: 2200, type: "character", limitType: "max" },
  { service: "Facebook Post Limit", limit: 63206, type: "character", limitType: "max" },
  { service: "LinkedIn Headline Limit", limit: 220, type: "character", limitType: "max" },
  { service: "Pinterest Pin Description Limit", limit: 500, type: "character", limitType: "max" },
  { service: "Reddit Title Limit", limit: 300, type: "character", limitType: "max" },
  { service: "WhatsApp Message Limit", limit: 4096, type: "character", limitType: "max" },
  { service: "Email Subject Line Limit", limit: 80, type: "character", limitType: "max" },
  { service: "YouTube Video Title Limit", limit: 100, type: "character", limitType: "max" },
  { service: "Google Ads Headline Limit", limit: 30, type: "character", limitType: "max" },
  { service: "Medium Article Title Limit", limit: 70, type: "character", limitType: "max" },
  { service: "Quora Answer Limit", limit: 20000, type: "character", limitType: "max" },
  { service: "Yelp Review Limit", limit: 5000, type: "character", limitType: "max" },
  { service: "Shopify Product Title Limit", limit: 255, type: "character", limitType: "max" },
  { service: "eBay Listing Title Limit", limit: 80, type: "character", limitType: "max" },
  { service: "WordPress Post Title Limit", limit: 70, type: "character", limitType: "max" },
  { service: "TripAdvisor Review Limit", limit: 1000, type: "character", limitType: "max" },
  { service: "GitHub Repository Description Limit", limit: 100, type: "character", limitType: "max" },
];

export default function LoremIpsumGenerator() {
  const [inputText, setInputText] = useState("");
  const [sentanceCount, setSentanceCount] = useState(0);
  const [wordCount, setWordCount] = useState(0);
  const [letterCount, setLetterCount] = useState(0);
  const [sortColumn, setSortColumn] = useState("");
  const [sortOrder, setSortOrder] = useState("");
  const debounceTimer = useRef(null);

  const fetchTextStats = useCallback(async (text) => {
    try {
      const res = await fetch("/api/text-stats", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      if (!res.ok) throw new Error("Failed to fetch stats");

      const { sentences, words, letters } = await res.json();
      setSentanceCount(sentences);
      setWordCount(words);
      setLetterCount(letters);
    } catch (err) {
      toast.error("Error calculating text stats");
    }
  }, []);

  const handleInputChange = (event) => {
    const text = event.target.value;
    setInputText(text);

    if (debounceTimer.current) clearTimeout(debounceTimer.current);

    debounceTimer.current = setTimeout(() => {
      fetchTextStats(text);
    }, 500);
  };

  const handleTableHeaderClick = (column) => {
    if (sortColumn === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortOrder("asc");
    }
  };

  const getStatus = (limit) => {
    const count = limit.type === "letter" ? letterCount : wordCount;
    if (!inputText) return "Empty";
    if (limit.limitType === "max") return count <= limit.limit ? "Passed" : "Failed";
    if (limit.limitType === "min") return count >= limit.limit ? "Passed" : "Failed";
    return "";
  };

  const sortServiceLimits = () => {
    const sorted = [...ServiceLimits];
    if (sortColumn === "service") {
      sorted.sort((a, b) =>
        sortOrder === "asc"
          ? a.service.localeCompare(b.service)
          : b.service.localeCompare(a.service)
      );
    } else if (sortColumn === "limit") {
      sorted.sort((a, b) => (sortOrder === "asc" ? a.limit - b.limit : b.limit - a.limit));
    } else if (sortColumn === "count") {
      sorted.sort((a, b) => {
        const aCount = a.type === "letter" ? letterCount : wordCount;
        const bCount = b.type === "letter" ? letterCount : wordCount;
        return sortOrder === "asc" ? aCount - bCount : bCount - aCount;
      });
    } else if (sortColumn === "type") {
      sorted.sort((a, b) =>
        sortOrder === "asc" ? a.type.localeCompare(b.type) : b.type.localeCompare(a.type)
      );
    } else if (sortColumn === "limitType") {
      sorted.sort((a, b) =>
        sortOrder === "asc"
          ? a.limitType.localeCompare(b.limitType)
          : b.limitType.localeCompare(a.limitType)
      );
    } else if (sortColumn === "status") {
      sorted.sort((a, b) =>
        sortOrder === "asc"
          ? getStatus(a).localeCompare(getStatus(b))
          : getStatus(b).localeCompare(getStatus(a))
      );
    }
    return sorted;
  };

  const renderServiceLimits = () => {
    return sortServiceLimits().map((limit) => {
      const count = limit.type === "letter" ? letterCount : wordCount;
      const limitTypeText = limit.limitType === "max" ? "Maximum" : "Minimum";
      const status = getStatus(limit);

      let statusColor = {
        Empty: "rgb(99, 99, 136)",
        Passed: "rgb(33, 191, 115)",
        Failed: "rgb(255, 0, 61)",
      }[status];

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
