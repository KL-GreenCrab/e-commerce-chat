import React, { useState, useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';
import { SearchSuggestions } from './SearchSuggestions';
import { Product } from '../types';
import { fetchProducts } from '../services/productService';
import { useNavigate, useLocation } from 'react-router-dom';

interface SearchBarProps {
  onSearch?: (query: string) => void;
  onSelect?: (product: Product) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({ onSearch, onSelect }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const initialQuery = searchParams.get('q') || '';

  const [query, setQuery] = useState(initialQuery);
  const [suggestions, setSuggestions] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsFocused(false);
        // Don't hide suggestions immediately to allow clicking on them
        setTimeout(() => {
          setShowSuggestions(false);
        }, 200);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Update query when URL search parameter changes
  useEffect(() => {
    const urlQuery = searchParams.get('q') || '';
    if (urlQuery !== query) {
      setQuery(urlQuery);
    }
  }, [location.search]);

  // Fetch suggestions when query changes
  useEffect(() => {
    if (query.trim()) {
      setIsLoading(true);
      setShowSuggestions(true);

      // Add a small delay to prevent too many API calls while typing
      const debounceTimer = setTimeout(() => {
        fetchProducts({ search: query })
          .then(data => {
            setSuggestions(data.slice(0, 6)); // Show up to 6 suggestions
            setIsLoading(false);
          })
          .catch(error => {
            console.error('Error fetching suggestions:', error);
            setIsLoading(false);
          });
      }, 300);

      return () => clearTimeout(debounceTimer);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
      setIsLoading(false);
    }
  }, [query]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedQuery = query.trim();
    if (trimmedQuery) {
      // Update URL with search query
      navigate(`/search?q=${encodeURIComponent(trimmedQuery)}`);

      // Also call the onSearch prop if provided
      if (onSearch) {
        onSearch(trimmedQuery);
      }
    }
  };

  const handleSelect = (product: Product) => {
    setQuery(product.name);
    if (onSelect) {
      onSelect(product);
    }
    setIsFocused(false);
    setShowSuggestions(false);
  };

  const clearSearch = () => {
    setQuery('');
    setSuggestions([]);
    setShowSuggestions(false);

    // If we're on the search page, navigate back to home
    if (location.pathname === '/search') {
      navigate('/');
    } else if (location.search.includes('q=')) {
      // Remove search parameter from current URL
      const newSearchParams = new URLSearchParams(location.search);
      newSearchParams.delete('q');
      const newSearch = newSearchParams.toString();
      navigate({
        pathname: location.pathname,
        search: newSearch ? `?${newSearch}` : ''
      });
    }

    // Also call onSearch with empty string to clear results
    if (onSearch) {
      onSearch('');
    }
  };

  return (
    <div ref={searchRef} className="relative w-full max-w-xl">
      <form onSubmit={handleSearch} className="relative">
        <input
          type="text"
          placeholder="Search products..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => {
            setIsFocused(true);
            if (query.trim()) {
              setShowSuggestions(true);
            }
          }}
          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500"
        />
        {query && (
          <button
            type="button"
            onClick={clearSearch}
            className="absolute right-10 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className="h-4 w-4" />
          </button>
        )}
        <button
          type="submit"
          className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
        >
          <Search className="h-4 w-4" />
        </button>
      </form>

      {(showSuggestions || (isFocused && query.trim())) && (
        <SearchSuggestions
          suggestions={suggestions}
          onSelect={handleSelect}
          isLoading={isLoading}
        />
      )}
    </div>
  );
};