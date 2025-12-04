"use client";

export type ViewMode = 'table' | 'raw';

interface ViewSwitcherProps {
  currentView: ViewMode;
  onViewChange: (view: ViewMode) => void;
  availableViews: ViewMode[];
}

const ViewSwitcher = ({ currentView, onViewChange, availableViews }: ViewSwitcherProps) => {
  return (
    <div className="flex items-center space-x-2">
      {availableViews.map((mode) => (
        <button
          key={mode}
          onClick={() => onViewChange(mode)}
          className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
            currentView === mode
              ? 'bg-blue-600 text-white shadow-sm'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          {mode.charAt(0).toUpperCase() + mode.slice(1)}
        </button>
      ))}
    </div>
  );
};

export default ViewSwitcher;