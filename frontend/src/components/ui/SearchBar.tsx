import { Search, X } from 'lucide-react';
import { useState } from 'react';
import { motion } from 'framer-motion';

interface SearchBarProps {
  placeholder?: string;
  onSearch: (query: string) => void;
  className?: string;
}

export function SearchBar({ placeholder = "Pesquisar...", onSearch, className = "" }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  const handleClear = () => {
    setQuery('');
    onSearch('');
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      className={`relative ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className={`relative flex items-center bg-white/5 border rounded-xl transition-all duration-300 ${
        isFocused 
          ? 'border-cyan-400/50 ring-2 ring-cyan-400/20 bg-white/10' 
          : 'border-white/10 hover:border-white/20'
      }`}>
        <Search className="absolute left-4 w-5 h-5 text-gray-400" />
        
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className="w-full bg-transparent pl-12 pr-12 py-3 text-white placeholder-gray-400 focus:outline-none"
        />
        
        {query && (
          <motion.button
            type="button"
            onClick={handleClear}
            className="absolute right-4 p-1 text-gray-400 hover:text-white transition-colors rounded-full hover:bg-white/10"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
          >
            <X className="w-4 h-4" />
          </motion.button>
        )}
      </div>
      
      {/* Subtle glow effect when focused */}
      {isFocused && (
        <motion.div
          className="absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-500/10 to-purple-500/10 -z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        />
      )}
    </motion.form>
  );
} 