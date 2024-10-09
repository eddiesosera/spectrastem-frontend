// File: frontend/components/FormatSelector.tsx
import React from "react";

interface FormatSelectorProps {
  format: string;
  setFormat: React.Dispatch<React.SetStateAction<string>>;
}

const FormatSelector: React.FC<FormatSelectorProps> = ({
  format,
  setFormat,
}) => {
  return (
    <div>
      <label htmlFor="format">Choose Output Format: </label>
      <select
        id="format"
        value={format}
        onChange={(e) => setFormat(e.target.value)}
      >
        <option value="mp3">MP3</option>
        <option value="wav">WAV</option>
      </select>
    </div>
  );
};

export default FormatSelector;
