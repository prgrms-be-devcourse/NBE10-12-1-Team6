type ManagerPaginationProps = {
  currentPage: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  showCount?: boolean;
};

export default function ManagerPagination({
  currentPage,
  pageSize,
  totalItems,
  totalPages,
  onPageChange,
  showCount = true,
}: ManagerPaginationProps) {
  const firstItem = totalItems > 0 ? (currentPage - 1) * pageSize + 1 : 0;
  const lastItem = Math.min(currentPage * pageSize, totalItems);

  return (
    <div className="flex flex-col gap-4 border-t border-[#d2c3bf]/30 bg-[#f4f4f0]/60 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
      {showCount ? (
        <span className="text-sm text-[#4f4542]">
          전체 {totalItems}건 중 {firstItem}-{lastItem}건 표시
        </span>
      ) : (
        <span aria-hidden="true" />
      )}

      <div className="flex justify-center gap-2">
        <button
          type="button"
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="flex h-8 min-w-8 items-center justify-center rounded-lg px-2 text-sm font-semibold text-[#4f4542] transition-colors hover:bg-[#e3e2df] disabled:opacity-40"
        >
          이전
        </button>
        {Array.from({ length: totalPages }, (_, index) => index + 1).map(
          (pageNumber) => (
            <button
              key={pageNumber}
              type="button"
              onClick={() => onPageChange(pageNumber)}
              className={`flex h-8 w-8 items-center justify-center rounded-lg text-sm font-semibold transition-colors ${
                currentPage === pageNumber
                  ? "bg-[#130805] text-white"
                  : "text-[#4f4542] hover:bg-[#e3e2df]"
              }`}
            >
              {pageNumber}
            </button>
          ),
        )}
        <button
          type="button"
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className="flex h-8 min-w-8 items-center justify-center rounded-lg px-2 text-sm font-semibold text-[#4f4542] transition-colors hover:bg-[#e3e2df] disabled:opacity-40"
        >
          다음
        </button>
      </div>
    </div>
  );
}
