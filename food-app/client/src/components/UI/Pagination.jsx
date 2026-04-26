function Pagination({ page, pages, onChange }) {
  if (pages <= 1) return null;

  return (
    <div className="mt-8 flex items-center justify-center gap-2">
      <button type="button" onClick={() => onChange(page - 1)} disabled={page === 1} className="btn-secondary disabled:opacity-50">
        Previous
      </button>
      {Array.from({ length: pages }, (_, index) => index + 1).map((pageNumber) => (
        <button
          type="button"
          key={pageNumber}
          onClick={() => onChange(pageNumber)}
          className={`h-11 w-11 rounded-xl font-semibold ${page === pageNumber ? 'bg-primary text-white' : 'border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900'}`}
        >
          {pageNumber}
        </button>
      ))}
      <button type="button" onClick={() => onChange(page + 1)} disabled={page === pages} className="btn-secondary disabled:opacity-50">
        Next
      </button>
    </div>
  );
}

export default Pagination;
