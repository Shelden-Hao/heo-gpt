import prisma from "@/lib/prisma";
import {NextRequest, NextResponse} from "next/server";

export async function POST(request: NextRequest) {
    const body = await request.json()
    const {id, ...data} = body
    if (!data.chatId) {
        const chat = await prisma.chat.create({
            data: {
                title: "新对话"
            }
        })
        data.chatId = chat.id
    } else {
        await prisma.chat.update({
            where: {
                id: data.chatId
            },
            data: {
                updateTime: new Date()
            }
        })
    }
    // upsert 方法就是用于创建或更新记录
    const message = await prisma.message.upsert({
        create: data,
        update: data,
        where: {
            id
        }
    })
    return NextResponse.json({code: 0, data: {message}})
}
