import React, {useEffect, useState} from 'react';
import {Chat} from "@/types/chat";
import {PiChatBold, PiTrashBold} from "react-icons/pi";
import {AiOutlineEdit} from "react-icons/ai";
import {MdCheck, MdClose, MdDeleteOutline} from "react-icons/md";
import {useEventBusContext} from "@/components/EventBusContext";
import {useAppContext} from "@/components/AppContext";
import {ActionType} from "@/reducers/AppReducers";

type Props = {
    item: Chat;
    selected: boolean;
    onSelected: (chat: Chat) => void
}

function ChatItem({item, selected, onSelected}: Props) {
    const [editing, setEditing] = useState(false)
    const [deleting, setDeleting] = useState(false)
    const [title, setTitle] = useState(item.title)
    const { publish } = useEventBusContext()
    const { dispatch } = useAppContext()

    useEffect(() => {
        setEditing(false)
        setDeleting(false)
    }, [selected]);

    const updateChat = async () => {
        const response = await fetch("/api/chat/update", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ id: item.id, title })
        })
        if (!response.ok) {
            console.log(response.statusText)
            return
        }
        const { code } = await response.json()
        if (code === 0) {
            publish("chatList")
            dispatch({
                type: ActionType.UPDATE,
                field: "selectedChat",
                value: null
            })
        }
    }

    async function deleteChat() {
        const response = await fetch(`/api/chat/delete?id=${item.id}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            }
        })
        if (!response.ok) {
            console.log(response.statusText)
            return
        }
        const { code } = await response.json()
        if (code === 0) {
            publish("chatList")
            dispatch({
                type: ActionType.UPDATE,
                field: "selectedChat",
                value: null
            })
        }
    }

    return (
        <li
            onClick={() => {
                onSelected(item)
            }}
            className={`group flex items-center p-3 space-x-3 cursor-pointer rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 ${
                selected ? 'bg-gray-100 dark:bg-gray-800 pr-[3.5em]' : ''
            }`} key={item.id}>
            <div>{ deleting ? <PiTrashBold /> : <PiChatBold/>}</div>
            { editing ? (
                <input
                    autoFocus={true}
                    className={"flex-1 min-w-0 bg-transparent outline-none"}
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                />
            ) : (
                <div className={" relative flex-1 whitespace-nowrap overflow-hidden"}>
                    {item.title}
                    <span
                        className={`group-hover:dark:from-gray-800 absolute right-0 inset-y-0 w-8 bg-gradient-to-l ${
                            selected ? 'from-gray-100 dark:from-gray-800' : 'from-gray-50 dark:from-gray-900'
                        }`}></span>
                </div>
            )}
            {selected && (
                <div className={"absolute right-3 flex"}>
                    {editing || deleting ? <>
                        <button onClick={e => {
                            if (deleting) {
                                deleteChat()
                            } else {
                                updateChat()
                            }
                            setDeleting(false);
                            setEditing(false)
                            e.stopPropagation()
                        }} className={"p-1 hover:dark:bg-gray-700 hover:bg-gray-200"}>
                            <MdCheck/>
                        </button>
                        <button onClick={e => {
                            setDeleting(false)
                            setEditing(false)
                            e.stopPropagation()
                        }} className={"p-1 hover:dark:bg-gray-700 hover:bg-gray-200"}>
                            <MdClose/>
                        </button>
                    </> : <>
                        <button onClick={e => {
                            setEditing(true)
                            e.stopPropagation()
                        }} className={"p-1 hover:dark:bg-gray-700 hover:bg-gray-200"}>
                            <AiOutlineEdit/>
                        </button>
                        <button onClick={e => {
                            setDeleting(true)
                            e.stopPropagation()
                        }} className={"p-1 hover:dark:bg-gray-700 hover:bg-gray-200"}>
                            <MdDeleteOutline/>
                        </button>
                    </>}

                </div>
            )}
        </li>
    );
}

export default ChatItem;
