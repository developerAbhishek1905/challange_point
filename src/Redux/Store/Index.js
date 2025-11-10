// import { configureStore } from "@reduxjs/toolkit";
// import userReducer from '../Slice/UserSlice'
// import searchReducer from '../Slice/searchSlice'

// // Get initial auth state from localStorage
// const getPreloadedState = () => {
//   try {
//     const savedRole = localStorage.getItem('role');
//     const savedEmail = localStorage.getItem('email');
//     const savedEventId = localStorage.getItem('eventId');
    
//     if (savedRole) {
//       const role = JSON.parse(savedRole);
//       const email = JSON.parse(savedEmail);
//       const eventId = JSON.parse(savedEventId);
      
//       // Return preloaded state with authentication
//       return {
//         user: {
//           loading: false,
//           isAuthenticated: true,
//           userData: { role: role, email:email, eventId:eventId },
//           error: null
//         }
//       };
//     }
//   } catch (error) {
//     // If there's an error, remove the invalid data
//     localStorage.removeItem('role');
//   }
  
//   // Return default state (not authenticated)
//   return {};
// };

// const store = configureStore({
//     reducer:{
//         user:userReducer,
//         search: searchReducer,
//     },
//     preloadedState: getPreloadedState(),
//     middleware: (getDefaultMiddleware) =>
//         getDefaultMiddleware({
//           serializableCheck: false, // Disable serializability check globally
//         }),
// })
// export default store;

import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../Slice/authSlice";
// import other reducers...

const store = configureStore({
  reducer: {
    auth: authReducer,
    // other reducers...
  },
});

export default store;