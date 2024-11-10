import React, { useEffect, useState } from "react";
import Wizard from "../../components/Feedback/Wizard/wizard";
import {
  CombSpinner,
  CubeSpinner,
  DominoSpinner,
  JellyfishSpinner,
  WaveSpinner,
} from "react-spinners-kit";

const ProcessLoader: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [progressPercent, setProgressPercent] = useState<number>(0);
  const [loaderColour, setLoaderColour] = useState<string>("#534BAF");
  const colorArray = ["#2A9D8F", "#372BBD", "#BA6CDF", "#F333FF"];
  const [colourIndex, setColourIndex] = useState<number>(0);
  const interval = 3000;

  useEffect(() => {
    setInterval(() => {
      setLoaderColour(colorArray[colourIndex]);
      setColourIndex((colourIndex + 1) % colorArray.length);
    }, interval);
  }, [loaderColour]);

  return (
    <Wizard>
      <div className="flex flex-col flex-grow gap-8 w-full h-full items-center justify-center">
        <WaveSpinner size={30} color={loaderColour} loading={loading} />

        <div className="flex flex-col gap-1 items-center">
          <div className="w-fit text-xl flex flex-row gap-1  items-center">
            <div className="font-extrabold">{progressPercent}%</div>
            {/* <div className="">done</div> */}
          </div>
          <div className="w-fit text-[#A9A8BD] text-sm">0m left</div>
        </div>
      </div>
    </Wizard>
  );
};

export default ProcessLoader;
