import React from 'react';
import { BsSearch } from 'react-icons/bs';

function DataTable({
  title,
  columns,
  data,
  loading,
  toolbar,
  searchValue,
  onSearchChange,
  searchPlaceholder = 'Search...',
  total,
  page,
  pages,
  onPageChange,
  emptyMessage = 'No data found',
}) {
  return (
    <div className="table-card">
      <div className="table-card-header">
        <h6>{title}</h6>
        <div className="table-toolbar">
          {onSearchChange && (
            <div className="table-search">
              <BsSearch className="si" />
              <input
                type="text"
                placeholder={searchPlaceholder}
                value={searchValue}
                onChange={(e) => onSearchChange(e.target.value)}
              />
            </div>
          )}
          {toolbar}
        </div>
      </div>

      <div className="table-responsive">
        <table className="data-table">
          <thead>
            <tr>
              {columns.map((col) => (
                <th key={col.key} style={col.style}>{col.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={columns.length} className="text-center py-4">
                  <div className="loading-spinner mx-auto" />
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length}>
                  <div className="empty-state">
                    <p>{emptyMessage}</p>
                  </div>
                </td>
              </tr>
            ) : (
              data.map((row, i) => (
                <tr key={row._id || row.id || i}>
                  {columns.map((col) => (
                    <td key={col.key} style={col.style}>
                      {col.render ? col.render(row[col.key], row) : row[col.key]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {(total !== undefined || pages > 1) && (
        <div className="table-footer">
          <span>
            {total !== undefined ? `Showing ${data.length} of ${total} records` : `${data.length} records`}
          </span>
          {pages > 1 && (
            <div className="d-flex align-items-center gap-1">
              <button
                className="btn-icon"
                disabled={page <= 1}
                onClick={() => onPageChange(page - 1)}
              >
                ‹
              </button>
              <span style={{ fontSize: '0.8rem', padding: '0 0.5rem' }}>
                {page} / {pages}
              </span>
              <button
                className="btn-icon"
                disabled={page >= pages}
                onClick={() => onPageChange(page + 1)}
              >
                ›
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default DataTable;
