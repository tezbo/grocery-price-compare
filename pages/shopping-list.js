// pages/shopping-list.js
import { useContext } from 'react';
import { RecipeContext } from '../context/RecipeContext';
import Link from 'next/link';

export default function ShoppingList() {
  const { recipes } = useContext(RecipeContext);

  // Aggregate ingredients from all recipes.
  const aggregated = recipes.reduce((acc, recipe) => {
    recipe.ingredients.forEach((ing) => {
      const key = `${ing.name.toLowerCase()}-${ing.unit.toLowerCase()}`;
      if (acc[key]) {
        acc[key].quantity = parseFloat(acc[key].quantity) + parseFloat(ing.quantity);
      } else {
        acc[key] = { ...ing };
      }
    });
    return acc;
  }, {});

  const aggregatedList = Object.values(aggregated);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center text-gray-900 mb-8">Shopping List</h1>
      {aggregatedList.length === 0 ? (
        <p className="text-center text-gray-600">No ingredients. Add some recipes first!</p>
      ) : (
        <ul className="max-w-xl mx-auto list-disc pl-5 text-gray-700">
          {aggregatedList.map((item, idx) => (
            <li key={idx} className="mb-2">
              {item.name} - {item.quantity} {item.unit}
            </li>
          ))}
        </ul>
      )}
      <div className="text-center mt-8">
        <Link href="/recipes">
          <a className="text-green-600 hover:underline text-xl">Back to Recipes</a>
        </Link>
      </div>
    </div>
  );
}