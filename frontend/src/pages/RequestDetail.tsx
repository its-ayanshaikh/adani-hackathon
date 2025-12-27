import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, Clock, Wrench, Users, AlertTriangle, CheckCircle, Play, Trash2 } from 'lucide-react';
import { PageHeader } from '@/components/PageHeader';
import { StatusBadge } from '@/components/StatusBadge';
import { PriorityBadge } from '@/components/PriorityBadge';
import { Avatar } from '@/components/Avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { 
  getRequestById, 
  updateRequest,
  updateRequestStage,
  MaintenanceRequest, 
  RequestStage, 
  stageLabels 
} from '@/lib/localStorage';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const stages: RequestStage[] = ['submitted', 'in_progress', 'repaired', 'scrap'];

const RequestDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [request, setRequest] = useState<MaintenanceRequest | null>(null);
  const [showRepairDialog, setShowRepairDialog] = useState(false);
  const [showScrapDialog, setShowScrapDialog] = useState(false);
  const [duration, setDuration] = useState('');
  const [scrapNote, setScrapNote] = useState('');

  useEffect(() => {
    if (id) {
      const data = getRequestById(id);
      setRequest(data || null);
    }
  }, [id]);
  
  if (!request) {
    return (
      <div className="app-shell">
        <PageHeader title="Request Not Found" showBack />
        <main className="app-content flex items-center justify-center">
          <p className="text-muted-foreground">This request doesn't exist.</p>
        </main>
      </div>
    );
  }

  const currentStageIndex = stages.indexOf(request.stage);

  const handleStageChange = (newStage: RequestStage) => {
    if (newStage === 'repaired') {
      setShowRepairDialog(true);
    } else if (newStage === 'scrap') {
      setShowScrapDialog(true);
    } else {
      updateRequestStage(request.id, newStage);
      setRequest({ ...request, stage: newStage });
      toast.success(`Status changed to ${stageLabels[newStage]}`);
    }
  };

  const handleRepairComplete = () => {
    const hours = parseFloat(duration) || 0;
    updateRequest(request.id, { 
      stage: 'repaired', 
      duration: hours 
    });
    setRequest({ ...request, stage: 'repaired', duration: hours });
    setShowRepairDialog(false);
    setDuration('');
    toast.success('Request marked as repaired');
  };

  const handleScrap = () => {
    updateRequest(request.id, { 
      stage: 'scrap', 
      scrapNote 
    });
    setRequest({ ...request, stage: 'scrap', scrapNote });
    setShowScrapDialog(false);
    setScrapNote('');
    toast.success('Request moved to scrap');
  };

  return (
    <div className="app-shell">
      <PageHeader 
        title={request.subject}
        showBack
      />

      <main className="app-content">
        <div className="px-4 py-4 space-y-6">
          {/* Status and Priority */}
          <section className="flex items-center gap-3 flex-wrap">
            <StatusBadge stage={request.stage} />
            <PriorityBadge priority={request.priority} />
            {request.type === 'preventive' && (
              <span className="px-2.5 py-1 bg-info/15 text-info text-xs font-medium rounded-full">
                Preventive
              </span>
            )}
            {request.isOverdue && (
              <span className="flex items-center gap-1 px-2.5 py-1 bg-destructive/15 text-destructive text-xs font-medium rounded-full">
                <AlertTriangle className="w-3 h-3" />
                Overdue
              </span>
            )}
          </section>

          {/* Stage Progress */}
          <section className="p-4 bg-card rounded-xl border border-border">
            <p className="text-sm font-medium text-muted-foreground mb-3">Progress</p>
            <div className="flex items-center gap-1">
              {stages.map((stage, index) => (
                <div
                  key={stage}
                  className={cn(
                    'flex-1 h-2 rounded-full transition-colors',
                    index <= currentStageIndex
                      ? stage === 'scrap' ? 'bg-muted-foreground' : 'bg-primary'
                      : 'bg-muted'
                  )}
                />
              ))}
            </div>
            <div className="flex justify-between mt-2">
              {stages.map((stage, index) => (
                <span 
                  key={stage}
                  className={cn(
                    'text-xs',
                    index <= currentStageIndex ? 'text-foreground font-medium' : 'text-muted-foreground'
                  )}
                >
                  {stageLabels[stage]}
                </span>
              ))}
            </div>
          </section>

          {/* Description */}
          <section className="p-4 bg-card rounded-xl border border-border">
            <p className="text-sm font-medium text-muted-foreground mb-2">Description</p>
            <p className="text-foreground">{request.description || 'No description provided'}</p>
          </section>

          {/* Equipment */}
          {request.equipmentName && (
            <section 
              className="p-4 bg-card rounded-xl border border-border"
            >
              <div className="flex items-center gap-2 text-muted-foreground mb-2">
                <Wrench className="w-4 h-4" />
                <span className="text-sm font-medium">Equipment</span>
              </div>
              <p className="font-semibold">{request.equipmentName}</p>
            </section>
          )}

          {/* Team & Assignee */}
          <section className="grid grid-cols-2 gap-3">
            {request.teamName && (
              <div className="p-4 bg-card rounded-xl border border-border">
                <div className="flex items-center gap-2 text-muted-foreground mb-2">
                  <Users className="w-4 h-4" />
                  <span className="text-xs font-medium">Team</span>
                </div>
                <p className="font-medium text-sm">{request.teamName}</p>
              </div>
            )}

            <div className="p-4 bg-card rounded-xl border border-border">
              <div className="flex items-center gap-2 text-muted-foreground mb-2">
                <Users className="w-4 h-4" />
                <span className="text-xs font-medium">Assigned To</span>
              </div>
              {request.technicianName ? (
                <div className="flex items-center gap-2">
                  <Avatar initials={request.technicianName.split(' ').map(n => n[0]).join('')} size="sm" />
                  <span className="font-medium text-sm">{request.technicianName}</span>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Unassigned</p>
              )}
            </div>
          </section>

          {/* Dates */}
          <section className="grid grid-cols-2 gap-3">
            <div className="p-4 bg-card rounded-xl border border-border">
              <div className="flex items-center gap-2 text-muted-foreground mb-2">
                <Calendar className="w-4 h-4" />
                <span className="text-xs font-medium">Created</span>
              </div>
              <p className="font-medium text-sm">
                {format(new Date(request.createdAt), 'MMM d, yyyy')}
              </p>
            </div>

            {request.scheduledDate && (
              <div className="p-4 rounded-xl border bg-card border-border">
                <div className="flex items-center gap-2 text-muted-foreground mb-2">
                  <Clock className="w-4 h-4" />
                  <span className="text-xs font-medium">
                    {request.type === 'preventive' ? 'Scheduled' : 'Due'}
                  </span>
                </div>
                <p className="font-medium text-sm">
                  {format(new Date(request.scheduledDate), 'MMM d, yyyy')}
                </p>
              </div>
            )}
          </section>

          {/* Duration (if completed) */}
          {request.duration && (
            <section className="p-4 bg-success/10 rounded-xl border border-success/30">
              <div className="flex items-center gap-2 text-success mb-1">
                <CheckCircle className="w-4 h-4" />
                <span className="text-sm font-medium">Completed</span>
              </div>
              <p className="text-foreground">
                Time spent: <span className="font-semibold">{request.duration} hours</span>
              </p>
              {request.completedAt && (
                <p className="text-sm text-muted-foreground mt-1">
                  Completed on {format(new Date(request.completedAt), 'MMM d, yyyy')}
                </p>
              )}
            </section>
          )}

          {/* Scrap Note (if scrapped) */}
          {request.stage === 'scrap' && request.scrapNote && (
            <section className="p-4 bg-destructive/10 rounded-xl border border-destructive/30">
              <div className="flex items-center gap-2 text-destructive mb-1">
                <Trash2 className="w-4 h-4" />
                <span className="text-sm font-medium">Scrap Note</span>
              </div>
              <p className="text-foreground">{request.scrapNote}</p>
            </section>
          )}

          {/* Actions */}
          <section className="space-y-3 pt-4">
            {request.stage === 'submitted' && (
              <Button 
                onClick={() => handleStageChange('in_progress')}
                className="w-full flex items-center justify-center gap-2"
              >
                <Play className="w-4 h-4" />
                Start Working
              </Button>
            )}
            
            {request.stage === 'in_progress' && (
              <Button 
                onClick={() => handleStageChange('repaired')}
                className="w-full flex items-center justify-center gap-2"
              >
                <CheckCircle className="w-4 h-4" />
                Mark as Repaired
              </Button>
            )}

            {(request.stage === 'submitted' || request.stage === 'in_progress') && (
              <Button 
                variant="outline" 
                onClick={() => handleStageChange('scrap')}
                className="w-full flex items-center justify-center gap-2 text-destructive hover:text-destructive"
              >
                <Trash2 className="w-4 h-4" />
                Move to Scrap
              </Button>
            )}

            {(request.stage === 'repaired' || request.stage === 'scrap') && (
              <div className="p-4 bg-muted rounded-xl text-center">
                <p className="text-sm text-muted-foreground">
                  This request has been {request.stage === 'repaired' ? 'completed' : 'scrapped'}
                </p>
              </div>
            )}
          </section>
        </div>
      </main>

      {/* Repair Completion Dialog */}
      <Dialog open={showRepairDialog} onOpenChange={setShowRepairDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Complete Repair</DialogTitle>
            <DialogDescription>
              Record the hours spent on this repair
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="duration">Duration (hours)</Label>
              <Input
                id="duration"
                type="number"
                step="0.5"
                min="0"
                placeholder="e.g., 2.5"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRepairDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleRepairComplete}>
              Complete Repair
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Scrap Dialog */}
      <Dialog open={showScrapDialog} onOpenChange={setShowScrapDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Move to Scrap</DialogTitle>
            <DialogDescription>
              Add a note about why this equipment is being scrapped
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="scrapNote">Scrap Note</Label>
              <Textarea
                id="scrapNote"
                placeholder="e.g., Equipment beyond repair, parts unavailable..."
                value={scrapNote}
                onChange={(e) => setScrapNote(e.target.value)}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowScrapDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleScrap}>
              Move to Scrap
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RequestDetail;
