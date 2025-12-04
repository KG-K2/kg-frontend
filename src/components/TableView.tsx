interface TableViewProps {
  data: Record<string, any>[];
}

const TableView = ({ data }: TableViewProps) => {
  if (data.length === 0) {
    return <div className="p-4 text-center text-gray-500">Empty Result.</div>;
  }

  const firstItem = data[0];
  const dataObjectKey = Object.keys(firstItem).find(
    (key) => typeof firstItem[key] === 'object' && 
    firstItem[key] !== null && 
    !Array.isArray(firstItem[key])
  );

  if (!dataObjectKey) {
    return (
      <div> Invalid </div>
    );
  }

  const columns = Object.keys(firstItem[dataObjectKey]);

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-max table-auto text-left border-collapse">
        <thead className="bg-gray-100 sticky top-0">
          <tr>
            {columns.map((key) => (
              <th key={key} className="border-b border-gray-300 px-4 py-3 font-semibold text-gray-700 capitalize">
                {key}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index} className="border-b border-gray-200 hover:bg-gray-50">
              {columns.map((col) => {
                const cellData = item[dataObjectKey]?.[col];
                return (
                  <td key={`${index}-${col}`} className="px-4 py-3 align-top text-sm">
                    <span className="whitespace-nowrap">{String(cellData ?? 'N/A')}</span>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TableView;
