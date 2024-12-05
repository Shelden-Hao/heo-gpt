import { sleep } from "@/common/util";
import { NextRequest } from "next/server";
import {MessageRequestBody} from "@/types/chat";

/**
 * 异步POST函数，用于处理POST请求
 * 特别适用于处理长文本消息的流式传输
 *
 * @param request NextRequest类型的请求对象，包含客户端发送的请求信息
 * @returns 返回一个流式的Response对象，用于响应客户端请求
 */
export async function POST(request: NextRequest) {
    // 从请求的JSON数据中提取messageText字段
    const { messages } = (await request.json()) as MessageRequestBody;
    // 创建一个TextEncoder实例，用于将文本数据编码为Uint8Array格式
    const encoder = new TextEncoder()
    // 创建一个ReadableStream实例，用于逐步提供文本数据
    const stream = new ReadableStream({
        // 启动函数，用于处理数据流
        async start(controller) {
            const messageText = messages[messages.length - 1].content
            // 遍历messageText中的每个字符
            for (let i = 0; i < messageText.length; i++) {
                // 每次循环前暂停100毫秒，模拟数据流的逐步生成
                await sleep(100)

                // 将当前字符编码后添加到流中
                controller.enqueue(encoder.encode(messageText[i]))
            }

            // 所有字符处理完毕后，关闭流
            controller.close()
        }
    })
    // 返回包含数据流的Response对象
    return new Response(stream)
}
