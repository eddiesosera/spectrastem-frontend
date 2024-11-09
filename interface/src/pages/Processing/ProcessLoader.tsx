import React, { useState } from "react";
import Wizard from "../../components/Feedback/Wizard/wizard";

const ProcessLoader: React.FC = () => {
  const [progressPercent, setProgressPercent] = useState<number>(0);
  return (
    // <div className="flex-grow flex items-center p4">
    <Wizard>
      <div className="flex flex-col flex-grow g-4 w-full h-full align-center justify-center">
        {/* Loader */}

        <div className="w-fit">{progressPercent}%</div>

        <div className="w-fit">Estimated time left</div>
      </div>
    </Wizard>
    // </div>
  );
};

export default ProcessLoader;
