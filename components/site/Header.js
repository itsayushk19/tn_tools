import Image from "next/image";
import SearchBar from "./ToolSearch";
import { useState, useRef } from "react";
import Link from "next/link";
import TopLogo from "public/favicons/android-chrome-512x512.png";

export default function Header({ categorizedTools }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownTimeoutRef = useRef(null); // Create a ref for the timeout

  const handleTriggerMouseOver = () => {
    clearTimeout(dropdownTimeoutRef.current); // Clear any existing timeout
    setIsDropdownOpen(true);
  };

  const handleTriggerMouseOut = () => {
    // Use a timeout to delay closing the dropdown
    dropdownTimeoutRef.current = setTimeout(() => {
      setIsDropdownOpen(false);
    }, 300); // Adjust the delay as needed (e.g., 300ms)

    // Clear the timeout when the mouse moves out of the trigger
    clearTimeout(dropdownTimeoutRef.current);
  };

  const handleItemsMouseOver = () => {
    clearTimeout(dropdownTimeoutRef.current); // Clear any existing timeout
    setIsDropdownOpen(true);
  };

  const handleItemsMouseOut = () => {
    setIsDropdownOpen(false);
  };

  const fiveCategories = Object.keys(categorizedTools).slice(0, 5);
  const otherCategories = Object.keys(categorizedTools).slice(5);

  return (
    <header className="site_header">
      <div className="inner">
        <div className="col_1">
          <Link
            href={"/"}
            style={{
              display: "flex",
              alignItems: "center",
              color: "#af4d46",
            }}
          >
            <Image
              src={TopLogo}
              alt="TechNeg Web Tools Website Logo"
              style={{ width: "44px", height: "44px", marginRight: "1rem" }}
            />
          </Link>
        </div>
        <div className="col_2">
          <nav>
            <ul>
              {/* Render the first five categories */}
              {fiveCategories.map((category) => (
                <li key={category}>
                  <Link href={`/tools/${category}`}>{category}</Link>
                </li>
              ))}
              {/* Render the "More Categories" trigger */}
              {otherCategories.length > 0 && (
                <li
                  className="dropDown_trigger"
                  onMouseOver={handleTriggerMouseOver}
                  onMouseOut={handleTriggerMouseOut}
                >
                  <div
                    onMouseOver={handleItemsMouseOver}
                    onMouseOut={handleItemsMouseOut}
                  >
                    <span className="dropDown_text">More</span>
                    {/* Render the dropdown menu */}
                    <div
                      className={`dropDown_items ${
                        isDropdownOpen ? "open" : ""
                      }`}
                    >
                      {otherCategories.map((category) => (
                        <div className="dropDown_item" key={category}>
                          <Link
                            className="tn_text txt"
                            href={`/tools/${category}`}
                          >
                            {category}
                          </Link>
                        </div>
                      ))}
                    </div>
                  </div>
                </li>
              )}
            </ul>
          </nav>
          <SearchBar categorizedTools={categorizedTools} />
        </div>
      </div>
    </header>
  );
}
