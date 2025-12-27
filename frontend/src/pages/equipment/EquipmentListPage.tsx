import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, MoreVertical, Edit, Trash2, Package, MapPin, User, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { getEquipmentList, getRequests, deleteEquipment, Equipment, MaintenanceRequest } from '@/lib/localStorage';
import { useToast } from '@/hooks/use-toast';

export default function EquipmentListPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [requests, setRequests] = useState<MaintenanceRequest[]>([]);

  useEffect(() => {
    loadEquipment();
    setRequests(getRequests());
  }, []);

  const loadEquipment = () => {
    const data = getEquipmentList();
    setEquipment(data);
  };

  // Calculate open requests count for each equipment
  const getOpenRequestsCount = (equipmentId: string) => {
    return requests.filter(
      r => r.equipmentId === equipmentId && (r.stage === 'submitted' || r.stage === 'in_progress')
    ).length;
  };

  const filteredEquipment = equipment.filter(
    (eq) =>
      eq.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      eq.serialNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      eq.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      eq.categoryName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = (id: string, name: string) => {
    deleteEquipment(id);
    loadEquipment();
    toast({
      title: 'Equipment deleted',
      description: `${name} has been deleted successfully.`,
    });
  };

  const getStatusColor = (status: Equipment['status']) => {
    switch (status) {
      case 'operational':
        return 'bg-green-100 text-green-700';
      case 'maintenance':
        return 'bg-yellow-100 text-yellow-700';
      case 'out-of-order':
        return 'bg-red-100 text-red-700';
    }
  };

  const getStatusDotColor = (status: Equipment['status']) => {
    switch (status) {
      case 'operational':
        return 'bg-green-500';
      case 'maintenance':
        return 'bg-yellow-500';
      case 'out-of-order':
        return 'bg-red-500';
    }
  };

  return (
    <div className="p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold">Equipment</h1>
          <p className="text-muted-foreground">Manage your equipment inventory</p>
        </div>
        <Button onClick={() => navigate('/equipment/list/add')}>
          <Plus className="w-4 h-4 mr-2" />
          Add Equipment
        </Button>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search equipment..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 max-w-md"
        />
      </div>

      {/* Equipment Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredEquipment.map((eq) => {
          const openRequests = getOpenRequestsCount(eq.id);
          
          return (
          <div
            key={eq.id}
            onClick={() => navigate(`/equipment/${eq.id}`)}
            className="bg-card border border-border rounded-xl p-4 hover:shadow-md transition-shadow relative cursor-pointer"
          >
            {/* Status Circle Indicator */}
            <div className={cn(
              'absolute top-3 right-3 w-4 h-4 rounded-full border-2 border-white shadow-sm',
              getStatusDotColor(eq.status)
            )} />
            
            {/* Smart Badge: Open Requests Count */}
            {openRequests > 0 && (
              <div className="absolute top-3 left-3 px-2 py-1 bg-primary text-primary-foreground text-xs font-bold rounded-full shadow-md">
                {openRequests}
              </div>
            )}
            
            <div className="flex items-start justify-between mb-3 pr-6 pl-8">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                  <Package className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold">{eq.name}</h3>
                  <p className="text-xs text-muted-foreground">{eq.serialNumber}</p>
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/equipment/list/edit/${eq.id}`);
                  }}>
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(eq.id, eq.name);
                    }}
                    className="text-destructive"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="w-4 h-4" />
                <span>{eq.location}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <User className="w-4 h-4" />
                <span>{eq.employeeName || 'Not assigned'}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Users className="w-4 h-4" />
                <span>{eq.teamName || 'No team'}</span>
              </div>
            </div>

            <div className="flex items-center justify-between mt-4 pt-3 border-t border-border">
              <span className="text-xs px-2 py-1 bg-muted rounded-md">{eq.categoryName}</span>
              <span
                className={cn(
                  'px-2 py-1 rounded-full text-xs font-medium capitalize',
                  getStatusColor(eq.status)
                )}
              >
                {eq.status.replace('-', ' ')}
              </span>
            </div>
          </div>
          );
        })}
      </div>

      {filteredEquipment.length === 0 && (
        <div className="text-center py-12">
          <Package className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
          <p className="text-muted-foreground">No equipment found</p>
          <Button 
            variant="link" 
            onClick={() => navigate('/equipment/list/add')}
            className="mt-2"
          >
            Add your first equipment
          </Button>
        </div>
      )}
    </div>
  );
}
