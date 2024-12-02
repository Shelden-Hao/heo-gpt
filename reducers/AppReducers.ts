import {ReducerWithoutAction} from "react";

export type State = {
    displayNavigation: boolean;
    themeMode: 'light' | 'dark';
    currentModel: string
};

export enum ActionType {
    UPDATE = "UPDATE"
}

type UpdateAction = {
    type: ActionType.UPDATE;
    field: string;
    value: any;
}

export type Action = UpdateAction;

export const initState: State = {
    displayNavigation: true,
    themeMode: 'light',
    currentModel: 'gpt-3.5-turbo'
}

export function reducer(state: State, action: Action) {
    switch (action.type) {
        case ActionType.UPDATE:
            return {...state, [action.field]: action.value}
        default:
            throw new Error(`Unhandled action type: ${action.type}`)
    }
}
