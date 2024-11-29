"use client";

import React, {createContext, Dispatch, ReactNode, ReducerWithoutAction, useContext, useMemo, useReducer} from 'react';
import {Action, initState, reducer, State} from "@/reducers/AppReducers";


type AppContextProps = {
    state: State
    dispatch: Dispatch<Action>
}

const AppContext = createContext<AppContextProps>(null!)

export function useAppContext() {
    return useContext(AppContext)
}

export default function AppContextProvider({children}: { children: ReactNode }) {
    const [state, dispatch] = useReducer(reducer as ReducerWithoutAction<any>, initState, () => {
        return initState
    })
    const contextValue = useMemo(() => {
        return {state, dispatch}
    }, [state, dispatch])
    return <AppContext.Provider value={contextValue}>
        {children}
    </AppContext.Provider>
}
