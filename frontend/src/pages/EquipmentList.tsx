import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Grid3X3, List, Wrench } from 'lucide-react';
import { PageHeader } from '@/components/PageHeader';
import { EquipmentCard } from '@/components/EquipmentCard';
import { EmptyState } from '@/components/EmptyState';
import { FAB } from '@/components/FAB';
import { Input } from '@/components/ui/input';
import { equipment, categories, departments } from '@/data/mockData';
import { cn } from '@/lib/utils';

const EquipmentList = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const filteredEquipment = equipment.filter(eq => {
    const matchesSearch = eq.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      eq.serialNumber.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || eq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="app-shell">
      <PageHeader 
        title="Equipment" 
        subtitle={`${equipment.length} total assets`}
      />

      <main className="app-content">
        <div className="px-4 py-4 space-y-4">
          {/* Search and Filters */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search equipment..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <button
              onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
              className="p-2.5 rounded-lg border border-input bg-card touch-feedback"
            >
              {viewMode === 'grid' ? (
                <List className="w-5 h-5" />
              ) : (
                <Grid3X3 className="w-5 h-5" />
              )}
            </button>
          </div>

          {/* Category Filter */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4">
            <button
              onClick={() => setSelectedCategory(null)}
              className={cn(
                'px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors',
                !selectedCategory 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-muted text-muted-foreground'
              )}
            >
              All
            </button>
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={cn(
                  'px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors',
                  selectedCategory === category 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-muted text-muted-foreground'
                )}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Equipment List */}
          {filteredEquipment.length === 0 ? (
            <EmptyState
              icon={Wrench}
              title="No equipment found"
              description="Try adjusting your search or filters to find what you're looking for."
            />
          ) : (
            <div className={cn(
              viewMode === 'grid' 
                ? 'grid grid-cols-1 sm:grid-cols-2 gap-3'
                : 'space-y-3'
            )}>
              {filteredEquipment.map(eq => (
                <EquipmentCard key={eq.id} equipment={eq} />
              ))}
            </div>
          )}
        </div>
      </main>

      <FAB onClick={() => navigate('/equipment/new')} />
    </div>
  );
};

export default EquipmentList;
