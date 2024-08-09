// import React, { useEffect } from 'react'
// import axios from 'axios';


// function Logout() {
//   useEffect(() =>{
//     const logout = async () =>{
//         try{
//             const response = await axios.post('http://localhost:5000/logout',  { withCredentials : true })
//             console.log('logout request sent')
//             window.location.href = '/';
//         }catch(err){
//             console.log('errorr while logging outt. ', err);
//         }
//     };
//     logout();
//   }, []);
//   return (
//     <div>
//     </div>
//   )
// }

// export default Logout