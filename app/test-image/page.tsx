'use client';

import { useState } from 'react';

export default function TestImageGeneration() {
  const [prompt, setPrompt] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePromptChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPrompt(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setIsLoading(true);
    setError(null);
    setImageUrl('');

    try {
      const response = await fetch('/api/image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setImageUrl(data.imageUrl);

    } catch (error) {
      console.error('Image generation error:', error);
      setError(error instanceof Error ? error.message : '发生未知错误');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col w-full max-w-4xl py-24 mx-auto stretch">
      <h1 className="text-2xl font-bold mb-4">图片生成测试</h1>
      
      <form onSubmit={handleSubmit} className="mt-4">
        <input
          className="w-full p-2 border border-gray-300 rounded shadow-sm dark:bg-gray-800 dark:border-gray-700"
          value={prompt}
          placeholder="输入图片描述..."
          onChange={handlePromptChange}
          disabled={isLoading}
        />
        <button 
          type="submit" 
          className="mt-2 w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
          disabled={isLoading || !prompt.trim()}
        >
          {isLoading ? '生成中...' : '生成图片'}
        </button>
      </form>

      {error && (
        <div className="mt-4 p-4 border border-red-500 bg-red-50 rounded-lg">
          <div className="font-bold text-red-700">错误:</div>
          <div className="mt-1 text-red-600">{error}</div>
        </div>
      )}

      {isLoading && (
        <div className="mt-4 text-center">
          <p>正在生成图片，请稍候...</p>
        </div>
      )}

      {imageUrl && (
        <div className="mt-4">
          <h2 className="text-xl font-bold mb-2">生成的图片:</h2>
          <img src={imageUrl} alt="Generated Image" className="max-w-full h-auto rounded-lg" />
        </div>
      )}
    </div>
  );
}