// File: frontend/components/StemPlayer.tsx
import React from "react";

interface StemPlayerProps {
  stemName: string;
  stemUrl: string;
}

const StemPlayer: React.FC<StemPlayerProps> = ({ stemName, stemUrl }) => {
  return (
    <div>
      <h3>{stemName}</h3>
      <audio controls>
        <source src={stemUrl} type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>
    </div>
  );
};

export default StemPlayer;
