import { useState } from 'react';
import { LoadingSpinner } from '../LoadingSpinner';

interface PromptFormProps {
  onSubmit: (input: string) => Promise<void>;
}

export function PromptForm({ onSubmit }: PromptFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await onSubmit(inputValue);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-800 rounded-xl shadow-2xl p-8 mb-8">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="inputValue" className="block text-sm font-medium text-gray-300 mb-2">
            Enter your prompt
          </label>
          <div className="relative">
            <input 
              type="text" 
              id="inputValue"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              required
              className="block w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-100 placeholder-gray-400"
              placeholder="Type your message here..."
            />
          </div>
        </div>
        <button 
          type="submit"
          disabled={isLoading}
          className="w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium rounded-lg transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {isLoading ? (
            <>
              <LoadingSpinner />
              Processing...
            </>
          ) : (
            'Generate Response'
          )}
        </button>
      </form>
    </div>
  );
}