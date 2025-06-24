import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import TopLogo from "public/favicons/android-chrome-512x512.png";
import SearchBar from "./ToolSearch";

export default function Header({ categorizedTools, toolLabels }) {
  const [activeLabel, setActiveLabel] = useState(null); // final label shown
  const [displayLabel, setDisplayLabel] = useState(null); // current visible label
  const [isTransitioning, setIsTransitioning] = useState(false);

  const uniqueLabels = [...new Set(toolLabels.map((tool) => tool.tag))];

  const toolsByTag = {};
  toolLabels.forEach(({ tag, category, name }) => {
    if (!toolsByTag[tag]) toolsByTag[tag] = {};
    if (!toolsByTag[tag][category]) toolsByTag[tag][category] = [];
    toolsByTag[tag][category].push(name);
  });

  const sortedCategories = displayLabel
    ? Object.entries(toolsByTag[displayLabel]).sort((a, b) => b[1].length - a[1].length)
    : [];

  // Handles smooth transition between tabs
  const handleTabChange = (label) => {
    if (label === activeLabel) {
      // Close tab
      setIsTransitioning(true);
      setTimeout(() => {
        setActiveLabel(null);
        setDisplayLabel(null);
        setIsTransitioning(false);
      }, 300);
    } else {
      setIsTransitioning(true);
      setTimeout(() => {
        setActiveLabel(label);
        setDisplayLabel(label);
        setIsTransitioning(false);
      }, 300); // match transition duration
    }
  };

  return (
    <header className={`site_header ${activeLabel ? "hero_active" : ""}`}>
      <div className="grid_top">
        <div className="logo_cell">
          <Image src={TopLogo} alt="Logo" width={44} height={44} />
        </div>
        <div className="menu_cell">
          {uniqueLabels.map((label) => (
            <button
              key={label}
              className={`label_btn ${activeLabel === label ? "active" : ""}`}
              onClick={() => handleTabChange(label)}
            >
              {label.toUpperCase()}
            </button>
          ))}
        </div>
        <div className="search_cell">
          <SearchBar categorizedTools={categorizedTools} />
        </div>
      </div>

      {(displayLabel || isTransitioning) && (
        <div className="grid_bottom">
          <div
            className={`tool_table animate_transition ${isTransitioning ? "hidden" : "visible"
              }`}
          >
            <div className="category_grid">
              {sortedCategories.map(([category, tools]) => (
                <div className="category_column" key={category}>
                  <div className="category">
                    <Image width={25} height={25} src={`/icons/tools/${tools[0]}/default.svg`}></Image>
                    <div className="category_heading">{category.toUpperCase()}</div>
                  </div>
                  {tools.map((tool) => (
                    <div className="tool_cell" key={tool}>
                      <Link href={`/tools/${category}/${tool}`}>{beautifyName(tool)}</Link>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

function beautifyName(name) {
  return name
    .replace(/-/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}
