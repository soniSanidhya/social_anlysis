interface ResponseDisplayProps {
  content: string;
}

export function ResponseDisplay({ content }: ResponseDisplayProps) {
  return (
    <div className="bg-gray-800 rounded-xl shadow-2xl p-8">
      <h2 className="text-xl font-semibold mb-4 text-gray-200">Response</h2>
      <div 
        className="prose prose-invert max-w-none"
        dangerouslySetInnerHTML={{ __html: content || '<div class="text-gray-400 italic">Your response will appear here...</div>' }}
      />
    </div>
  );
}