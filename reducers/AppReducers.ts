import {ReducerWithoutAction} from "react";
import {Chat, Message} from "@/types/chat";

export type State = {
    displayNavigation: boolean;
    themeMode: 'light' | 'dark';
    currentModel: string
    messageList: Message[];
    streamingId: string;
    selectedChat?: Chat
};

export enum ActionType {
    UPDATE = "UPDATE",
    ADD_MESSAGE = "ADD_MESSAGE",
    UPDATE_MESSAGE = "UPDATE_MESSAGE",
    REMOVE_MESSAGE = "REMOVE_MESSAGE",
}

type MessageAction = {
    type: ActionType.ADD_MESSAGE | ActionType.UPDATE_MESSAGE | ActionType.REMOVE_MESSAGE;
    message: Message;
}

type UpdateAction = {
    type: ActionType.UPDATE;
    field: string;
    value: any;
}

export type Action = UpdateAction | MessageAction;

export const initState: State = {
    displayNavigation: true,
    themeMode: 'light',
    currentModel: 'Qwen/QwQ-32B',
    messageList: [],
    streamingId: ""
}

export function reducer(state: State, action: Action) {
    switch (action.type) {
        case ActionType.UPDATE:
            return {...state, [action.field]: action.value}
        case ActionType.ADD_MESSAGE: {
            const messageList = state.messageList.concat([action.message]);
            return {...state, messageList}
        }
        case ActionType.UPDATE_MESSAGE: {
            const messageList = state.messageList.map(message => message.id === action.message.id ? action.message : message);
            return {...state, messageList}
        }
        case ActionType.REMOVE_MESSAGE: {
            const messageList = state.messageList.filter(message => message.id !== action.message.id);
            return {...state, messageList}
        }
        default:
            throw new Error()
    }
}
