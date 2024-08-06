// app/store/contentSlice.js

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { addContent, getAllContents, updateContent, deleteContent } from '../utils/db';

export const fetchContents = createAsyncThunk(
    'content/fetchContents',
    async () => {
        return await getAllContents();
    }
);

export const addNewContent = createAsyncThunk(
    'content/addNewContent',
    async ({ fileName, content, creator }) => {
        return await addContent(fileName, content, creator);
    }
);

export const updateExistingContent = createAsyncThunk(
    'content/updateExistingContent',
    async ({ id, content, creator }) => {
        return await updateContent(id, { content, creator });
    }
);

export const deleteExistingContent = createAsyncThunk(
    'content/deleteExistingContent',
    async (id) => {
        await deleteContent(id);
        return id;
    }
);

const contentSlice = createSlice({
    name: 'content',
    initialState: {
        contents: [],
        status: 'idle',
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchContents.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchContents.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.contents = action.payload;
            })
            .addCase(fetchContents.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(addNewContent.fulfilled, (state, action) => {
                state.contents.push(action.payload);
            })
            .addCase(updateExistingContent.fulfilled, (state, action) => {
                const index = state.contents.findIndex(content => content.id === action.payload.id);
                if (index !== -1) {
                    state.contents[index] = action.payload;
                }
            })
            .addCase(deleteExistingContent.fulfilled, (state, action) => {
                state.contents = state.contents.filter(content => content.id !== action.payload);
            });
    },
});

export default contentSlice.reducer;