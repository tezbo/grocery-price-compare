"use client";

import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { Badge } from "@/components/ui/Badge";
import Filters from "@/components/compare/Filters";
import Pagination from "@/components/compare/Pagination";
import ProductTable from "@/components/compare/ProductTable";
import RecipeActions from "@/components/compare/RecipeActions";
import SearchBar from "@/components/compare/SearchBar";

export default function ComparePage() {
  const [products, setProducts] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [recipeUrl, setRecipeUrl] = useState("");
  const [recipeData, setRecipeData] = useState<any>(null);
  const [savedRecipes, setSavedRecipes] = useState<any[]>([]);
  const [selectedRecipeFilter, setSelectedRecipeFilter] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [recipeToDelete, setRecipeToDelete] = useState<string | null>(null);
  const [showSecondPrompt, setShowSecondPrompt] = useState(false);

  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

  const fetchColesPrice = async (query: string) => {
    try {
      const res = await fetch(
        `http://localhost:8000/api/scrape_coles_price?query=${encodeURIComponent(
          query
        )}`
      );
      if (!res.ok) throw new Error("Coles API failed");
      const data = await res.json();
      return data?.price || null;
    } catch (error) {
      console.error(`Failed to fetch Coles price for ${query}:`, error);
      return null;
    }
  };

  const fetchData = async () => {
    try {
      const [productRes, recipeRes] = await Promise.all([
        fetch("http://localhost:8000/api/products"),
        fetch("http://localhost:8000/api/recipes"),
      ]);
      const productsData = await productRes.json();
      const recipesData = await recipeRes.json();

      const recipeIngredients = recipesData.flatMap((recipe: any) =>
        recipe.ingredients.map((ing: any) => ({
          ...ing,
          name: ing.name,
          category: ing.category || "",
          sourceRecipe: recipe.title,
        }))
      );

      const allProducts = [...productsData, ...recipeIngredients];
      const enrichedProducts = await Promise.all(
        allProducts.map(async (product) => {
          const colesPrice = await fetchColesPrice(product.name);
          return { ...product, coles: colesPrice };
        })
      );

      setProducts(enrichedProducts);
      setSavedRecipes(recipesData);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    }
  };

  useEffect(() => {
    fetchData();
    if (isMobile) setItemsPerPage(20);
  }, []);

  const handleScrapeRecipe = async () => {
    try {
      const res = await fetch(
        `http://localhost:8000/api/scrape_recipe/?url=${recipeUrl}`
      );
      const data = await res.json();
      if (!data || !data.title || !Array.isArray(data.ingredients)) {
        toast.error("Invalid recipe format or no ingredients found.");
        return;
      }
      setRecipeData(data);
      toast.success("Recipe scraped successfully");
    } catch (error) {
      console.error("Failed to scrape recipe:", error);
      toast.error("Failed to scrape recipe");
    }
  };

  const handleSaveRecipe = async () => {
    if (!recipeData || !recipeData.title || !recipeData.ingredients?.length) {
      toast.error("Please scrape a valid recipe before saving.");
      return;
    }
    try {
      const res = await fetch("http://localhost:8000/api/recipes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(recipeData),
      });
      if (!res.ok) throw new Error("Save failed");
      toast.success("Recipe saved!");
      setRecipeData(null);
      setRecipeUrl("");
      fetchData();
    } catch (error) {
      console.error("Failed to save recipe:", error);
      toast.error("Failed to save recipe");
    }
  };

  const initiateDeleteRecipe = (recipeTitle: string) => {
    if (window.confirm(`Are you sure you want to delete the recipe "${recipeTitle}"?`)) {
      setRecipeToDelete(recipeTitle);
      setShowSecondPrompt(true);
    }
  };

  const finalizeDeleteRecipe = async (action: "cancel" | "recipe-only" | "recipe-and-products") => {
    setShowSecondPrompt(false);
    if (action === "cancel") return setRecipeToDelete(null);
    try {
      const res = await fetch(
        `http://localhost:8000/api/recipes/${encodeURIComponent(
          recipeToDelete || ""
        )}?delete_mode=${action}`,
        { method: "DELETE" }
      );
      if (!res.ok) throw new Error("Failed to delete recipe");
      const updatedRecipes = await res.json();
      if (!Array.isArray(updatedRecipes)) return;
      setSavedRecipes(updatedRecipes);
      fetchData();
      setRecipeToDelete(null);
    } catch (err) {
      console.error("Delete failed:", err);
      toast.error("Something went wrong while deleting the recipe.");
    }
  };

  const handleClearFilter = () => {
    setSelectedRecipeFilter("");
    setSelectedCategory("");
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name?.toLowerCase().includes(search.toLowerCase());
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

      <SearchBar search={search} setSearch={setSearch} />
      <RecipeActions
        recipeUrl={recipeUrl}
        setRecipeUrl={setRecipeUrl}
        handleScrapeRecipe={handleScrapeRecipe}
        handleSaveRecipe={handleSaveRecipe}
        recipeData={recipeData}
      />

      <Filters
        savedRecipes={savedRecipes}
        selectedRecipeFilter={selectedRecipeFilter}
        setSelectedRecipeFilter={setSelectedRecipeFilter}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        handleClearFilter={handleClearFilter}
        itemsPerPage={itemsPerPage}
        setItemsPerPage={setItemsPerPage}
      />

      <ProductTable
        products={currentItems}
        recipeFilter={selectedRecipeFilter}
        onDeleteRecipe={initiateDeleteRecipe}
      />

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        setCurrentPage={setCurrentPage}
      />

      {showSecondPrompt && (
        <div className="mt-6 bg-yellow-100 p-4 rounded shadow">
          <p className="mb-4 font-semibold">
            Do you want to delete all products associated <em>only</em> with this recipe?
          </p>
          <div className="flex gap-4">
            <button
              onClick={() => finalizeDeleteRecipe("recipe-only")}
              className="px-4 py-2 bg-red-500 text-white rounded"
            >
              Delete Recipe Only
            </button>
            <button
              onClick={() => finalizeDeleteRecipe("recipe-and-products")}
              className="px-4 py-2 bg-red-700 text-white rounded"
            >
              Delete Recipe and Products
            </button>
            <button
              onClick={() => finalizeDeleteRecipe("cancel")}
              className="px-4 py-2 bg-gray-300 rounded"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
