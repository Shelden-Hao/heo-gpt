import React, {useEffect, useState} from 'react';
import {Chat} from "@/types/chat";
import {PiChatBold, PiTrashBold} from "react-icons/pi";
import {AiOutlineEdit} from "react-icons/ai";
import {MdCheck, MdClose, MdDeleteOutline} from "react-icons/md";

type Props = {
    item: Chat;
    selected: boolean;
    onSelected: (chat: Chat) => void
}

function ChatItem({item, selected, onSelected}: Props) {
    const [editing, setEditing] = useState(false)
    const [deleting, setDeleting] = useState(false)
    useEffect(() => {
        setEditing(false)
        setDeleting(false)
    }, [selected]);
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
                    defaultValue={item.title}
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
                                console.log("delete")
                            } else {
                                console.log("edit")
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
