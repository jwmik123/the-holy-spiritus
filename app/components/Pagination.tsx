import Link from "next/link";
import { PaginationData } from "../lib/wordpress";

interface PaginationProps {
  pagination: PaginationData;
  basePath: string;
}

export function Pagination({ pagination, basePath }: PaginationProps) {
  const { totalPages, currentPage } = pagination;

  // Don't render pagination if there's only one page
  if (totalPages <= 1) {
    return null;
  }

  // Create an array of page numbers to show
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5;

    if (totalPages <= maxPagesToShow) {
      // If we have fewer pages than the max, show all of them
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Otherwise, show a window around the current page
      let startPage = Math.max(1, currentPage - 2);
      let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

      // Adjust the start if we're near the end
      if (endPage === totalPages) {
        startPage = Math.max(1, endPage - maxPagesToShow + 1);
      }

      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }

      // Add ellipses if needed
      if (startPage > 1) {
        pageNumbers.unshift(-1); // -1 represents ellipsis
        pageNumbers.unshift(1); // Always show first page
      }

      if (endPage < totalPages) {
        pageNumbers.push(-2); // -2 represents ellipsis
        pageNumbers.push(totalPages); // Always show last page
      }
    }

    return pageNumbers;
  };

  const pageNumbers = getPageNumbers();

  return (
    <nav className="flex justify-center mt-10" aria-label="Pagination">
      <ul className="flex items-center gap-1">
        {/* Previous Page Button */}
        <li>
          <Link
            href={currentPage > 1 ? `${basePath}?page=${currentPage - 1}` : "#"}
            className={`px-3 py-2 rounded-md flex items-center ${
              currentPage > 1
                ? "text-gray-700 hover:bg-gray-100"
                : "text-gray-400 cursor-not-allowed"
            }`}
            aria-disabled={currentPage <= 1}
          >
            <span className="sr-only">Previous Page</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </Link>
        </li>

        {/* Page Numbers */}
        {pageNumbers.map((pageNumber, index) => {
          if (pageNumber === -1 || pageNumber === -2) {
            // Render ellipsis
            return (
              <li key={`ellipsis-${index}`}>
                <span className="px-4 py-2 text-gray-700">...</span>
              </li>
            );
          }

          return (
            <li key={pageNumber}>
              <Link
                href={`${basePath}?page=${pageNumber}`}
                className={`px-4 py-2 rounded-md ${
                  currentPage === pageNumber
                    ? "bg-amber-600 text-white font-medium"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
                aria-current={currentPage === pageNumber ? "page" : undefined}
              >
                {pageNumber}
              </Link>
            </li>
          );
        })}

        {/* Next Page Button */}
        <li>
          <Link
            href={
              currentPage < totalPages
                ? `${basePath}?page=${currentPage + 1}`
                : "#"
            }
            className={`px-3 py-2 rounded-md flex items-center ${
              currentPage < totalPages
                ? "text-gray-700 hover:bg-gray-100"
                : "text-gray-400 cursor-not-allowed"
            }`}
            aria-disabled={currentPage >= totalPages}
          >
            <span className="sr-only">Next Page</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </Link>
        </li>
      </ul>
    </nav>
  );
}
