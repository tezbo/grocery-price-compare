// pages/compare.js
import { useState } from 'react';
import { groceryItems } from '../data/items';
import PriceCard from '../components/PriceCard';
import Link from 'next/link';

export default function Compare() {
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('');

  const filteredItems = groceryItems.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  const sortedItems = [...filteredItems];
  if (sortBy) {
    sortedItems.sort((a, b) => a.prices[sortBy] - b.prices[sortBy]);
  }

  const handleAddToList = (item) => {
    // Connect this with your shopping list functionality
    console.log(`Adding ${item.name} to the shopping list.`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center text-gray-900 mb-8">Compare Grocery Prices</h1>
      <div className="mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <input
          type="text"
          placeholder="Search for an ingredient..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-1/2 p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400"
        />
        <div className="flex items-center">
          <label htmlFor="sort" className="mr-3 text-gray-700">Sort by:</label>
          <select
            id="sort"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400"
          >
            <option value="">None</option>
            <option value="coles">Coles Price</option>
            <option value="woolworths">Woolworths Price</option>
            <option value="aldi">ALDI Price</option>
          </select>
        </div>
      </div>
      {sortedItems.length === 0 ? (
        <p className="text-center text-gray-600">No items found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {sortedItems.map((item, index) => (
            <PriceCard key={index} item={item} onAdd={handleAddToList} />
          ))}
        </div>
      )}
      <div className="mt-10 text-center">
        <Link href="/recipes">
          <a className="text-green-600 hover:underline text-lg">Back to Recipes</a>
        </Link>
      </div>
    </div>
  );
}