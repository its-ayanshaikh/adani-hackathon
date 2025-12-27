import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, Clock, Wrench, Users, AlertTriangle, CheckCircle, Play, Trash2 } from 'lucide-react';
import { PageHeader } from '@/components/PageHeader';
import { StatusBadge } from '@/components/StatusBadge';
import { PriorityBadge } from '@/components/PriorityBadge';
import { Avatar } from '@/components/Avatar';
import { Button } from '@/components/ui/button';
import { requests, getEquipmentById, getTeamById, getMemberById, stageLabels, RequestStage } from '@/data/mockData';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

const stages: RequestStage[] = ['new', 'in_progress', 'repaired', 'scrap'];

const RequestDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const request = requests.find(r => r.id === id);
  
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

  const equipment = getEquipmentById(request.equipmentId);
  const team = getTeamById(request.teamId);
  const assignee = request.assignedToId ? getMemberById(request.assignedToId) : null;

  const currentStageIndex = stages.indexOf(request.stage);

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
            <p className="text-foreground">{request.description}</p>
          </section>

          {/* Equipment */}
          {equipment && (
            <section 
              onClick={() => navigate(`/equipment/${equipment.id}`)}
              className="p-4 bg-card rounded-xl border border-border touch-feedback cursor-pointer"
            >
              <div className="flex items-center gap-2 text-muted-foreground mb-2">
                <Wrench className="w-4 h-4" />
                <span className="text-sm font-medium">Equipment</span>
              </div>
              <p className="font-semibold">{equipment.name}</p>
              <p className="text-sm text-muted-foreground">{equipment.location}</p>
            </section>
          )}

          {/* Team & Assignee */}
          <section className="grid grid-cols-2 gap-3">
            {team && (
              <div className="p-4 bg-card rounded-xl border border-border">
                <div className="flex items-center gap-2 text-muted-foreground mb-2">
                  <Users className="w-4 h-4" />
                  <span className="text-xs font-medium">Team</span>
                </div>
                <p className="font-medium text-sm">{team.name}</p>
              </div>
            )}

            <div className="p-4 bg-card rounded-xl border border-border">
              <div className="flex items-center gap-2 text-muted-foreground mb-2">
                <Users className="w-4 h-4" />
                <span className="text-xs font-medium">Assigned To</span>
              </div>
              {assignee ? (
                <div className="flex items-center gap-2">
                  <Avatar initials={assignee.avatar} size="sm" />
                  <span className="font-medium text-sm">{assignee.name}</span>
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

            {(request.scheduledDate || request.dueDate) && (
              <div className={cn(
                'p-4 rounded-xl border',
                request.isOverdue 
                  ? 'bg-destructive/10 border-destructive/30' 
                  : 'bg-card border-border'
              )}>
                <div className="flex items-center gap-2 text-muted-foreground mb-2">
                  <Clock className="w-4 h-4" />
                  <span className="text-xs font-medium">
                    {request.type === 'preventive' ? 'Scheduled' : 'Due'}
                  </span>
                </div>
                <p className={cn(
                  'font-medium text-sm',
                  request.isOverdue && 'text-destructive'
                )}>
                  {format(new Date(request.scheduledDate || request.dueDate!), 'MMM d, yyyy')}
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
            </section>
          )}

          {/* Actions */}
          <section className="space-y-3 pt-4">
            {request.stage === 'new' && (
              <Button className="w-full flex items-center justify-center gap-2">
                <Play className="w-4 h-4" />
                Start Working
              </Button>
            )}
            
            {request.stage === 'in_progress' && (
              <Button className="w-full flex items-center justify-center gap-2">
                <CheckCircle className="w-4 h-4" />
                Mark as Repaired
              </Button>
            )}

            {(request.stage === 'new' || request.stage === 'in_progress') && (
              <Button 
                variant="outline" 
                className="w-full flex items-center justify-center gap-2 text-destructive hover:text-destructive"
              >
                <Trash2 className="w-4 h-4" />
                Move to Scrap
              </Button>
            )}
          </section>
        </div>
      </main>
    </div>
  );
};

export default RequestDetail;
