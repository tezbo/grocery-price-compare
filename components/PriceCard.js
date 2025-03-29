// components/PriceCard.js
const PriceCard = ({ item, onAdd }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-transform transform hover:scale-105 p-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-3">{item.name}</h2>
      <div className="text-gray-600 mb-4">
        <p className="mb-1">
          <span className="font-medium">Coles:</span> ${item.prices.coles.toFixed(2)}
        </p>
        <p className="mb-1">
          <span className="font-medium">Woolworths:</span> ${item.prices.woolworths.toFixed(2)}
        </p>
        <p>
          <span className="font-medium">ALDI:</span> ${item.prices.aldi.toFixed(2)}
        </p>
      </div>
      <button
        onClick={() => onAdd(item)}
        className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg transition-colors"
      >
        Add to List
      </button>
    </div>
  );
};

export default PriceCard;