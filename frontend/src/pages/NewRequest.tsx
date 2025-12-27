import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '@/components/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { equipment, teams, categories, RequestType } from '@/data/mockData';
import { toast } from '@/hooks/use-toast';

const NewRequest = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    subject: '',
    description: '',
    equipmentId: '',
    type: 'corrective' as RequestType,
    priority: 'medium' as 'low' | 'medium' | 'high',
    scheduledDate: '',
  });

  const selectedEquipment = equipment.find(e => e.id === formData.equipmentId);
  const autoFilledTeam = selectedEquipment ? teams.find(t => t.id === selectedEquipment.maintenanceTeamId) : null;

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
                {equipment.map(eq => (
                  <SelectItem key={eq.id} value={eq.id}>
                    {eq.name} - {eq.category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Auto-filled Team */}
          {autoFilledTeam && (
            <div className="p-4 bg-accent rounded-xl border border-accent-foreground/20">
              <p className="text-sm text-accent-foreground font-medium mb-1">
                Auto-assigned Team
              </p>
              <p className="font-semibold">{autoFilledTeam.name}</p>
              <p className="text-xs text-muted-foreground">
                Based on equipment maintenance assignment
              </p>
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
