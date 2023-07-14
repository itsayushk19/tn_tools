import Image from "next/image";
import SearchBar from "./ToolSearch";
import { useState } from "react";
import Link from "next/link";
import TopLogo from "public/favicons/android-chrome-512x512.png";

export default function Header({ categorizedTools }) {
  const [showCategories, setShowCategories] = useState(false);
  const handleCategoriesHover = () => {
    setShowCategories(true);
  };
  const handleCategoriesLeave = () => {
    setShowCategories(false);
  };

  const fiveCategories = Object.keys(categorizedTools).slice(0, 5);
  const otherCategories = Object.keys(categorizedTools).slice(5);

  return (
    <>
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
        {fiveCategories.map((category) => (
          <li key={category}>
            <Link href={`/tools/${category}`}>
              {category}
            </Link>
          </li>
        ))}
        {otherCategories.length > 0 && (
          <li>
            <details>
              <summary>More Categories</summary>
              <ul>
                {otherCategories.map((category) => (
                  <li key={category}>
                    <Link href={`/tools/${category}`}>
                      {category}
                    </Link>
                  </li>
                ))}
              </ul>
            </details>
          </li>
        )}
      </ul>
            </nav>
            <SearchBar categorizedTools={categorizedTools} />
          </div>
        </div>
      </header>
    </>
  );
}
