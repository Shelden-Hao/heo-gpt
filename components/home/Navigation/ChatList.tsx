import React, {useMemo, useState} from 'react';
import {Chat} from "@/types/chat";
import {groupByDate} from "@/common/util";
import ChatItem from "@/components/home/Navigation/ChatItem";

function ChatList() {
    const [chatList, setChatList] = useState<Chat[]>([
        {
            id: '1',
            title: 'chat-gpt 快速精通 chat-gpt 快速精通',
            updateTime: Date.now(),
        },
        {
            id: '2',
            title: 'chat-gpt 快速掌握',
            updateTime: Date.now(),
        },
        {
            id: '3',
            title: 'chat-gpt 快速入门',
            updateTime: Date.now(),
        },
        {
            id: '4',
            title: 'chat-gpt 快速入门',
            updateTime: Date.now(),
        },
        {
            id: '5',
            title: 'chat-gpt 快速入门',
            updateTime: Date.now(),
        },
        {
            id: '6',
            title: 'chat-gpt 快速入门',
            updateTime: Date.now(),
        },
        {
            id: '7',
            title: 'chat-gpt 快速入门',
            updateTime: Date.now(),
        },
        {
            id: '8',
            title: 'chat-gpt 快速入门',
            updateTime: Date.now(),
        },
        {
            id: '9',
            title: 'chat-gpt 快速入门',
            updateTime: Date.now(),
        },
        {
            id: '10',
            title: 'chat-gpt 快速入门',
            updateTime: Date.now(),
        },
        {
            id: '11',
            title: 'chat-gpt 快速入门',
            updateTime: Date.now(),
        },
        {
            id: '12',
            title: 'chat-gpt 快速入门',
            updateTime: Date.now(),
        },
    ])
    const [selectedChat, setSelectedChat] = useState<Chat>()
    const groupList = useMemo(() => {
        return groupByDate(chatList)
    }, [chatList])
    return (
        <div className={'flex-1 mb-[48px] mt-2 flex flex-col overflow-y-auto'}>
            {
                groupList.map(([date, list]) => {
                    return <div key={date}>
                        <div className={"sticky top-0 z-10 p-3 text-sm bg-gray-50 dark:bg-gray-900 text-gray-500"}>
                            {date}
                        </div>
                        <ul>
                            {
                                list.map(item => {
                                    const selected = selectedChat === item
                                    return (
                                        <ChatItem key={item.id} item={item} selected={selected} onSelected={(chat) => {
                                            setSelectedChat(chat)
                                        }} />
                                    )
                                })
                            }
                        </ul>
                    </div>
                })
            }

        </div>
    );
}

export default ChatList;
