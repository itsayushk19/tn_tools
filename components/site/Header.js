import Image from "next/image";
import SearchBar from "./ToolSearch";
import { useState } from "react";
import Link from "next/link";
import TopLogo from "/public/vercel.svg"

export default function Header({ categorizedTools }) {
  const [showCategories, setShowCategories] = useState(false);
  const handleCategoriesHover = () => {
    setShowCategories(true);
  };
  const handleCategoriesLeave = () => {
    setShowCategories(false);
  };
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
              <h3>TN WebToolKit</h3>
            </Link>
          </div>
          <div className="col_2">
            <SearchBar categorizedTools={categorizedTools} />
          </div>
        </div>
      </header>
    </>
  );
}
