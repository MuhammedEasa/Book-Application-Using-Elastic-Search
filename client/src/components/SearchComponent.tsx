import React, { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { Search, Loader } from 'lucide-react';

interface Suggestion {
  title: string;
  _id: string;
}

const SearchComponent: React.FC = () => {
  const [inputValue, setInputValue] = useState<string>('');
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

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
      console.log("response", response);
      
      const { suggestions } = response.data;
      setSuggestions(suggestions);
    } catch (error) {
      setError('Failed to fetch suggestions');
      console.error('Error fetching suggestions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestionClick = (id: string) => {
    router.push(`/allBooks/${id}`);
  };

  const handleSubmit = () => {
    alert(`Submitted: ${inputValue}`);
  };

  return (
    <div className="relative w-full max-w-md mx-auto text-black">
      <div className="relative">
        <input
          value={inputValue}
          onChange={handleInputChange}
          className="w-full px-4 py-2 pr-10 text-sm border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Search books..."
        />
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          {loading ? (
            <Loader className="w-5 h-5 text-gray-400 animate-spin" />
          ) : (
            <Search className="w-5 h-5 text-gray-400" />
          )}
        </div>
      </div>
      {error && <div className="mt-2 text-sm text-red-500">{error}</div>}
      {suggestions.length > 0 && (
        <ul className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
          {suggestions.map((suggestion) => (
            <li 
              key={suggestion._id} 
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
              onClick={() => handleSuggestionClick(suggestion._id)}
            >
              {suggestion.title}
            </li>
          ))}
        </ul>
      )}
      <button
        onClick={handleSubmit}
        className="mt-4 w-full bg-blue-500 text-white py-2 px-4 rounded-full hover:bg-blue-600 transition-colors text-sm font-medium"
      >
        Submit
      </button>
    </div>
  );
};

export default SearchComponent;