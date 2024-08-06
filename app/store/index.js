import { configureStore } from '@reduxjs/toolkit';
import sessionReducer from './sessionSlice';
import contentReducer from './contentSlice';

export const store = configureStore({
    reducer: {
        session: sessionReducer,
        content: contentReducer,
    },
});