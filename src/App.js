 

// import React, { useEffect, useState } from "react";
// import { io } from "socket.io-client";

// // Singleton socket instance
// let socket;

// function getSocket() {
//   if (!socket) {
//     socket = io("http://localhost:8000", {
//       autoConnect: true,
//       reconnection: true,
//       reconnectionAttempts: 10,
//       reconnectionDelay: 1000,
//     });
//   }
//   return socket;   
// }

// function App() {
//   const [connectedPCs, setConnectedPCs] = useState([]);
//   const [selectedPC, setSelectedPC] = useState(null);
//   const [cameraStream, setCameraStream] = useState(null);

//   useEffect(() => {
//     const socket = getSocket();

//     // Notify the server that an admin has connected
//     socket.emit("admin-connect");

//     // Receive updates to the connected PC list
//     socket.on("update-pc-list", (pcList) => {
//       console.log("Received updated PC list:", pcList);
//       setConnectedPCs(pcList);
//     });

//     // Handle incoming camera frames
//     socket.on("camera-frame", ({ pcId, frame }) => {
//       if (pcId === selectedPC) {
//         setCameraStream(frame);
//       }
//     });

//     return () => {
//       // Disconnect socket and clean up listeners on unmount
//       socket.off("update-pc-list");
//       socket.off("camera-frame");
//     };
//   }, [selectedPC]);

//   const handleRequestCamera = (pcId) => {
//     setSelectedPC(pcId);
//     const socket = getSocket();
//     socket.emit("request-camera", pcId);
//   };

//   const handleCloseCamera = (pcId) => {
//     const socket = getSocket();
//     socket.emit("close-camera", pcId); // Notify server to close the camera on this PC
//     if (pcId === selectedPC) {
//       setSelectedPC(null);
//       setCameraStream(null);
//     }
//   };
//   return (
//     <div>
//       <h1>Admin Panel</h1>
//       {connectedPCs.length > 0 ? (
//         <ul>
//           {connectedPCs.map((pc) => (
//             <li key={pc}>
//               {pc}{" "}
//               <button onClick={() => handleRequestCamera(pc)}>
//                 Open Camera
//               </button>
//               <button onClick={() => handleCloseCamera(pc)}>Close Camera</button>
//             </li>
//           ))}
//         </ul>
//       ) : (
//         <p>No PCs connected.</p>
//       )}
//       {selectedPC && (
//         <div>
//           <h2>Camera Feed from {selectedPC}</h2>
//           {cameraStream ? (
//             <img src={cameraStream} alt="Camera Stream" />
//           ) : (
//             <p>Waiting for camera stream...</p>
//           )}
//         </div>
//       )}
//     </div>
//   );
// }

// export default App;
     
 
 import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";

let socket;
 
function getSocket() {
  if (!socket) {
    socket = io(process.env.REACT_APP_URL, {
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
    });
  }
  return socket;
}

function App() {
  const [connectedPCs, setConnectedPCs] = useState([]);
  const [selectedPC, setSelectedPC] = useState(null);
  const [cameraStream, setCameraStream] = useState(null);

  useEffect(() => {
    const socket = getSocket();

    socket.emit("admin-connect");

    socket.on("update-pc-list", (pcList) => {
      console.log("Received updated PC list:", pcList);
      setConnectedPCs(pcList);
    });

    socket.on("camera-frame", ({ pcId, frame }) => {
      if (pcId === selectedPC) {
        setCameraStream(frame);
      }
    });

    return () => {
      socket.off("update-pc-list");
      socket.off("camera-frame");
    };
  }, [selectedPC]);

  const handleRequestCamera = (pcId) => {
    setSelectedPC(pcId);
    getSocket().emit("start-camera", pcId);
  };

  const handleCloseCamera = (pcId) => {
    getSocket().emit("close-camera", pcId);
    if (pcId === selectedPC) {
      setSelectedPC(null);
      setCameraStream(null);
    }
  };

  return (
    <div>
      <h1>Admin Panel</h1>
      {connectedPCs.length > 0 ? (
        <ul>
          {connectedPCs.map((pc) => (
            <li key={pc}>
              {pc}{" "}
              <button onClick={() => handleRequestCamera(pc)}>Open Camera</button>
              <button onClick={() => handleCloseCamera(pc)}>Close Camera</button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No PCs connected.</p>
      )}
      {selectedPC && (
        <div>
          <h2>Camera Feed from {selectedPC}</h2>
          {cameraStream ? (
            <img src={cameraStream} alt="Camera Stream" />
          ) : (
            <p>Waiting for camera stream...</p>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
