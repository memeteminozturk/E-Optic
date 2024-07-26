import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import toast from 'react-hot-toast';


export const setOpticAsync = createAsyncThunk(
    'optic/setOpticAsync',
    async (payload, { rejectWithValue }) => {
        const { questionCount, examTime, name, subjects, examType } = payload;

        if (questionCount < 1 || questionCount > 200) {
            return rejectWithValue("Soru sayısı 1 ile 200 arasında olmalıdır.");
        } else if (examTime < 60 * 1000 || examTime > 300 * 60 * 1000) {
            return rejectWithValue("Sınav süresi 1 ile 300 dakika arasında olmalıdır.");
        } else if (name.length < 3 || name.length > 50) {
            return rejectWithValue("Sınav adı 3 ile 50 karakter arasında olmalıdır.");
        } else if (subjects?.length < 1) {
            return rejectWithValue("En az bir ders seçmelisiniz.");
        } else if (subjects?.some((subject) => subject.questionCount < 1 || subject.questionCount > 120)) {
            return rejectWithValue("Derslerin soru sayısı 1 ile 120 arasında olmalıdır.");
        }

        return payload;
    }
);


const opticSlice = createSlice({
    name: 'optic',
    initialState: {
        name: 'KPSS',
        examTime: 3 * 60 * 60 * 1000,
        subjects: [
            { id: 1, name: "Genel Yetenek", questionCount: 60 },
            { id: 2, name: "Genel Kültür", questionCount: 60 }
        ],
        examType: "multiSubject",
    },
    reducers: {
    },
    extraReducers: (builder) => {
        builder
            .addCase(setOpticAsync.fulfilled, (state, action) => {
                const { questionCount, examTime, name, subjects, examType } = action.payload;
                state.name = name;
                state.questionCount = questionCount;
                state.examTime = examTime;
                state.subjects = subjects;
                state.examType = examType;
                state.error = null;
                toast.success("Ayarlar başarıyla güncellendi.");
            })
            .addCase(setOpticAsync.rejected, (state, action) => {
                state.error = action.payload;
            });
    }
});

export const { } = opticSlice.actions;
export default opticSlice.reducer;