'use client';
import { useEffect, useState } from 'react';

export default function ComparePage() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [recipeUrl, setRecipeUrl] = useState('');
  const [recipeData, setRecipeData] = useState(null);

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

  const handleScrapeRecipe = async () => {
    try {
      const res = await fetch(`http://localhost:8000/api/scrape_recipe/?url=${recipeUrl}`);
      const data = await res.json();
      setRecipeData(data);
    } catch (error) {
      console.error("Failed to scrape recipe:", error);
    }
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(search.toLowerCase())
  );

  const getProductPrice = (ingredient) => {
    const product = products.find((product) =>
      ingredient.toLowerCase().includes(product.name.toLowerCase())
    );
    return product ? product.price : 'N/A';
  };

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

        {recipeData && recipeData.ingredients && (
          <div>
            <h2 className="text-2xl font-bold mt-6 mb-4">{recipeData.title}</h2>
            <table className="min-w-full bg-white border border-gray-300">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b">Quantity</th>
                  <th className="py-2 px-4 border-b">Ingredient</th>
                  <th className="py-2 px-4 border-b">Price</th>
                </tr>
              </thead>
              <tbody>
                {recipeData.ingredients.map((ingredient, index) => {
                  const [quantity, ...nameParts] = ingredient.split(' ');
                  const name = nameParts.join(' ');
                  const price = getProductPrice(name);
                  return (
                    <tr key={index}>
                      <td className="py-2 px-4 border-b">{quantity}</td>
                      <td className="py-2 px-4 border-b">{name}</td>
                      <td className="py-2 px-4 border-b">{price}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
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

      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">Product Name</th>
            <th className="py-2 px-4 border-b">Price</th>
          </tr>
        </thead>
        <tbody>
          {filteredProducts.map((product, index) => (
            <tr key={index}>
              <td className="py-2 px-4 border-b">{product.name}</td>
              <td className="py-2 px-4 border-b">{product.price}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}