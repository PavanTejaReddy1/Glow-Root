import { useState } from 'react';
import { ChevronLeft, ChevronRight, Search, Filter } from 'lucide-react';

export default function DataTable({
  columns,
  data,
  searchable = false,
  filterable = false,
  pagination = true
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredData = data.filter((item) =>
    Object.values(item).some(
      (value) =>
        value &&
        value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, endIndex);

  return (
    <div
      className="rounded-2xl shadow-sm"
      style={{ backgroundColor: '#F8F2E8', border: '1px solid rgba(197,155,69,0.25)' }}
    >
      {/* Header */}
      {(searchable || filterable) && (
        <div className="flex items-center justify-between border-b p-4" style={{ borderColor: 'rgba(197,155,69,0.25)' }}>
          <div className="flex items-center gap-2">
            {searchable && (
              <div className="relative">
                <Search
                  className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2"
                  style={{ color: '#6E4B2A' }}
                />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-64 rounded-full border px-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2"
                  style={{
                    fontFamily: '"Poppins", sans-serif',
                    borderColor: 'rgba(197,155,69,0.25)',
                    color: '#4B2F1F',
                    backgroundColor: '#FCFAF6'
                  }}
                />
              </div>
            )}
            {filterable && (
              <button
                className="flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition-colors hover:bg-amber-50"
                style={{
                  fontFamily: '"Poppins", sans-serif',
                  borderColor: 'rgba(197,155,69,0.25)',
                  color: '#6E4B2A',
                  backgroundColor: '#FCFAF6'
                }}
              >
                <Filter className="h-4 w-4" />
                Filter
              </button>
            )}
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead style={{ backgroundColor: '#EFE3D1' }}>
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider"
                  style={{ fontFamily: '"Poppins", sans-serif', color: '#4B2F1F' }}
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y" style={{ borderColor: 'rgba(197,155,69,0.25)' }}>
            {paginatedData.map((row, index) => (
              <tr
                key={index}
                className="transition-colors hover:bg-amber-50"
              >
                {columns.map((column) => (
                  <td
                    key={column.key}
                    className="px-6 py-4 text-sm"
                    style={{ fontFamily: '"Poppins", sans-serif', color: '#4B2F1F' }}
                  >
                    {column.render ? column.render(row[column.key], row) : row[column.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination && totalPages > 1 && (
        <div className="flex items-center justify-between border-t px-6 py-4" style={{ borderColor: 'rgba(197,155,69,0.25)' }}>
          <p
            className="text-sm"
            style={{ fontFamily: '"Poppins", sans-serif', color: '#6E4B2A' }}
          >
            Showing {startIndex + 1} to {Math.min(endIndex, filteredData.length)} of{' '}
            {filteredData.length} results
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="rounded-full border p-2 transition-colors hover:bg-amber-50 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ borderColor: 'rgba(197,155,69,0.25)', color: '#6E4B2A' }}
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span
              className="text-sm"
              style={{ fontFamily: '"Poppins", sans-serif', color: '#6E4B2A' }}
            >
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="rounded-full border p-2 transition-colors hover:bg-amber-50 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ borderColor: 'rgba(197,155,69,0.25)', color: '#6E4B2A' }}
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
