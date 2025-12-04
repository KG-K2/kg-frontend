"use client";

import { useState } from 'react';
import QueryInput from '../../components/QueryInput';
import ResultsPanel, { QueryResultData } from '../../components/ResultPanel';
import { ViewMode } from '../../components/ViewSwitcher';

const QueryEditorPage = () => {
  const [query, setQuery] = useState<string>("MATCH (a:Artwork) RETURN a LIMIT 5");
  const [result, setResult] = useState<QueryResultData>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('table');

  const handleRunQuery = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch(process.env.NEXT_PUBLIC_API_URL+'/run-query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ query }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.detail || `Request failed with status ${response.status}`);
      }

      const resultData = data.result;
      setResult(resultData);
      if (Array.isArray(resultData)) {
        setViewMode('table');
      } else {
        setViewMode('raw');
      }

    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white shadow-sm p-4">
        <h1 className="text-2xl font-bold text-gray-800">Query Editor</h1>
      </header>
      <main className="grow container mx-auto p-4 md:p-6 grid grid-cols-1 gap-6">
        <QueryInput
          query={query}
          onQueryChange={setQuery}
          onRunQuery={handleRunQuery}
          isLoading={loading}
        />
        <ResultsPanel
          result={result}
          isLoading={loading}
          error={error}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
        />
      </main>
    </div>
  );
};

export default QueryEditorPage;