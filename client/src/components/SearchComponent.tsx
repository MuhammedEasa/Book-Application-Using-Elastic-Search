"use client"

import React, { useState } from 'react';
import axios from 'axios';

const SearchComponent: React.FC = () => {
  const [inputValue, setInputValue] = useState<string>('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);

    if (!value) {
      setSuggestions([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axios.post('http://localhost:5000/autocomplete', { data: value });
      const data = response.data.aggregations.auto_complete.buckets;
      const suggestions = data.map((item: any) => item.key);
      setSuggestions(suggestions);
    } catch (error) {
      setError('Failed to fetch suggestions');
      console.error('Error fetching suggestions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = () => {
    alert(`Submitted: ${inputValue}`);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-md rounded-lg p-6 sm:p-8 max-w-md w-full">
        <h4 className="text-center text-2xl font-semibold mb-4 text-gray-700">Search as You Type</h4>
        <input
          value={inputValue}
          onChange={handleInputChange}
          className="w-full border border-gray-300 p-3 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Type here..."
        />
        {loading && <div className="text-center text-blue-500">Loading...</div>}
        {error && <div className="text-center text-red-500">{error}</div>}
        {suggestions.length > 0 && (
          <ul className="border border-gray-300 rounded-md max-h-60 overflow-y-auto mb-4 bg-white">
            {suggestions.map((suggestion, index) => (
              <li key={index} className="p-3 hover:bg-gray-100 cursor-pointer transition-colors">
                {suggestion}
              </li>
            ))}
          </ul>
        )}
        <button
          onClick={handleSubmit}
          className="w-full bg-blue-500 text-white py-3 rounded-md hover:bg-blue-600 transition-colors"
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default SearchComponent;
