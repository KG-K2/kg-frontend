"use client";

interface RawViewProps {
  data: any; 
}

const RawView = ({ data }: RawViewProps) => {
  return (
    <pre className="p-4 bg-gray-800 text-white text-sm rounded-b-lg overflow-auto h-full">
      {JSON.stringify(data, null, 2)}
    </pre>
  );
};

export default RawView;