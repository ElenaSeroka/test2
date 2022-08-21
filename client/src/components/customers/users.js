// // @ts-nocheck
// import React, { useState, useEffect } from "react";

// function Users() {
//     const [backendData, setBackendData] = useState([{}]);
//     useEffect(() => {
//         // declare the async data fetching function
//         const fetchData = async () => {
//             // get the data from the api
//             const data = await fetch('http://localhost:5000/api');
//             // convert the data to json
//             const json = await data.json();

//             // set state with the result
//             setBackendData(json);
//         }

//         // call the function
//         fetchData()
//             // make sure to catch any error
//             .catch(console.error);;
//     }, [])

//     return (
//         <div>
//             {/* {(typeof backendData.users === "undefined") ? (
//                 <p>Loading...</p>
//             ) : (
//                 backendData.users.map((user, i) => (
//                     <p key={i}> {user.name}</p>
//                 )) */}

//             )}
//         </div>
//     )
// }
// export default Users

