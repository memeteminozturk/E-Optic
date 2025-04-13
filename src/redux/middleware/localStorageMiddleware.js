export const localStorageMiddleware = store => next => action => {
    const result = next(action);

    if (action.type.startsWith('optic/')) {
        const opticState = store.getState().optic;
        try {
            localStorage.setItem('optic', JSON.stringify(opticState));
        } catch (error) {
            console.error('Could not save optic state:', error);
        }
    }

    return result;
};
