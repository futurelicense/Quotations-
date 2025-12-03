import React from 'react';
interface Column {
  key: string;
  label: string;
  width?: string;
  render?: (value: any, row: any) => React.ReactNode;
}
interface TableProps {
  columns: Column[];
  data: any[];
  onRowClick?: (row: any) => void;
}
export function Table({
  columns,
  data,
  onRowClick
}: TableProps) {
  return <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50">
            {columns.map(column => <th key={column.key} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style={{
            width: column.width
          }}>
                {column.label}
              </th>)}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.length === 0 ? <tr>
              <td colSpan={columns.length} className="px-6 py-12 text-center text-gray-500">
                No data available
              </td>
            </tr> : data.map((row, index) => <tr key={index} onClick={() => onRowClick?.(row)} className={onRowClick ? 'cursor-pointer hover:bg-gray-50 transition-colors' : ''}>
                {columns.map(column => <td key={column.key} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {column.render ? column.render(row[column.key], row) : row[column.key]}
                  </td>)}
              </tr>)}
        </tbody>
      </table>
    </div>;
}