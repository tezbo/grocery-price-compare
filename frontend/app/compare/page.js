'use client';

import { useEffect, useState } from 'react';
import { Badge } from '../../components/ui/Badge';
import { toast } from 'react-hot-toast';

export default function ComparePage() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [recipeUrl, setRecipeUrl] = useState('');
  const [recipeData, setRecipeData] = useState(null);
  const [savedRecipes, setSavedRecipes] = useState([]);
  const [selectedRecipeFilter, setSelectedRecipeFilter] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [recipeToDelete, setRecipeToDelete] = useState(null);
  const [showSecondPrompt, setShowSecondPrompt] = useState(false);

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  const fetchData = async () => {
    try {
      const [productRes, recipeRes] = await Promise.all([
        fetch('http://localhost:8000/api/products'),
        fetch('http://localhost:8000/api/recipes'),
      ]);
      const productsData = await productRes.json();
      const recipesData = await recipeRes.json();

      const recipeIngredients = recipesData.flatMap(recipe =>
        recipe.ingredients.map(ing => ({
          ...ing,
          name: ing.name,
          category: ing.category || '',
          sourceRecipe: recipe.title
        }))
      );

      setProducts([...productsData, ...recipeIngredients]);
      setSavedRecipes(recipesData);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    }
  };

  useEffect(() => {
    fetchData();
    if (isMobile) setItemsPerPage(20);
  }, []);

  const handleScrapeRecipe = async () => {
    try {
      const res = await fetch(`http://localhost:8000/api/scrape_recipe/?url=${recipeUrl}`);
      const data = await res.json();
      if (!data || !data.title || !Array.isArray(data.ingredients)) {
        toast.error('Invalid recipe format or no ingredients found.');
        return;
      }
      setRecipeData(data);
      toast.success('Recipe scraped successfully');
    } catch (error) {
      console.error('Failed to scrape recipe:', error);
      toast.error('Failed to scrape recipe');
    }
  };

  const handleSaveRecipe = async () => {
    if (!recipeData || !recipeData.title || !recipeData.ingredients?.length) {
      toast.error('Please scrape a valid recipe before saving.');
      return;
    }
    try {
      const res = await fetch('http://localhost:8000/api/recipes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(recipeData),
      });
      if (!res.ok) throw new Error('Save failed');
      toast.success('Recipe saved!');
      setRecipeData(null);
      setRecipeUrl('');
      fetchData();
    } catch (error) {
      console.error('Failed to save recipe:', error);
      toast.error('Failed to save recipe');
    }
  };

  const initiateDeleteRecipe = (recipeTitle) => {
    if (window.confirm(`Are you sure you want to delete the recipe "${recipeTitle}"?`)) {
      setRecipeToDelete(recipeTitle);
      setShowSecondPrompt(true);
    }
  };

  const finalizeDeleteRecipe = async (action) => {
    setShowSecondPrompt(false);
    if (action === 'cancel') return setRecipeToDelete(null);
    try {
      const res = await fetch(`http://localhost:8000/api/recipes/${encodeURIComponent(recipeToDelete)}?delete_mode=${action}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete recipe');
      const updatedRecipes = await res.json();
      if (!Array.isArray(updatedRecipes)) return;
      setSavedRecipes(updatedRecipes);
      fetchData();
      setRecipeToDelete(null);
    } catch (err) {
      console.error('Delete failed:', err);
      toast.error('Something went wrong while deleting the recipe.');
    }
  };

  const handleClearFilter = () => {
    setSelectedRecipeFilter('');
    setSelectedCategory('');
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(search.toLowerCase());
    const matchesRecipe = selectedRecipeFilter ? product.sourceRecipe === selectedRecipeFilter : true;
    const matchesCategory = selectedCategory ? product.category === selectedCategory : true;
    return matchesSearch && matchesRecipe && matchesCategory;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">Grocery Price Compare</h1>

      <input
        type="text"
        placeholder="Search products..."
        className="w-full p-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="flex flex-wrap gap-4 mb-4">
        <select
          value={selectedRecipeFilter}
          onChange={(e) => setSelectedRecipeFilter(e.target.value)}
          className="p-2 border rounded-md"
        >
          <option value="">Filter by Recipe</option>
          {savedRecipes.map((recipe, idx) => (
            <option key={idx} value={recipe.title}>{recipe.title}</option>
          ))}
        </select>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="p-2 border rounded-md"
        >
          <option value="">Filter by Category</option>
          {[...new Set(products.map(p => p.category).filter(Boolean))].map((cat, idx) => (
            <option key={idx} value={cat}>{cat}</option>
          ))}
        </select>

        <button
          onClick={handleClearFilter}
          className="px-3 py-2 rounded-md bg-gray-300 hover:bg-gray-400"
        >
          Clear Filters
        </button>

        {!isMobile && (
          <select
            value={itemsPerPage}
            onChange={(e) => setItemsPerPage(Number(e.target.value))}
            className="p-2 border rounded-md"
          >
            {[10, 20, 50, 100].map(size => (
              <option key={size} value={size}>{size} items/page</option>
            ))}
          </select>
        )}
      </div>

      <div className="mb-6">
        {recipeData && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">{recipeData.title}</h2>
            <table className="min-w-full text-sm text-left border mb-4">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-3 font-semibold">Quantity</th>
                  <th className="p-3 font-semibold">Ingredient</th>
                  <th className="p-3 font-semibold">Notes</th>
                </tr>
              </thead>
              <tbody>
                {recipeData.ingredients.map((ing, idx) => (
                  <tr key={idx} className="border-t">
                    <td className="p-3">{ing.quantity}</td>
                    <td className="p-3">{ing.name}</td>
                    <td className="p-3">{ing.notes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <input
          type="text"
          placeholder="Enter recipe URL"
          value={recipeUrl}
          onChange={(e) => setRecipeUrl(e.target.value)}
          className="w-full p-2 mb-2 border border-gray-300 rounded-md"
        />
        <div className="flex gap-2">
          <button onClick={handleScrapeRecipe} className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md">Scrape Recipe</button>
          <button onClick={handleSaveRecipe} className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md">Save Recipe</button>
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Saved Recipes</h2>
        <ul className="list-disc pl-6">
          {savedRecipes.map((recipe, idx) => (
            <li key={idx} className="flex justify-between items-center">
              <span>{recipe.title}</span>
              <button onClick={() => initiateDeleteRecipe(recipe.title)} className="text-red-600 hover:underline">Delete</button>
            </li>
          ))}
        </ul>
      </div>

      {showSecondPrompt && recipeToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-md w-96 text-center">
            <p className="mb-4">
              Do you want to also delete all products associated only with <strong>{recipeToDelete}</strong>?
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => finalizeDeleteRecipe('yes')}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Yes
              </button>
              <button
                onClick={() => finalizeDeleteRecipe('no')}
                className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
              >
                No
              </button>
              <button
                onClick={() => finalizeDeleteRecipe('cancel')}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <table className="min-w-full text-sm text-left border">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-3 font-semibold">Product Name</th>
            <th className="p-3 font-semibold">Woolworths</th>
            <th className="p-3 font-semibold">Coles</th>
            <th className="p-3 font-semibold">Aldi</th>
            <th className="p-3 font-semibold">IGA</th>
            <th className="p-3 font-semibold">Best Price</th>
            <th className="p-3 font-semibold">Source</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((product, index) => (
            <tr key={index} className="border-t">
              <td className="p-3">{product.name}</td>
              <td className="p-3">{product.woolworths ? `$${product.woolworths.toFixed(2)}` : '—'}</td>
              <td className="p-3">{product.coles ? `$${product.coles.toFixed(2)}` : '—'}</td>
              <td className="p-3">{product.aldi ? `$${product.aldi.toFixed(2)}` : '—'}</td>
              <td className="p-3">{product.iga ? `$${product.iga.toFixed(2)}` : '—'}</td>
              <td className="p-3">{product.bestPrice || '—'}</td>
              <td className="p-3">{product.sourceRecipe && <Badge>{product.sourceRecipe}</Badge>}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-center gap-2 mt-4">
        {[...Array(totalPages)].map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentPage(index + 1)}
            className={`px-3 py-1 border rounded ${currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-white'}`}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
}