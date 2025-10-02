import React from 'react';
import { Search, Filter } from 'lucide-react';
import { Input } from '../UI/Input';
import { Select } from '../UI/Select';

interface SearchFiltersProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  category: string;
  onCategoryChange: (category: string) => void;
  location: string;
  onLocationChange: (location: string) => void;
}

export const SearchFilters: React.FC<SearchFiltersProps> = ({
  searchTerm,
  onSearchChange,
  category,
  onCategoryChange,
  location,
  onLocationChange
}) => {
  const categories = [
    { value: '', label: 'All Categories' },
    { value: 'prepared_food', label: 'Prepared Food' },
    { value: 'fresh_produce', label: 'Fresh Produce' },
    { value: 'packaged_goods', label: 'Packaged Goods' },
    { value: 'dairy', label: 'Dairy' },
    { value: 'bakery', label: 'Bakery' },
    { value: 'other', label: 'Other' }
  ];

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
      <div className="flex items-center mb-4">
        <Filter className="w-5 h-5 text-gray-500 mr-2" />
        <h3 className="text-lg font-semibold text-gray-900">Search & Filter</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search food items..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Select
          options={categories}
          value={category}
          onChange={(e) => onCategoryChange(e.target.value)}
        />
        
        <Input
          placeholder="Location or area..."
          value={location}
          onChange={(e) => onLocationChange(e.target.value)}
        />
      </div>
    </div>
  );
};