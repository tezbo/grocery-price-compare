'use client';

import Link from 'next/link';

export default function Header() {
  return (
    <header className="bg-white shadow mb-6">
      <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-green-600">
          <Link href="/">Grocery Scout</Link>
        </h1>
        <nav className="space-x-4">
          <Link href="/compare" className="text-gray-700 hover:text-green-600">Compare</Link>
          <Link href="/recipes" className="text-gray-700 hover:text-green-600">Recipes</Link>
          <Link href="/shopping-list" className="text-gray-700 hover:text-green-600">Shopping List</Link>
        </nav>
      </div>
    </header>
  );
}