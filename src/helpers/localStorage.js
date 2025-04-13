export const loadOpticState = () => {
    try {
        const serializedState = localStorage.getItem('optic');
        if (serializedState === null) {
            return undefined;  // No state saved
        }
        return JSON.parse(serializedState);
    } catch (error) {
        console.error('Could not load optic state:', error);
        return undefined;
    }
};
