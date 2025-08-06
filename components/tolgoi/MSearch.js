import { SearchOutlined } from "@ant-design/icons";
import React from "react";

function MSearch({ className, onClick }) {
  return (
    <div id="mobileSearch" className={className} onClick={onClick}>
      <button className="flex h-8 w-8 items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50">
        <SearchOutlined className="flex items-center justify-center text-xl dark:text-gray-50" />
      </button>
    </div>
  );
}

export default MSearch;
