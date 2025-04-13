// import React, { useState } from "react";

// function AdvancedSearch({ setSearchRow }) {
//   const [sparkles, setSparkles] = useState([]);

//   const generateSparkles = () => {
//     const count = 80;
//     const dots = Array.from({ length: count }).map((_, index) => ({
//       id: Date.now() + index,
//       transformEnd: `translate(${(Math.random() - 0.5) * 200}px, ${
//         (Math.random() - 0.5) * 200
//       }px)`,
//     }));
//     setSparkles(dots);
//     setTimeout(() => setSparkles([]), 900);
//   };

//   return (
//       <div>
//       <div className="relative group">
//         <button
//           onMouseEnter={generateSparkles}
//           className="bg-sea hover:bg-sea-hover cursor-pointer transition-colors duration-300 px-3 mx-2 rounded-md text-nowrap text-white h-11 z-10 relative overflow-visible"
//           onClick={() => setSearchRow((prev) => !prev)}
//         >
//           Advanced Search
//         </button>

//         <div className="sparkle-container">
//           {sparkles.map((sparkle) => (
//             <span
//               key={sparkle.id}
//               className="sparkle-dot"
//               style={{
//                 top: "50%",
//                 left: "50%",
//                 "--transform-end": sparkle.transformEnd,
//               }}
//             />
//           ))}
//         </div>
//           </div>

//     </div>
//   );
// }

// export default AdvancedSearch;
