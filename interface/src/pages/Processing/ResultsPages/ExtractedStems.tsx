// ExtractedStems.tsx
import React from "react";

interface ExtractedStemsProps {
  stems: string[];
}

const ExtractedStems: React.FC<ExtractedStemsProps> = ({ stems }) => {
  return (
    <div>
      <h2>Extracted Stems</h2>
      <ul>
        {stems.map((file, index) => (
          <li key={index}>
            <a href={file} target="_blank" rel="noopener noreferrer">
              Stem File {index + 1}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ExtractedStems;
