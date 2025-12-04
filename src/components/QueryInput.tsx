"use client";

interface QueryInputProps {
  query: string;
  onQueryChange: (newQuery: string) => void;
  onRunQuery: () => void;
  isLoading: boolean;
}

const QueryInput = ({ query, onQueryChange, onRunQuery, isLoading }: QueryInputProps) => {
  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
      <label htmlFor="query-editor" className="block text-lg font-medium text-gray-700 mb-2">
        Cypher Query
      </label>
      <textarea
        id="query-editor"
        value={query}
        onChange={(e) => onQueryChange(e.target.value)}
        className="w-full p-3 font-mono text-sm border rounded-lg border-gray-300 shadow-sm"
        rows={8}
      />
      <button
        onClick={onRunQuery}
        disabled={isLoading || !query.trim()}
        className="mt-4 w-full px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
      >
        {isLoading ? 'Running...' : 'Run Query'}
      </button>
    </div>
  );
};

export default QueryInput;