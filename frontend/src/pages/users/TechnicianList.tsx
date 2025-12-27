import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, MoreVertical, Edit, Trash2, Mail, Phone, Wrench } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar } from '@/components/Avatar';
import { cn } from '@/lib/utils';
import { getTechnicians, deleteTechnician, Technician } from '@/lib/localStorage';
import { useToast } from '@/hooks/use-toast';

export default function TechnicianList() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [technicians, setTechnicians] = useState<Technician[]>([]);

  useEffect(() => {
    loadTechnicians();
  }, []);

  const loadTechnicians = () => {
    const data = getTechnicians();
    setTechnicians(data);
  };

  const filteredTechnicians = technicians.filter(
    (tech) =>
      tech.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tech.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tech.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tech.specialization.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = (id: string, name: string) => {
    deleteTechnician(id);
    loadTechnicians();
    toast({
      title: 'Technician deleted',
      description: `${name} has been deleted successfully.`,
    });
  };

  const getStatusColor = (status: Technician['status']) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-700';
      case 'busy':
        return 'bg-orange-100 text-orange-700';
      case 'off-duty':
        return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <div className="p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold">Technicians</h1>
          <p className="text-muted-foreground">Manage your technician workforce</p>
        </div>
        <Button onClick={() => navigate('/users/technicians/add')}>
          <Plus className="w-4 h-4 mr-2" />
          Add Technician
        </Button>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search technicians..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 max-w-md"
        />
      </div>

      {/* Technician Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredTechnicians.map((technician) => (
          <div
            key={technician.id}
            className="bg-card border border-border rounded-xl p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <Avatar
                  initials={`${technician.firstName[0]}${technician.lastName[0]}`}
                  size="lg"
                />
                <div>
                  <h3 className="font-semibold">
                    {technician.firstName} {technician.lastName}
                  </h3>
                  <p className="text-sm text-muted-foreground">{technician.specialization}</p>
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={() => navigate(`/users/technicians/edit/${technician.id}`)}
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleDelete(technician.id, `${technician.firstName} ${technician.lastName}`)}
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
                <Mail className="w-4 h-4" />
                <span className="truncate">{technician.email}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Phone className="w-4 h-4" />
                <span>{technician.phone}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Wrench className="w-4 h-4" />
                <span>{technician.teamName}</span>
              </div>
            </div>

            <div className="flex items-center justify-between mt-4 pt-3 border-t border-border">
              <div className="flex items-center gap-3 text-sm">
                <span className="text-muted-foreground">
                  {technician.completedJobs} jobs
                </span>
                <span className="text-yellow-600">★ {technician.rating}</span>
              </div>
              <span
                className={cn(
                  'px-2 py-1 rounded-full text-xs font-medium capitalize',
                  getStatusColor(technician.status)
                )}
              >
                {technician.status.replace('-', ' ')}
              </span>
            </div>
          </div>
        ))}
      </div>

      {filteredTechnicians.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No technicians found</p>
        </div>
      )}
    </div>
  );
}
