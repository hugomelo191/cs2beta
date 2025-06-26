import { Filter, ChevronDown, X } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface FilterOption {
  id: string;
  label: string;
  value: string;
}

export interface FilterGroup {
  id: string;
  label: string;
  type: 'select' | 'multiselect' | 'range';
  options?: FilterOption[];
  min?: number;
  max?: number;
}

interface FilterPanelProps {
  filters: FilterGroup[];
  onFiltersChange: (filters: Record<string, any>) => void;
  className?: string;
}

export function FilterPanel({ filters, onFiltersChange, className = "" }: FilterPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState<Record<string, any>>({});
  const [openDropdowns, setOpenDropdowns] = useState<Set<string>>(new Set());

  const toggleDropdown = (filterId: string) => {
    const newOpenDropdowns = new Set(openDropdowns);
    if (newOpenDropdowns.has(filterId)) {
      newOpenDropdowns.delete(filterId);
    } else {
      newOpenDropdowns.add(filterId);
    }
    setOpenDropdowns(newOpenDropdowns);
  };

  const handleFilterChange = (filterId: string, value: any) => {
    const newFilters = { ...selectedFilters, [filterId]: value };
    setSelectedFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const clearAllFilters = () => {
    setSelectedFilters({});
    onFiltersChange({});
  };

  const activeFiltersCount = Object.keys(selectedFilters).filter(
    key => selectedFilters[key] && 
    (Array.isArray(selectedFilters[key]) ? selectedFilters[key].length > 0 : true)
  ).length;

  return (
    <motion.div 
      className={`relative ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Filter Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all duration-300 ${
          isOpen 
            ? 'bg-cyan-500/20 border-cyan-400/50 text-cyan-400' 
            : 'bg-white/5 border-white/10 text-gray-300 hover:border-white/20 hover:text-white'
        }`}
      >
        <Filter className="w-4 h-4" />
        <span className="font-medium">Filtros</span>
        {activeFiltersCount > 0 && (
          <span className="px-2 py-1 text-xs bg-cyan-500 text-black rounded-full font-bold">
            {activeFiltersCount}
          </span>
        )}
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Filter Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 mt-2 p-4 bg-black/90 backdrop-blur-lg border border-white/10 rounded-xl shadow-2xl z-50"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-orbitron font-semibold text-white">Filtrar Resultados</h3>
              {activeFiltersCount > 0 && (
                <button
                  onClick={clearAllFilters}
                  className="text-sm text-gray-400 hover:text-white transition-colors flex items-center gap-1"
                >
                  <X className="w-3 h-3" />
                  Limpar
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filters.map((filter) => (
                <div key={filter.id} className="space-y-2">
                  <label className="block text-sm font-medium text-gray-300">
                    {filter.label}
                  </label>

                  {filter.type === 'select' && (
                    <div className="relative">
                      <button
                        onClick={() => toggleDropdown(filter.id)}
                        className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-left text-white hover:border-white/20 transition-colors flex justify-between items-center"
                      >
                        <span className={selectedFilters[filter.id] ? '' : 'text-gray-400'}>
                          {selectedFilters[filter.id] 
                            ? filter.options?.find(opt => opt.value === selectedFilters[filter.id])?.label 
                            : 'Selecionar...'
                          }
                        </span>
                        <ChevronDown className={`w-4 h-4 transition-transform ${
                          openDropdowns.has(filter.id) ? 'rotate-180' : ''
                        }`} />
                      </button>

                      <AnimatePresence>
                        {openDropdowns.has(filter.id) && (
                          <motion.div
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -5 }}
                            className="absolute top-full left-0 right-0 mt-1 py-2 bg-black/95 border border-white/10 rounded-lg shadow-xl z-10"
                          >
                            {filter.options?.map((option) => (
                              <button
                                key={option.id}
                                onClick={() => {
                                  handleFilterChange(filter.id, option.value);
                                  toggleDropdown(filter.id);
                                }}
                                className="w-full px-3 py-2 text-left text-white hover:bg-white/10 transition-colors"
                              >
                                {option.label}
                              </button>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )}

                  {filter.type === 'multiselect' && (
                    <div className="space-y-1 max-h-32 overflow-y-auto">
                      {filter.options?.map((option) => (
                        <label key={option.id} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={(selectedFilters[filter.id] || []).includes(option.value)}
                            onChange={(e) => {
                              const currentValues = selectedFilters[filter.id] || [];
                              const newValues = e.target.checked
                                ? [...currentValues, option.value]
                                : currentValues.filter((v: string) => v !== option.value);
                              handleFilterChange(filter.id, newValues);
                            }}
                            className="w-4 h-4 text-cyan-500 bg-white/10 border-white/20 rounded focus:ring-cyan-400 focus:ring-2"
                          />
                          <span className="text-sm text-gray-300">{option.label}</span>
                        </label>
                      ))}
                    </div>
                  )}

                  {filter.type === 'range' && (
                    <div className="space-y-2">
                      <input
                        type="range"
                        min={filter.min}
                        max={filter.max}
                        value={selectedFilters[filter.id] || filter.min}
                        onChange={(e) => handleFilterChange(filter.id, parseInt(e.target.value))}
                        className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer slider"
                      />
                      <div className="flex justify-between text-xs text-gray-400">
                        <span>{filter.min}</span>
                        <span className="text-cyan-400 font-medium">
                          {selectedFilters[filter.id] || filter.min}
                        </span>
                        <span>{filter.max}</span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
} 