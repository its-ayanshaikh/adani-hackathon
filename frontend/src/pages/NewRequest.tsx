import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '@/components/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  getEquipmentList, 
  getTeams, 
  getTechnicians,
  addRequest,
  Equipment,
  Team,
  Technician,
  RequestType,
  RequestPriority,
} from '@/lib/localStorage';
import { toast } from '@/hooks/use-toast';

const NewRequest = () => {
  const navigate = useNavigate();
  
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [technicians, setTechnicians] = useState<Technician[]>([]);
  const [filteredTechnicians, setFilteredTechnicians] = useState<Technician[]>([]);

  const [formData, setFormData] = useState({
    subject: '',
    description: '',
    equipmentId: '',
    type: 'corrective' as RequestType,
    priority: 'medium' as RequestPriority,
    scheduledDate: '',
    teamId: '',
    technicianId: '',
  });

  useEffect(() => {
    setEquipment(getEquipmentList());
    setTeams(getTeams());
    setTechnicians(getTechnicians());
  }, []);

  // Auto-fill team when equipment is selected
  const selectedEquipment = equipment.find(e => e.id === formData.equipmentId);
  
  useEffect(() => {
    if (selectedEquipment?.teamId) {
      setFormData(prev => ({ ...prev, teamId: selectedEquipment.teamId }));
    }
  }, [selectedEquipment]);

  // Filter technicians based on selected team
  useEffect(() => {
    if (formData.teamId) {
      const teamTechs = technicians.filter(t => t.teamId === formData.teamId);
      setFilteredTechnicians(teamTechs);
      if (!teamTechs.find(t => t.id === formData.technicianId)) {
        setFormData(prev => ({ ...prev, technicianId: '' }));
      }
    } else {
      setFilteredTechnicians([]);
    }
  }, [formData.teamId, technicians]);

  const selectedTeam = teams.find(t => t.id === formData.teamId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.subject || !formData.equipmentId) {
      toast({
        title: 'Missing fields',
        description: 'Please fill in all required fields.',
        variant: 'destructive',
      });
      return;
    }

    const selectedTechnician = technicians.find(t => t.id === formData.technicianId);

    addRequest({
      subject: formData.subject,
      description: formData.description,
      equipmentId: formData.equipmentId,
      equipmentName: selectedEquipment?.name || '',
      type: formData.type,
      priority: formData.priority,
      teamId: formData.teamId,
      teamName: selectedTeam?.name || '',
      technicianId: formData.technicianId,
      technicianName: selectedTechnician ? `${selectedTechnician.firstName} ${selectedTechnician.lastName}` : '',
      scheduledDate: formData.scheduledDate,
    });

    toast({
      title: 'Request created',
      description: 'Your maintenance request has been submitted.',
    });
    
    navigate('/requests');
  };

  return (
    <div className="app-shell">
      <PageHeader 
        title="New Request" 
        subtitle="Create a maintenance request"
        showBack
      />

      <main className="app-content">
        <form onSubmit={handleSubmit} className="px-4 py-4 space-y-6">
          {/* Request Type */}
          <div className="space-y-2">
            <Label>Request Type</Label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, type: 'corrective' })}
                className={`p-4 rounded-xl border text-left transition-all ${
                  formData.type === 'corrective'
                    ? 'border-primary bg-primary/5'
                    : 'border-border bg-card'
                }`}
              >
                <p className="font-semibold">Corrective</p>
                <p className="text-xs text-muted-foreground">Unplanned breakdown repair</p>
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, type: 'preventive' })}
                className={`p-4 rounded-xl border text-left transition-all ${
                  formData.type === 'preventive'
                    ? 'border-primary bg-primary/5'
                    : 'border-border bg-card'
                }`}
              >
                <p className="font-semibold">Preventive</p>
                <p className="text-xs text-muted-foreground">Planned routine checkup</p>
              </button>
            </div>
          </div>

          {/* Subject */}
          <div className="space-y-2">
            <Label htmlFor="subject">Subject *</Label>
            <Input
              id="subject"
              placeholder="e.g., Leaking Oil, Routine Checkup"
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
            />
          </div>

          {/* Equipment */}
          <div className="space-y-2">
            <Label>Equipment *</Label>
            <Select
              value={formData.equipmentId}
              onValueChange={(value) => setFormData({ ...formData, equipmentId: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select equipment" />
              </SelectTrigger>
              <SelectContent>
                {equipment.length === 0 ? (
                  <SelectItem value="none" disabled>No equipment available</SelectItem>
                ) : (
                  equipment.map(eq => (
                    <SelectItem key={eq.id} value={eq.id}>
                      {eq.name} - {eq.categoryName || 'No Category'}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          {/* Auto-filled Team */}
          {selectedTeam && (
            <div className="p-4 bg-accent rounded-xl border border-accent-foreground/20">
              <p className="text-sm text-accent-foreground font-medium mb-1">
                Auto-assigned Team
              </p>
              <p className="font-semibold">{selectedTeam.name}</p>
              <p className="text-xs text-muted-foreground">
                Based on equipment maintenance assignment
              </p>
            </div>
          )}

          {/* Team Selection (if not auto-filled) */}
          {!selectedEquipment?.teamId && (
            <div className="space-y-2">
              <Label>Maintenance Team</Label>
              <Select
                value={formData.teamId}
                onValueChange={(value) => setFormData({ ...formData, teamId: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select team" />
                </SelectTrigger>
                <SelectContent>
                  {teams.map(team => (
                    <SelectItem key={team.id} value={team.id}>
                      {team.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Technician Selection */}
          {formData.teamId && (
            <div className="space-y-2">
              <Label>Assign Technician</Label>
              <Select
                value={formData.technicianId}
                onValueChange={(value) => setFormData({ ...formData, technicianId: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select technician (optional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Unassigned</SelectItem>
                  {filteredTechnicians.map(tech => (
                    <SelectItem key={tech.id} value={tech.id}>
                      {tech.firstName} {tech.lastName} - {tech.specialization}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {filteredTechnicians.length === 0 && (
                <p className="text-xs text-muted-foreground">No technicians in this team</p>
              )}
            </div>
          )}

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Describe the issue or maintenance needed..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
            />
          </div>

          {/* Priority */}
          <div className="space-y-2">
            <Label>Priority</Label>
            <Select
              value={formData.priority}
              onValueChange={(value: 'low' | 'medium' | 'high') => 
                setFormData({ ...formData, priority: value })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Scheduled Date (for preventive) */}
          {formData.type === 'preventive' && (
            <div className="space-y-2">
              <Label htmlFor="scheduledDate">Scheduled Date</Label>
              <Input
                id="scheduledDate"
                type="date"
                value={formData.scheduledDate}
                onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
              />
            </div>
          )}

          {/* Submit */}
          <div className="pt-4">
            <Button type="submit" className="w-full" size="lg">
              Create Request
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default NewRequest;
