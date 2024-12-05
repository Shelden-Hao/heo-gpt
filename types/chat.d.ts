export interface Chat {
    id: string;
    title: string;
    updateTime: number;
}

export interface Message {
    id: string
    role: "user" | "assistant" // 区别用户还是chatgpt
    content: string
}

export interface MessageRequestBody {
    messages: Message[]
    model: string
}
