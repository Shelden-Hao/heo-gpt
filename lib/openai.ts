import { Message } from '@/types/chat';
import { NextResponse } from 'next/server';
import OpenAI from 'openai';

/**
 * 处理图片生成请求的函数
 * 使用SiliconFlow API生成图片并返回响应
 * 
 * @param prompt 图片描述
 * @returns 包含图片URL的响应
 */
export async function handleImageRequest(prompt: string) {
  try {
    if (!process.env.SILICONFLOW_API_KEY) {
      console.error('SiliconFlow API密钥未配置');
      return NextResponse.json(
        { error: '未配置SiliconFlow API密钥，请在.env文件中设置SILICONFLOW_API_KEY' },
        { status: 500 }
      );
    }

    if (!process.env.SILICONFLOW_API_BASE) {
      console.error('SiliconFlow API基础URL未配置');
      return NextResponse.json(
        { error: '未配置SiliconFlow API基础URL，请在.env文件中设置SILICONFLOW_API_BASE' },
        { status: 500 }
      );
    }

    const response = await openai.images.generate({
      model: 'Kwai-Kolors/Kolors',
      prompt: prompt,
      n: 1,
      size: '1024x1024',
    });

    const imageUrl = response.data?.[0]?.url;
    return NextResponse.json({ imageUrl });

  } catch (error) {
    console.error('SiliconFlow API调用错误:', error);
    return NextResponse.json(
      { error: '调用SiliconFlow API时发生错误: ' + (error instanceof Error ? error.message : String(error)) },
      { status: 500 }
    );
  }
}

// 创建自定义OpenAI实例，使用SiliconFlow API
const openai = new OpenAI({
  apiKey: process.env.SILICONFLOW_API_KEY!,
  baseURL: process.env.SILICONFLOW_API_BASE!,  
});

/**
 * 处理聊天请求的函数
 * 使用SiliconFlow API处理消息并返回流式响应
 * 
 * @param messages 聊天消息数组
 * @returns 流式响应
 */
export async function handleChatRequest(messages: Message[]) {
  try {
    // 检查API密钥是否配置
    if (!process.env.SILICONFLOW_API_KEY) {
      console.error('SiliconFlow API密钥未配置');
      return NextResponse.json(
        { error: '未配置SiliconFlow API密钥，请在.env文件中设置SILICONFLOW_API_KEY' },
        { status: 500 }
      );
    }

    // 检查API基础URL是否配置
    if (!process.env.SILICONFLOW_API_BASE) {
      console.error('SiliconFlow API基础URL未配置');
      return NextResponse.json(
        { error: '未配置SiliconFlow API基础URL，请在.env文件中设置SILICONFLOW_API_BASE' },
        { status: 500 }
      );
    }

    // 将消息格式转换为OpenAI格式
    const formattedMessages = messages.map(msg => ({
      role: msg.role,
      content: msg.content
    }));
    
    // 使用SiliconFlow API创建流式响应
    const response = await openai.chat.completions.create({
      model: 'Qwen/QwQ-32B', // 使用SiliconFlow提供的QwQ-32B模型
      messages: formattedMessages,
      stream: true,
    });
    
    // 创建并返回流式响应
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        // 处理流式响应
        for await (const chunk of response) {
          const text = chunk.choices[0]?.delta?.content || '';
          if (text) {
            controller.enqueue(encoder.encode(text));
          }
        }
        controller.close();
      },
    });
    
    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache',
      },
    });
  } catch (error) {
    console.error('SiliconFlow API调用错误:', error);
    return NextResponse.json(
      { error: '调用SiliconFlow API时发生错误: ' + (error instanceof Error ? error.message : String(error)) },
      { status: 500 }
    );
  }
}