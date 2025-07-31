"use client";

import { useState } from "react";
import Markdown from "../../components/common/Markdown";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

export default function TestChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/chat/openai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [...messages, userMessage].map((msg) => ({
            role: msg.role,
            content: msg.content,
          })),
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.text();

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: result,
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("Chat error:", error);
      setError(error instanceof Error ? error.message : "发生未知错误");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col w-full max-w-4xl py-24 mx-auto stretch">
      <h1 className="text-2xl font-bold mb-4">对话测试</h1>

      {error && (
        <div className="mb-4 p-4 border border-red-500 bg-red-50 rounded-lg">
          <div className="font-bold text-red-700">错误:</div>
          <div className="mt-1 text-red-600">{error}</div>
        </div>
      )}

      <div className="flex flex-col space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`mb-4 p-4 border rounded-lg ${
              message.role === "user"
                ? "bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800"
                : "bg-gray-50 border-gray-200 dark:bg-gray-900/20 dark:border-gray-800"
            }`}
          >
            <div className="font-bold mb-2">
              {message.role === "user" ? "用户: " : "AI: "}
            </div>
            <div className="mt-1">
              <Markdown>{message.content}</Markdown>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="mb-4 p-4 border rounded-lg bg-gray-50 dark:bg-gray-900/20">
            <div className="font-bold mb-2">AI:</div>
            <div className="mt-1 text-gray-500">正在思考中...</div>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="mt-4">
        <input
          className="w-full p-2 border border-gray-300 rounded shadow-sm dark:bg-gray-800 dark:border-gray-700"
          value={input}
          placeholder="输入消息..."
          onChange={handleInputChange}
          disabled={isLoading}
        />
        <button
          type="submit"
          className="mt-2 w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
          disabled={isLoading || !input.trim()}
        >
          {isLoading ? "发送中..." : "发送"}
        </button>
      </form>
    </div>
  );
}
