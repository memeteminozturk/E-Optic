import { configureStore } from '@reduxjs/toolkit';
import opticReducer from './optic/opticSlice';
import templatesReducer from './templates/templateSlicer';

export default configureStore({
    reducer: {
        optic: opticReducer,
        templates: templatesReducer
    },
});