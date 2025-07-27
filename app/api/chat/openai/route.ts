import { handleChatRequest } from '@/lib/openai';
import { NextRequest, NextResponse } from 'next/server';
import { MessageRequestBody } from '@/types/chat';

// 设置最大响应时间为30秒
export const maxDuration = 30;

/**
 * 处理POST请求，使用QwQ-32B模型进行聊天
 * 
 * @param request NextRequest请求对象
 * @returns 返回流式响应
 */
export async function POST(request: NextRequest) {
  try {
    // 从请求中获取消息数据
    const { messages } = (await request.json()) as MessageRequestBody;
    
    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: '无效的消息格式' },
        { status: 400 }
      );
    }
    
    // 调用QwQ-32B处理函数并返回流式响应
    return handleChatRequest(messages);
  } catch (error) {
    console.error('处理QwQ-32B请求时出错:', error);
    return NextResponse.json(
      { error: '处理请求时发生错误: ' + (error instanceof Error ? error.message : String(error)) },
      { status: 500 }
    );
  }
}