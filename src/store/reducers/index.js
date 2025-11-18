// src/store/index.js (Redux store)
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./reducers/authReducer";
// import projectReducer from './reducers/projectReducer'; // If you create more reducers

const store = configureStore({
    reducer: {
        auth: authReducer,
        // projects: projectReducer,
    },
});

export default store;
