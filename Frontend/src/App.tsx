import { useState } from 'react';
import { Header } from './components/Header';
import { PromptForm } from './components/PromptForm';
import { ResponseDisplay } from './components/ResponseDisplay';
import { submitPrompt } from './services/api';

export default function App() {
  const [response, setResponse] = useState('');

  const handleSubmit = async (input: string) => {
    try {
      const result = await submitPrompt(input);
      console.log("result", result);
      
      setResponse(result);
    } catch (error) {
      setResponse(`<div class="text-red-400">Error: ${error instanceof Error ? error.message : 'An error occurred'}</div>`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <Header />
        <PromptForm onSubmit={handleSubmit} />
        <ResponseDisplay content={response} />
      </div>
    </div>
  );
}