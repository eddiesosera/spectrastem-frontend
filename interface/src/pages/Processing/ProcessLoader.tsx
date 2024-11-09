import React, { useState } from "react";
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
  return (
    <Wizard>
      <div className="flex flex-col flex-grow gap-8 w-full h-full items-center justify-center">
        <WaveSpinner size={30} color="#534BAF" loading={loading} />

        <div className="flex flex-col gap-1 items-center">
          <div className="w-fit text-2xl flex flex-row gap-1 text-[#534BAF] items-center">
            <div className="font-extrabold">{progressPercent}%</div>
            <div className="">done</div>
          </div>
          <div className="w-fit text-[#A9A8BD]">0m left</div>
        </div>
      </div>
    </Wizard>
  );
};

export default ProcessLoader;
