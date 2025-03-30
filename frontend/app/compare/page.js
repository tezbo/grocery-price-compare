// frontend/app/compare/page.js
'use client';

import { useEffect, useState } from 'react';
import { ArrowDownIcon, ArrowUpIcon, TrendingUp, TrendingDown } from 'lucide-react';
import { Badge } from '../../components/ui/Badge';

export default function ComparePage() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("http://localhost:8000/api/products");
        const data = await res.json();
        setProducts(data);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      }
    };
    fetchProducts();
  }, []);

const [recipeUrl, setRecipeUrl] = useState('');
  
const [recipeData, setRecipeData] = useState(null);

const handleScrapeRecipe = async () => {
//   try {
//     const res = await fetch(`http://localhost:8000/scrape_recipe/?url=${recipeUrl}`);
//     const data = await res.json();
//     setRecipeData(data);
//   } catch (error) {
//     console.error("Failed to scrape recipe:", error);
//   }
};



  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">Price Comparison</h1>

      <div>
    <input 
      type="text" 
      placeholder="Enter recipe URL" 
      value={recipeUrl}
      onChange={(e) => setRecipeUrl(e.target.value)} 
      className="input-field"
    />
    <button onClick={handleScrapeRecipe}>Scrape Recipe</button>

    {recipeData && (
      <div>
        <h2>{recipeData.title}</h2>
        <ul>
          {recipeData.ingredients.map((ingredient, index) => (
            <li key={index}>{ingredient}</li>
          ))}
        </ul>
      </div>
    )}
  </div>
  
      <input
        type="text"
        placeholder="Search products..."
        className="w-full p-2 mb-6 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="overflow-x-auto rounded-md border">
      <div className="overflow-x-auto rounded-md border border-gray-200">
      <table className="min-w-full text-sm text-left">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-3 font-semibold">Product</th>
            <th className="p-3 font-semibold">Woolworths</th>
            <th className="p-3 font-semibold">Coles</th>
            <th className="p-3 font-semibold">Aldi</th>
            <th className="p-3 font-semibold">IGA</th>
            <th className="p-3 font-semibold">Best Price</th>
            <th className="p-3 font-semibold">Trend</th>
          </tr>
        </thead>
        <tbody>
          {filteredProducts.map((product, index) => (
            <tr key={index} className="border-t hover:bg-gray-50 transition-colors">
              <td className="p-3">
                {product.trend === 'rising' && (
                  <TrendingUp className="w-4 h-4 inline-block mr-1 text-red-500" />
                )}
                {product.trend === 'falling' && (
                  <TrendingDown className="w-4 h-4 inline-block mr-1 text-green-500" />
                )}
                {product.name}
              </td>
              <td className="p-3">${product.woolworths?.toFixed(2) ?? '—'}</td>
              <td className="p-3">${product.coles?.toFixed(2) ?? '—'}</td>
              <td className="p-3">${product.aldi?.toFixed(2) ?? '—'}</td>
              <td className="p-3">${product.iga?.toFixed(2) ?? '—'}</td>
              <td className="p-3">
                <Badge>{product.bestPrice}</Badge>
              </td>
              <td className="p-3 flex items-center gap-1">
                {product.priceChange > 0 && (
                  <ArrowUpIcon className="w-3 h-3 text-red-500" />
                )}
                {product.priceChange < 0 && (
                  <ArrowDownIcon className="w-3 h-3 text-green-500" />
                )}
                <span
                  className={
                    product.priceChange > 0
                      ? 'text-red-500'
                      : product.priceChange < 0
                      ? 'text-green-500'
                      : 'text-gray-500'
                  }
                >
                  {product.priceChange > 0 ? '+' : ''}
                  {product.priceChange ?? 0}%
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
</div>
      </div>
    </div>
  );
}