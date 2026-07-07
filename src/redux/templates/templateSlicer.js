import { createSlice } from '@reduxjs/toolkit';

// Kalıcı olması için localStorage kullanılır; eski sürümün sessionStorage
// verisi varsa bir kereliğine oradan devralınır.
const loadTemplates = () => {
    try {
        const raw = localStorage.getItem('templates') || sessionStorage.getItem('templates');
        return raw ? JSON.parse(raw) : null;
    } catch {
        return null;
    }
};

const persistTemplates = (templates) => {
    localStorage.setItem('templates', JSON.stringify(templates));
};

const templateSlice = createSlice({
    name: 'templates',
    initialState: loadTemplates() || [
        {
            id: 1,
            name: 'KPSS',
            examTime: 130 * 60 * 1000,
            subjects: [
                { name: "Genel Yetenek", questionCount: 60 },
                { name: "Genel Kültür", questionCount: 60 },
            ],
            questionCount: 120,
            examType: "multiSubject",
            penaltyDivisor: 4
        },
        {
            id: 2,
            name: "TYT",
            examTime: 165 * 60 * 1000,
            examType: "multiSubject",
            penaltyDivisor: 4,
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
            penaltyDivisor: 4,
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
            penaltyDivisor: 3,
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
            penaltyDivisor: 3,
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
            examType: "singleSubject",
            penaltyDivisor: 0
        },
        {
            id: 7,
            name: "ALES",
            examTime: 150 * 60 * 1000,
            examType: "multiSubject",
            penaltyDivisor: 4,
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
            penaltyDivisor: 4,
            subjects: [
                { id: 1, name: "Sözel", questionCount: 50 },
                { id: 2, name: "Sayısal", questionCount: 50 }
            ]
        },
        {
            id: 9,
            name: "AGS",
            examTime: 110 * 60 * 1000,
            examType: "singleSubject",
            questionCount: 80,
            penaltyDivisor: 4
        }
    ],
    reducers: {
        addTemplate: (state, action) => {
            action.payload.id = state.length + 1;
            state.push(action.payload);
            persistTemplates(state);
        },
        removeTemplate: (state, action) => {
            const newState = state.filter((template) => template.id !== action.payload);
            persistTemplates(newState);
            return newState;
        },
        updateTemplate: (state, action) => {
            const index = state.findIndex((template) => template.id === action.payload.id);
            state[index] = action.payload;
            persistTemplates(state);
        },
    },
});

export const { addTemplate, removeTemplate, updateTemplate } = templateSlice.actions;
export default templateSlice.reducer;
