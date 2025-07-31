import Button from "@/components/common/Button"
import {PiLightningFill, PiStopBold} from "react-icons/pi"
import {FiSend} from "react-icons/fi"
import TextareaAutoSize from "react-textarea-autosize"
import {useEffect, useRef, useState} from "react";
import {Message, MessageRequestBody} from "@/types/chat";
import {useAppContext} from "@/components/AppContext";
import {ActionType} from "@/reducers/AppReducers";
import {EventListener, useEventBusContext} from "@/components/EventBusContext";

export default function ChatInput() {
    const [messageText, setMessageText] = useState("")
    const stopRef = useRef(false);
    const chatIdRef = useRef("")
    const {
        state: {messageList, currentModel, streamingId, selectedChat},
        dispatch
    } = useAppContext()
    const {publish, subscribe, unsubscribe} = useEventBusContext()

    useEffect(() => {
        if (chatIdRef.current === selectedChat?.id) {
            return
        }
        chatIdRef.current = selectedChat?.id ?? ""
        stopRef.current = true;
    }, [selectedChat]);

    useEffect(() => {
        const callback: EventListener = (data: string) => {
            beforeSend(data)
        }
        subscribe("createNewChat", callback)
        return () => {
            unsubscribe("createNewChat", callback)
        }
    }, [])

    async function createOrUpdateMessage(message: Message) {
        const response = await fetch("/api/message/update", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(message)
        })
        if (!response.ok) {
            console.log(response.statusText)
            return
        }
        const {data} = await response.json()
        if (!chatIdRef.current) {
            chatIdRef.current = data.message.chatId;
            publish("chatList")
            dispatch({
                type: ActionType.UPDATE,
                field: 'selectedChat',
                value: {id: chatIdRef.current}
            })
        }
        return data.message;
    }

    async function deleteMessage(id: string) {
        const response = await fetch(`/api/message/delete?id=${id}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            }
        })
        if (!response.ok) {
            console.log(response.statusText)
            return
        }
        const {code} = await response.json()
        return code === 0
    }

    // 发送前处理
    async function beforeSend(content: string) {
        const message: Message = await createOrUpdateMessage({
            id: "",
            role: "user",
            content,
            chatId: chatIdRef.current
        })
        dispatch({type: ActionType.ADD_MESSAGE, message})
        const messages = messageList.concat([message]);
        send(messages)
        // 如果对话没有标题，则根据第一个问题设置标题
        if (!selectedChat?.title || selectedChat.title === '新对话') {
            updateChatTitle(messages)
        }
    }

    // 更新对话标题
    async function updateChatTitle(messages: Message[]) {
        const message: Message = {
            id: '',
            role: 'user',
            content: "使用5到10个字直接返回这句话的简要主题，不要解释、不要标点、不要语气词、不要多余文本，如果没有主题，请直接返回'新对话'",
            chatId: chatIdRef.current
        }
        const body: MessageRequestBody = {
          messages: [...messages, message],
          model: currentModel,
        };
        let response = await fetch("/api/chat/openai", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        })
        if (!response.ok) {
            console.log(response.statusText)
            return
        }
        if (!response.body) {
            console.log("body error")
            return
        }
        const reader = response.body.getReader()
        const decoder = new TextDecoder()
        // 避免在接收消息过程中切换对话导致id错误，所以这里使用一个变量来存储当前的对话id
        const chatId = chatIdRef.current
        let done = false
        let title = ""
        while (!done) {
            const result = await reader.read()
            done = result.done
            const chunk = decoder.decode(result.value)
            title += chunk;
        }
        response = await fetch("/api/chat/update", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                id: chatId,
                title: title,
            }),
        });
        if (!response.ok) {
            console.log(response.statusText)
            return
        }
        const { code } = await response.json()
        if (code === 0) {
            publish("chatList")
            dispatch({type: ActionType.UPDATE, field: 'selectedChat', value: {id: chatId, title}})
        }
    }

    // 重新发送
    async function resend() {
        const messages = [...messageList];
        const lastMessage = messages[messages.length - 1]
        if (lastMessage.role === 'assistant' && messages.length !== 0) {
            const result = await deleteMessage(lastMessage.id)
            if (!result) {
                console.log("delete error")
                return
            }
            dispatch({type: ActionType.REMOVE_MESSAGE, message: lastMessage});
            messages.splice(messages.length - 1, 1)
        }
        send(messages)
    }

    // 发送
    async function send(messages: Message[]) {
        stopRef.current = false;
        const body: MessageRequestBody = {messages, model: currentModel};
        setMessageText("")
        const controller = new AbortController()
        const response = await fetch("/api/chat/openai", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body),
            signal: controller.signal  // 可以使用 AbortController 取消请求
        })
        if (!response.ok) {
            console.log(response.statusText)
            return
        }
        if (!response.body) {
            console.log("body error")
            return
        }
        const responseMessage: Message = await createOrUpdateMessage({
            id: "",
            role: "assistant",
            content: "",
            chatId: chatIdRef.current
        })
        dispatch({type: ActionType.ADD_MESSAGE, message: responseMessage})
        dispatch({type: ActionType.UPDATE, field: "streamingId", value: responseMessage.id})
        const reader = response.body.getReader()
        const decoder = new TextDecoder()
        let done = false
        let content = ''
        while (!done) {
            if (stopRef.current) {
                controller.abort()
                break
            }
            const result = await reader.read();
            done = result.done
            const chunk = decoder.decode(result.value)
            content += chunk
            dispatch({
                type: ActionType.UPDATE_MESSAGE,
                message: {...responseMessage, content}
            })
        }
        createOrUpdateMessage({
            ...responseMessage,
            content
        })
        dispatch({type: ActionType.UPDATE, field: "streamingId", value: ""})
    }

    return (
        <div
            className='absolute bottom-0 inset-x-0 bg-gradient-to-b from-[rgba(255,255,255,0)] from-[13.94%] to-[#fff] to-[54.73%] pt-10 dark:from-[rgba(53,55,64,0)] dark:to-[#353740] dark:to-[58.85%]'>
            <div className='w-full max-w-4xl mx-auto flex flex-col items-center px-4 space-y-4'>
                {
                    messageList.length !== 0 && (
                        (
                            streamingId !== "" ? (
                                <Button
                                    icon={PiStopBold}
                                    variant='primary'
                                    className='font-medium'
                                    onClick={() => {
                                        stopRef.current = true
                                    }}
                                >
                                    停止生成
                                </Button>
                            ) : (
                                <Button
                                    icon={FiSend}
                                    variant='primary'
                                    className='font-medium'
                                    onClick={resend}
                                >
                                    重新生成
                                </Button>
                            )
                        )

                    )
                }
                <div
                    className='flex items-end w-full border border-black/10 dark:border-gray-800/50 bg-white dark:bg-gray-700 rounded-lg shadow-[0_0_15px_rgba(0,0,0,0.1)] py-4'>
                    <div className='mx-3 mb-2.5'>
                        <PiLightningFill/>
                    </div>
                    <TextareaAutoSize
                        className='outline-none flex-1 max-h-64 mb-1.5 bg-transparent text-black dark:text-white resize-none border-0'
                        placeholder='输入一条消息...'
                        rows={1}
                        value={messageText}
                        onChange={e => {
                            setMessageText(e.target.value)
                        }}
                    />
                    <Button
                        className='mx-3 !rounded-lg'
                        icon={FiSend}
                        variant='primary'
                        disabled={
                            messageText.trim() === "" || streamingId !== ""
                        }
                        onClick={() => beforeSend(messageText)}
                    />
                </div>
                <footer className='text-center text-sm text-gray-700 dark:text-gray-300 px-4 pb-6'>
                    ©️{new Date().getFullYear()}&nbsp;{" "}
                    <a
                        className='font-medium py-[1px] border-b border-dotted border-black/60 hover:border-black/0 dark:border-gray-200 dark:hover:border-gray-200/0 animated-underline'
                        href='https://blog.csdn.net/XiugongHao'
                        target='_blank'
                    >
                        秀秀
                    </a>
                    .&nbsp;基于第三方提供的接口
                </footer>
            </div>
        </div>
    )
}
