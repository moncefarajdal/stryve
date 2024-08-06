import { createSlice } from '@reduxjs/toolkit';

const sessionSlice = createSlice({
    name: 'session',
    initialState: {
        user: null,
        role: null,
    },
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload;
        },
        setRole: (state, action) => {
            state.role = action.payload;
        },
        clearSession: (state) => {
            state.user = null;
            state.role = null;
        },
    },
});

export const { setUser, setRole, clearSession } = sessionSlice.actions;
export default sessionSlice.reducer;