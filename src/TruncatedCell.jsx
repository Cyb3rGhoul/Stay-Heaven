import React, { useState } from 'react';

const TruncatedCell = ({ text, maxLength = 25 }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const isTruncated = text.length > maxLength;
  
  const displayText = isExpanded ? text : text.slice(0, maxLength) + (isTruncated ? '...' : '');
  
  return (
    <div 
      className="relative group"
      onMouseEnter={() => isTruncated && setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      <span className="text-gray-700">
        {displayText}
      </span>
      {isTruncated && !isExpanded && (
        <div className="hidden group-hover:block absolute z-10 bg-white border border-gray-200 shadow-lg rounded-md p-2 min-w-[200px] max-w-[400px] whitespace-normal">
          {text}
        </div>
      )}
    </div>
  );
};

export default TruncatedCell;