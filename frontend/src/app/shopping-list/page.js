'use client';

import { useState, useEffect } from 'react';

export default function ShoppingListPage() {
  const [shoppingList, setShoppingList] = useState([]);
  const [product, setProduct] = useState({ name: '', quantity: '', price: 0 });

  // Fetch the shopping list on page load
  useEffect(() => {
    const fetchShoppingList = async () => {
      try {
        const res = await fetch('http://localhost:8000/shopping_list/');
        const data = await res.json();
        setShoppingList(data);
      } catch (error) {
        console.error('Failed to fetch shopping list:', error);
      }
    };
    fetchShoppingList();
  }, []);

  // Add an item to the shopping list
  const handleAddToShoppingList = async () => {
    if (!product.name || !product.quantity || !product.price) {
      alert('Please fill in all fields');
      return;
    }

    try {
      const res = await fetch('http://localhost:8000/shopping_list/', {
        method: 'POST',
        body: JSON.stringify(product),
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await res.json();
      setShoppingList([...shoppingList, data.item]);
      setProduct({ name: '', quantity: '', price: 0 }); // Clear form
    } catch (error) {
      console.error('Failed to add item:', error);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">Shopping List</h1>

      {/* Form to add new item */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold">Add to Shopping List</h2>
        <input
          type="text"
          className="w-full p-2 mb-4 border border-gray-300 rounded-md"
          placeholder="Product Name"
          value={product.name}
          onChange={(e) => setProduct({ ...product, name: e.target.value })}
        />
        <input
          type="text"
          className="w-full p-2 mb-4 border border-gray-300 rounded-md"
          placeholder="Quantity"
          value={product.quantity}
          onChange={(e) => setProduct({ ...product, quantity: e.target.value })}
        />
        <input
          type="number"
          className="w-full p-2 mb-4 border border-gray-300 rounded-md"
          placeholder="Price"
          value={product.price}
          onChange={(e) => setProduct({ ...product, price: parseFloat(e.target.value) })}
        />
        <button
          onClick={handleAddToShoppingList}
          className="w-full p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
        >
          Add Item
        </button>
      </div>

      {/* Display shopping list */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Your Shopping List</h2>
        {shoppingList.length === 0 ? (
          <p>No items in your shopping list yet.</p>
        ) : (
          <ul>
            {shoppingList.map((item, index) => (
              <li key={index} className="border-b py-2">
                <span>{item.name}</span> - <span>{item.quantity}</span> - $
                <span>{item.price.toFixed(2)}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}