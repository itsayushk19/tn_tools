import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";

function SearchBar({ categorizedTools }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredTools, setFilteredTools] = useState(categorizedTools);
  const [inputFocused, setInputFocused] = useState(false);
  const [hoveredToolId, setHoveredToolId] = useState(null);
  const resultRef = useRef(null);

  useEffect(() => {
    const filtered = [];

    Object.keys(categorizedTools).forEach((category) => {
      const tools = categorizedTools[category].filter(
        (tool) =>
          tool.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          tool.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
      if (tools.length) {
        filtered.push({ category, tools });
      }
    });

    setFilteredTools(filtered);
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

  return (
    <>
      <div className="search_container">
        <div className="search_inner">
          <div className="search_field">
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
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
                <div key={category}>
                  {filteredTools.map((categoryObj) => (
                    <div key={`${category}_${categoryObj.category}`}>
                      {categoryObj.tools.map((tool) => (
                        <Link
                          href={`/tools/${tool.category.toLowerCase()}/${
                            tool.id
                          }`}
                          onClick={(e) => {
                            e.stopPropagation(); // prevent the click event from bubbling up
                          }}
                          key={`${category}_${tool.id}`} // assign a unique key to each tool element
                        >
                          <div
                            className="search_item"
                            onMouseEnter={() => setHoveredToolId(tool.id)}
                            onMouseLeave={() => setHoveredToolId(null)}
                          >
                            <div
                              className="search_toolIcon"
                            >
                              <Image
                                src={
                                  hoveredToolId === tool.id
                                    ? tool.activeSVG
                                    : tool.defaultSVG
                                }
                                width={30}
                                height={30}
                              />
                            </div>
                            <div className="search_toolInner">
                              <div 
                              className="search_toolName"
                              >
                                {tool.title
                                  .toLowerCase()
                                  .includes(searchQuery.toLowerCase())
                                  ? tool.title
                                      .split(
                                        new RegExp(`(${searchQuery})`, "gi")
                                      )
                                      .map((part, index) =>
                                        part.toLowerCase() ===
                                        searchQuery.toLowerCase() ? (
                                          <b key={index}>{part}</b>
                                        ) : (
                                          <span key={index}>{part}</span>
                                        )
                                      )
                                  : tool.title}
                              </div>
                              <Link
                                href={`/tools/${tool.category.toLowerCase()}`}
                                className="search_categoryName"
                                onClick={(e) => {
                                  e.stopPropagation(); // prevent the click event from bubbling up
                                }}
                              >
                                {categoryObj.category}
                              </Link>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default SearchBar;
