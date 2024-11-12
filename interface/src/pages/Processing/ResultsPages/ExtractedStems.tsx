// interface/pages/ResultsPages/ExtractedStems.tsx

import React from "react";
import AudioPlayer from "../../../components/Feedback/AudioPlayer/audio_player";

interface ExtractedStemsProps {
  stems: { [key: string]: string };
}

const ExtractedStems: React.FC<ExtractedStemsProps> = ({ stems }) => {
  return (
    <div className="stems-container">
      <h3 className="text-xl font-bold mb-4">Extracted Stems</h3>
      <ul>
        {Object.entries(stems).map(([stemName, url]) => (
          <li key={stemName} className="mb-4">
            {/* <h4 className="text-md font-semibold capitalize">
              {stemName.replace(".mp3", "")}
            </h4>
            <audio controls src={url} className="w-full mt-2">
              Your browser does not support the audio element.
            </audio> */}
            <AudioPlayer
              audioSrc={url}
              fileName={stemName.replace(".mp3", "")}
            />
          </li>
        ))}
      </ul>
      <p className="text-sm text-gray-500 mt-4">
        Listen to each stem individually using the audio controls above.
      </p>
    </div>
  );
};

export default ExtractedStems;
