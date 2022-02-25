import { createContext, useContext, SetStateAction, Dispatch, useEffect } from 'react';

export const NotebookContext = createContext([
    null, () => {
        throw new Error('setContext function must be overriden');
    }
]);