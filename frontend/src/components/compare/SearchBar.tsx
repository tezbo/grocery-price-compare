'use client';

import React from 'react';

const SearchBar = ({ search, setSearch }) => {
  return (
    <input
      type="text"
      placeholder="Search products..."
      className="w-full p-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
      value={search}
      onChange={(e) => setSearch(e.target.value)}
    />
  );
};

export default SearchBar;
