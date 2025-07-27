'use client';

import { useChat } from 'ai/react';

export default function TestDeepseek() {
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    api: '/api/chat/openai',
  });
  
  return (
    <div className="flex flex-col w-full max-w-md py-24 mx-auto stretch">
      <h1 className="text-2xl font-bold mb-4">Deepseek 聊天测试</h1>
      
      {messages.map(message => (
        <div key={message.id} className="whitespace-pre-wrap mb-4 p-3 border rounded-lg">
          <div className="font-bold">{message.role === 'user' ? '用户: ' : 'AI: '}</div>
          <div className="mt-1">{message.content}</div>
        </div>
      ))}
      
      <form onSubmit={handleSubmit} className="mt-4">
        <input
          className="w-full p-2 border border-gray-300 rounded shadow-sm dark:bg-gray-800 dark:border-gray-700"
          value={input}
          placeholder="输入消息..."
          onChange={handleInputChange}
        />
        <button 
          type="submit" 
          className="mt-2 w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          发送
        </button>
      </form>
    </div>
  );
}