import React from "react";
import Wizard from "../../components/Feedback/Wizard/wizard";
import { steps } from "./steps";

const ProcessLoader: React.FC = () => {
  return (
    <div className="flex-grow flex items-center p4">
      <Wizard steps={steps} />
    </div>
  );
};

export default ProcessLoader;

// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import StemPlayer from "../../components/Input/StemPlayer";
// import { ProcessLoader } from './ProcessLoader';

// export const ProcessLoader: React.FC = () => {
//   return (
//     <div>
//       <h1>Process Loader</h1>
//     </div>
//   );
// };

// interface StatusPageProps {
//   trackName: string;
// }

// const StatusPage: React.FC<StatusPageProps> = ({ trackName }) => {
//   const [status, setStatus] = useState<any>(null);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchStatus = async () => {
//       try {
//         const response = await axios.get(
//           `httweb-production-5c72.up.railway.app/api/status/${trackName}`
//         );
//         setStatus(response.data);
//       } catch (err) {
//         setError("Error fetching status." + err);
//       }
//     };

//     const interval = setInterval(fetchStatus, 5000); // Poll every 5 seconds
//     return () => clearInterval(interval);
//   }, [trackName]);

//   if (error) {
//     return <p>{error}</p>;
//   }

//   if (!status) {
//     return <p>Loading status...</p>;
//   }

//   if (status.status === "completed") {
//     return (
//       <div>
//         <h2>Processing Complete</h2>
//         <div>
//           {Object.entries(status.stems).map(([stemName, stemUrl]) => (
//             <StemPlayer key={stemName} stemName={stemName} stemUrl={stemUrl} />
//           ))}
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div>
//       <h2>Processing Status</h2>
//       <p>Current stem: {status.current_stem}</p>
//       <ul>
//         {Object.entries(status.stems).map(([stemName, stemStatus]) => (
//           <li key={stemName}>
//             {stemName}: {stemStatus}
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default StatusPage;
