import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    theme: 0, // 0 is dark theme, 1 is light theme
    fontSize : 16,
    sideBar : false
};

export const editorSlice = createSlice({
    name: "editorOptions",
    initialState,
    reducers: {
        setTheme: (state, action) => {
            const theme = action.payload;
            state.theme = theme;
        },
        setFont: (state, action) => {
            const fontSize = action.payload;
            state.fontSize = fontSize;
        },
        setSideBar: (state, action) => {
            const sidebar = action.payload;
            state.sideBar = sidebar;
        },
    },
});

export const { setTheme, setFont, setSideBar } = editorSlice.actions;

export default editorSlice.reducer;