'use client';

import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="text-center py-10">
      <h1 className="text-3xl font-bold mb-4">Grocery Price Compare</h1>
      <p className="mb-6">Welcome to the comparison tool.</p>
      <div className="space-x-4">
        <Link href="/compare" className="text-blue-600 underline">Compare Prices</Link>
        <Link href="/recipes" className="text-blue-600 underline">Recipes</Link>
        <Link href="/shopping-list" className="text-blue-600 underline">Shopping List</Link>
      </div>
    </div>
  );
}