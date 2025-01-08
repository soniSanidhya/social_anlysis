import { BrainCog } from 'lucide-react';

export function Header() {
  return (
    <div className="text-center mb-12">
      <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-transparent bg-clip-text animate-gradient flex items-center justify-center gap-2">
        <BrainCog className="h-8 w-8" />
        Langflow Client
      </h1>
      <p className="text-gray-400">Interact with your AI models seamlessly</p>
    </div>
  );
}