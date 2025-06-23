import { useState, useEffect, useRef, useMemo } from "react";
import { FixedSizeList } from "react-window";
import React from "react";
import Link from "next/link";
import Image from "next/image";

function SearchBar({ categorizedTools }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [inputFocused, setInputFocused] = useState(false);
  const [hoveredToolId, setHoveredToolId] = useState(null);
  const resultRef = useRef(null);
  const debounceTimeout = useRef(null);

  const handleMouseEnter = useMemo(
    () => (toolId) => {
      setHoveredToolId(toolId);
    },
    []
  );

  const handleMouseLeave = useMemo(
    () => () => {
      setHoveredToolId(null);
    },
    []
  );

  const filteredTools = useMemo(() => {
    console.log("recalculating");

    const filtered = {};

    Object.keys(categorizedTools).forEach((category) => {
      const tools = categorizedTools[category].filter(
        (tool) =>
          tool.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          tool.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
      if (tools.length) {
        filtered[category] = tools;
      }
    });

    return filtered;
  }, [searchQuery, categorizedTools]);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleClickOutside = (event) => {
    if (resultRef.current && !resultRef.current.contains(event.target)) {
      setInputFocused(false);
    }
  };

  const handleInputChange = (e) => {
    const newSearchQuery = e.target.value;
    setSearchQuery(newSearchQuery);

    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    debounceTimeout.current = setTimeout(() => {
      setSearchQuery(newSearchQuery);
    }, 300);
  };

  return (
    <div className="search_container">
      <div className="search_inner">
        <div className="search_field">
          <input
            value={searchQuery}
            onChange={handleInputChange}
            onFocus={() => setInputFocused(true)}
            type="text"
            placeholder="Search Tools"
            className="search_input"
            onKeyDown={(e) => {
              if (e.key === "Tab" && Object.keys(filteredTools).length > 0) {
                e.preventDefault();
                const firstSuggestion =
                  filteredTools[Object.keys(filteredTools)[0]][0].title;
                setSearchQuery(firstSuggestion);
              }
            }}
          />
        </div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#000000"
          strokeWidth="1"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
      </div>
      {inputFocused && (
        <div className="search_result" ref={resultRef}>
          <div className="search_result_inner">
            {Object.keys(filteredTools).map((category) => (
              <React.Fragment key={category}>
                {filteredTools[category].map((tool) => (
                  <Link
                    href={`/tools/${tool.category.toLowerCase()}/${tool.name}`}
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                    key={`${category}-${tool.name}`} // Use a more stable and unique key
                  >
                    <div
                      className="search_item"
                      onMouseEnter={() => handleMouseEnter(tool.name)}
                      onMouseLeave={handleMouseLeave}
                    >
                      <div className="search_toolIcon">
                        <Image
                          src={
                            hoveredToolId === tool.name
                              ? tool.activeSVG
                              : tool.defaultSVG
                          }
                          width={30}
                          height={30}
                        />
                      </div>
                      <div className="search_toolInner">
                        <div className="search_toolName">
                          {tool.name
                            .replace(/-/g, " ")
                            .toLowerCase()
                            .includes(searchQuery.toLowerCase())
                            ? tool.name
                                .replace(/-/g, " ")
                                .split(new RegExp(`(${searchQuery})`, "gi"))
                                .map((part, index) =>
                                  part.toLowerCase() ===
                                  searchQuery.toLowerCase() ? (
                                    <b style={{color: '#cf5a56'}} key={index}>{part}</b>
                                  ) : (
                                    <span key={index}>{part}</span>
                                  )
                                )
                            : tool.name.replace(/-/g, " ")}
                        </div>
                        <Link
                          href={`/tools/${tool.category.toLowerCase()}`}
                          className="search_categoryName"
                          onClick={(e) => {
                            e.stopPropagation(); // prevent the click event from bubbling up
                          }}
                        >
                          {category}
                        </Link>
                      </div>
                    </div>
                  </Link>
                ))}
              </React.Fragment>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default SearchBar;
