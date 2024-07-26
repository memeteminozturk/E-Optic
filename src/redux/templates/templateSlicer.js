import { createSlice } from '@reduxjs/toolkit';
import toast from 'react-hot-toast';

const templateSlice = createSlice({
    name: 'templates',
    initialState: JSON.parse(localStorage.getItem('templates')) || [
        {
            id: 1,
            name: 'KPSS',
            examTime: 3 * 60 * 60 * 1000,
            subjects: [
                { name: "Genel Yetenek", questionCount: 60 },
                { name: "Genel Kültür", questionCount: 60 },
                // { name: "Eğitim Bilimleri", questionCount: 30 },
                // { name: "Alan Bilgisi", questionCount: 30 }
            ],
            questionCount: 120,
            examType: "multiSubject"
        },
        {
            id: 2,
            name: "ALES",
            questionCount: 80,
            examTime: 3 * 60 * 60 * 1000,
            examType: "singleSubject",
        },
        {
            id: 3,
            name: "YDS",
            questionCount: 80,
            examTime: 2 * 60 * 60 * 1000,
            examType: "singleSubject"
        },
        {
            id: 4,
            name: "DGS",
            questionCount: 80,
            examTime: 2 * 60 * 60 * 1000,
            examType: "singleSubject"
        },
        {
            id: 5,
            name: "YKS",
            examTime: 3 * 60 * 60 * 1000,
            examType: "multiSubject",
            subjects: [
                { id: 1, name: "Türk Dili ve Edebiyatı", questionCount: 40 },
                { id: 2, name: "Sosyal Bilimler", questionCount: 40 },
                { id: 3, name: "Temel Matematik", questionCount: 40 },
                { id: 4, name: "Fen Bilimleri", questionCount: 40 }
            ]
        },
    ],
    reducers: {
        addTemplate: (state, action) => {
            action.payload.id = state.length + 1;
            state.push(action.payload);
            localStorage.setItem('templates', JSON.stringify(state));
        },
        removeTemplate: (state, action) => {
            const newState = state.filter((template) => template.id !== action.payload);
            localStorage.setItem('templates', JSON.stringify(newState));
            return newState;
        },
        updateTemplate: (state, action) => {
            const index = state.findIndex((template) => template.id === action.payload.id);
            state[index] = action.payload;
            localStorage.setItem('templates', JSON.stringify(state));
        },
    },
});

export const { addTemplate, removeTemplate, updateTemplate } = templateSlice.actions;
export default templateSlice.reducer;
