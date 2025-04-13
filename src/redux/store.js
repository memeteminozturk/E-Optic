import { configureStore } from '@reduxjs/toolkit';
import opticReducer from './optic/opticSlice';
import templatesReducer from './templates/templateSlicer';
import { localStorageMiddleware } from './middleware/localStorageMiddleware';
import { loadOpticState } from '../helpers/localStorage';

const preloadedOpticState = loadOpticState();

export default configureStore({
    reducer: {
        optic: opticReducer,
        templates: templatesReducer
    },
    preloadedState: {
        optic: preloadedOpticState || undefined,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(localStorageMiddleware),
});