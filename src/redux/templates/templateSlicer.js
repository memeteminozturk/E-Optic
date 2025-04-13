import { createSlice } from '@reduxjs/toolkit';
import toast from 'react-hot-toast';

const templateSlice = createSlice({
    name: 'templates',
    initialState: JSON.parse(sessionStorage.getItem('templates')) || [
        {
            id: 1,
            name: 'KPSS',
            examTime: 130 * 60 * 1000,
            subjects: [
                { name: "Genel Yetenek", questionCount: 60 },
                { name: "Genel Kültür", questionCount: 60 },
            ],
            questionCount: 120,
            examType: "multiSubject"
        },
        {
            id: 2,
            name: "TYT",
            examTime: 165 * 60 * 1000,
            examType: "multiSubject",
            subjects: [
                { id: 1, name: "Türkçe", questionCount: 40 },
                { id: 2, name: "Sosyal Bilimler", questionCount: 20 },
                { id: 3, name: "Temel Matematik", questionCount: 40 },
                { id: 4, name: "Fen Bilimleri", questionCount: 20 }
            ]
        },
        {
            id: 3,
            name: "AYT",
            examTime: 180 * 60 * 1000,
            examType: "multiSubject",
            subjects: [
                { id: 1, name: "Türk Dili ve Edebiyatı", questionCount: 40 },
                { id: 2, name: "Sosyal Bilimler-1", questionCount: 40 },
                { id: 3, name: "Matematik", questionCount: 40 },
                { id: 4, name: "Fen Bilimleri", questionCount: 40 }
            ]
        },
        {
            id: 4,
            name: "LGS - Sözel",
            examTime: 75 * 60 * 1000,
            examType: "multiSubject",
            subjects: [
                { id: 1, name: "Türkçe", questionCount: 20 },
                { id: 2, name: "T.C. İnkılap Tarihi ve Atatürkçülük", questionCount: 10 },
                { id: 3, name: "Din Kültürü ve Ahlak Bilgisi", questionCount: 10 },
                { id: 4, name: "İngilizce", questionCount: 10 }
            ]
        },
        {
            id: 5,
            name: "LGS - Sayısal",
            examTime: 80 * 60 * 1000,
            examType: "multiSubject",
            subjects: [
                { id: 1, name: "Matematik", questionCount: 20 },
                { id: 2, name: "Fen Bilimleri", questionCount: 20 }
            ]
        },
        {
            id: 6,
            name: "YDS",
            questionCount: 80,
            examTime: 180 * 60 * 1000,
            examType: "singleSubject"
        },
        {
            id: 7,
            name: "ALES",
            examTime: 150 * 60 * 1000,
            examType: "multiSubject",
            subjects: [
                { id: 1, name: "Sözel", questionCount: 50 },
                { id: 2, name: "Sayısal", questionCount: 50 }
            ]

        },
        {
            id: 8,
            name: "DGS",
            examTime: 135 * 60 * 1000,
            examType: "multiSubject",
            subjects: [
                { id: 1, name: "Sözel", questionCount: 50 },
                { id: 2, name: "Sayısal", questionCount: 50 }
            ]
        },
    ],
    reducers: {
        addTemplate: (state, action) => {
            action.payload.id = state.length + 1;
            state.push(action.payload);
            sessionStorage.setItem('templates', JSON.stringify(state));
        },
        removeTemplate: (state, action) => {
            const newState = state.filter((template) => template.id !== action.payload);
            sessionStorage.setItem('templates', JSON.stringify(newState));
            return newState;
        },
        updateTemplate: (state, action) => {
            const index = state.findIndex((template) => template.id === action.payload.id);
            state[index] = action.payload;
            sessionStorage.setItem('templates', JSON.stringify(state));
        },
    },
});

export const { addTemplate, removeTemplate, updateTemplate } = templateSlice.actions;
export default templateSlice.reducer;
