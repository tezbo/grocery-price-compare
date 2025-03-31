'use client';

import React from 'react';

interface PaginationProps {
  currentPage: number;
  setCurrentPage: (page: number) => void;
  totalPages: number;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  setCurrentPage,
  totalPages,
}) => {
  return (
    <div className="flex justify-center gap-2 mt-4">
      {[...Array(totalPages)].map((_, index) => (
        <button
          key={index}
          onClick={() => setCurrentPage(index + 1)}
          className={`px-3 py-1 border rounded ${
            currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-white'
          }`}
        >
          {index + 1}
        </button>
      ))}
    </div>
  );
};

export default Pagination;