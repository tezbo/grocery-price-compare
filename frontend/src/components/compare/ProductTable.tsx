'use client';

import React from 'react';
import { Badge } from '../ui/Badge';
import { ProductTableProps } from '../../types';

const ProductTable: React.FC<ProductTableProps> = ({
  products,
  search,
  selectedRecipeFilter,
  selectedCategory,
}) => {
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes((search || '').toLowerCase());
    const matchesRecipe = selectedRecipeFilter ? product.sourceRecipe === selectedRecipeFilter : true;
    const matchesCategory = selectedCategory ? product.category === selectedCategory : true;
    return matchesSearch && matchesRecipe && matchesCategory;
  });

  return (
    <table className="min-w-full text-sm text-left border">
      <thead className="bg-gray-100">
        <tr>
          <th className="p-3 font-semibold">Product Name</th>
          <th className="p-3 font-semibold">Coles</th>
          <th className="p-3 font-semibold">Source</th>
        </tr>
      </thead>
      <tbody>
        {filteredProducts.map((product, index) => (
          <tr key={index} className="border-t">
            <td className="p-3">{product.name}</td>
            <td className="p-3">
              {product.coles ? `$${product.coles.toFixed(2)}` : '—'}
            </td>
            <td className="p-3">
              {product.sourceRecipe && <Badge>{product.sourceRecipe}</Badge>}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ProductTable;