// src/components/Waveform/Waveform.tsx
import React, { useEffect, useRef } from "react";
import WaveSurfer from "wavesurfer.js";
// Adjust the import path based on your WaveSurfer.js version
import RegionsPlugin from "wavesurfer.js/dist/plugins/regions.esm.js";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { setLoopRegion } from "../../../redux/slices/audio.slice"; // Corrected import
import "./waveform.css"; // Ensure you have the corresponding CSS

const Waveform: React.FC = () => {
  const waveformRef = useRef<HTMLDivElement>(null);
  const wavesurfer = useRef<WaveSurfer | null>(null);
  const dispatch = useDispatch();
  const audioFile = useSelector((state: RootState) => state.audio.currentAudio);
  const userSubscription = useSelector(
    (state: RootState) => state.user.subscription
  );

  useEffect(() => {
    if (waveformRef.current) {
      wavesurfer.current = WaveSurfer.create({
        container: waveformRef.current,
        waveColor: "#ddd",
        progressColor: "#3b82f6",
        backend: "WebAudio",
        height: 200, // Set an explicit height here
        plugins: [
          RegionsPlugin.create({
            regions: [],
            dragSelection: {
              slop: 5,
            },
          }),
        ],
      });

      // Add ready event listener
      wavesurfer.current.on("ready", () => {
        if (wavesurfer.current) {
          const duration = wavesurfer.current.getDuration();
          let region;
          if (duration <= 30) {
            region = { start: 0, end: duration };
          } else {
            region =
              userSubscription === "Premium"
                ? { start: 0, end: duration }
                : { start: 0, end: 30 };
          }
          wavesurfer.current.addRegion({
            ...region,
            loop: true,
            color: "rgba(59, 130, 246, 0.1)",
          });
          dispatch(setLoopRegion(region));
        }
      });

      // Cleanup when the component unmounts
      return () => {
        if (wavesurfer.current) {
          wavesurfer.current.destroy();
        }
      };
    }
  }, [waveformRef, dispatch, userSubscription]);

  // Load the audio file when audioFile changes
  useEffect(() => {
    if (wavesurfer.current && audioFile) {
      wavesurfer.current.load(audioFile);
    }
  }, [audioFile]);

  return <div id="waveform" ref={waveformRef}></div>;
};

export default Waveform;
