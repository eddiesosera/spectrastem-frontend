// interface/pages/Processing/ResultsPages/ExtractedStems.tsx

import React from "react";

interface ExtractedStemsProps {
  stems: { [key: string]: string };
}

const ExtractedStems: React.FC<ExtractedStemsProps> = ({ stems }) => {
  return (
    <div className="p-6">
      <h3 className="text-lg font-semibold">Stems:</h3>
      <ul className="list-disc list-inside">
        {Object.entries(stems).map(([name, url]) => (
          <li key={name} className="mt-2">
            <a href={url} download className="text-blue-500 underline">
              {name}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ExtractedStems;
