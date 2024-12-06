import React, {useEffect, useMemo, useRef, useState} from 'react';
import {Chat} from "@/types/chat";
import {groupByDate} from "@/common/util";
import ChatItem from "@/components/home/Navigation/ChatItem";
import {useEventBusContext} from "@/components/EventBusContext";
import {useAppContext} from "@/components/AppContext";
import {ActionType} from "@/reducers/AppReducers";

function ChatList() {
    // const [chatList, setChatList] = useState<Chat[]>([
    //     {
    //         id: '1',
    //         title: 'chat-gpt 快速精通 chat-gpt 快速精通',
    //         updateTime: Date.now(),
    //     },
    //     {
    //         id: '2',
    //         title: 'chat-gpt 快速掌握',
    //         updateTime: Date.now(),
    //     },
    //     {
    //         id: '3',
    //         title: 'chat-gpt 快速入门',
    //         updateTime: Date.now(),
    //     },
    //     {
    //         id: '4',
    //         title: 'chat-gpt 快速入门',
    //         updateTime: Date.now(),
    //     },
    //     {
    //         id: '5',
    //         title: 'chat-gpt 快速入门',
    //         updateTime: Date.now(),
    //     },
    //     {
    //         id: '6',
    //         title: 'chat-gpt 快速入门',
    //         updateTime: Date.now(),
    //     },
    //     {
    //         id: '7',
    //         title: 'chat-gpt 快速入门',
    //         updateTime: Date.now(),
    //     },
    //     {
    //         id: '8',
    //         title: 'chat-gpt 快速入门',
    //         updateTime: Date.now(),
    //     },
    //     {
    //         id: '9',
    //         title: 'chat-gpt 快速入门',
    //         updateTime: Date.now(),
    //     },
    //     {
    //         id: '10',
    //         title: 'chat-gpt 快速入门',
    //         updateTime: Date.now(),
    //     },
    //     {
    //         id: '11',
    //         title: 'chat-gpt 快速入门',
    //         updateTime: Date.now(),
    //     },
    //     {
    //         id: '12',
    //         title: 'chat-gpt 快速入门',
    //         updateTime: Date.now(),
    //     },
    // ])
    const [chatList, setChatList] = useState<Chat[]>([])
    const pageRef = useRef(1);
    const groupList = useMemo(() => {
        return groupByDate(chatList)
    }, [chatList])
    const {subscribe, unsubscribe} = useEventBusContext()
    const {state: {selectedChat}, dispatch} = useAppContext()

    async function getData() {
        const response = await fetch(`/api/chat/list?page=${pageRef.current}`, {
            method: "GET"
        })
        if (!response.ok) {
            console.log(response.statusText)
            return
        }
        const {data} = await response.json()
        if (pageRef.current === 1) {
            setChatList(data.list)
        } else {
            setChatList((list) => list.concat(data.list))
        }
    }

    useEffect(() => {
        getData()
    }, []);
    useEffect(() => {
        const callback: EventListener = () => {
            pageRef.current = 1;
            getData()
        }
        subscribe('chatList', callback)
        return () => {
            unsubscribe('chatList', callback)
        }
    }, []);

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
                                    const selected = selectedChat?.id === item?.id
                                    return (
                                        <ChatItem key={item.id} item={item} selected={selected} onSelected={(chat) => {
                                            dispatch({
                                                type: ActionType.UPDATE,
                                                field: "selectedChat",
                                                value: chat
                                            })
                                        }}/>
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
