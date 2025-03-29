// pages/index.js
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-green-500 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold">Grocery Scout</h1>
          <p className="mt-4 text-xl">
            Compare grocery prices, build recipes, and generate your shopping list.
          </p>
          <Link href="/compare">
            <a className="mt-6 inline-block bg-white text-green-500 font-semibold py-3 px-6 rounded-full shadow hover:bg-gray-100 transition-colors">
              Get Started
            </a>
          </Link>
        </div>
      </header>
      <main className="container mx-auto px-4 py-10 flex-grow">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white border border-gray-200 rounded-lg shadow p-6">
            <h2 className="text-2xl font-semibold mb-4">Compare Prices</h2>
            <p className="text-gray-700">
              Quickly search and compare prices for your favorite grocery items.
            </p>
            <Link href="/compare">
              <a className="mt-4 inline-block bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded transition-colors">
                Compare Now
              </a>
            </Link>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg shadow p-6">
            <h2 className="text-2xl font-semibold mb-4">Recipe Builder</h2>
            <p className="text-gray-700">
              Build your recipes easily and see how your ingredients add up on the shopping list.
            </p>
            <Link href="/recipes">
              <a className="mt-4 inline-block bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded transition-colors">
                Build a Recipe
              </a>
            </Link>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg shadow p-6">
            <h2 className="text-2xl font-semibold mb-4">Shopping List</h2>
            <p className="text-gray-700">
              Consolidate all your recipe ingredients into one organized shopping list.
            </p>
            <Link href="/shopping-list">
              <a className="mt-4 inline-block bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded transition-colors">
                View List
              </a>
            </Link>
          </div>
        </div>
      </main>
      <footer className="bg-gray-800 text-white py-4">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; {new Date().getFullYear()} Grocery Scout. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}