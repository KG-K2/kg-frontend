"use client";

import ViewSwitcher, { ViewMode } from './ViewSwitcher';
import TableView from './TableView';
import RawView from './RawView';

export type QueryResultData = {
  result?: Record<string, any>[] | Record<string, any> | null;
  error?: string;
} | null;

interface ResultsPanelProps {
  result: QueryResultData;
  isLoading: boolean;
  error: string | null;
  viewMode: ViewMode;
  onViewModeChange: (view: ViewMode) => void;
}

const ResultsPanel = ({ result, isLoading, error, viewMode, onViewModeChange }: ResultsPanelProps) => {
  const renderContent = () => {
    console.log(result)
    if (isLoading) return <div className="text-center p-8">Running query...</div>;
    if (error || result?.error) {
      return <div className="m-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
        <h3 className="font-bold">Error</h3>
        <pre className="whitespace-pre-wrap wrap-break-words">{result?.error || error}</pre>
      </div>
    }
    if (result === null) return <div className="text-center p-8 text-gray-500">Run query to see result.</div>;

    if (!Array.isArray(result)) {    
        return <pre className="p-4 bg-gray-800 text-white text-sm rounded-b-lg overflow-x-auto">{JSON.stringify(result, null, 2)}</pre>;
    }
    
    switch (viewMode) {
      case 'table':
        return <TableView data={result} />;
      case 'raw':
        return <RawView data={result} />
      default:
        return <pre className="p-4 text-xs">{JSON.stringify(result, null, 2)}</pre>;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 flex flex-col">
      <div className="p-4 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-lg font-medium text-gray-700">Result</h2>
        {result && Array.isArray(result) && (
          <ViewSwitcher 
            currentView={viewMode}
            onViewChange={onViewModeChange}
            availableViews={['table', 'raw']}
          />
        )}
      </div>
      <div className="result-panel grow overflow-y-auto">
        {renderContent()}
      </div>
    </div>
  );
};

export default ResultsPanel;