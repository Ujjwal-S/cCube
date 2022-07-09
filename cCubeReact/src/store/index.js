import { configureStore } from '@reduxjs/toolkit'
import editor from './editorSlice'

export const store = configureStore({
    reducer: {
        editor
    },
})