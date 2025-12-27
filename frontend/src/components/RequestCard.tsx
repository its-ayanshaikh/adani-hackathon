import { useNavigate } from 'react-router-dom';
import { Clock, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { MaintenanceRequest, getEquipmentList, getTechnicians } from '@/lib/localStorage';
import { StatusBadge } from './StatusBadge';
import { PriorityBadge } from './PriorityBadge';
import { Avatar } from './Avatar';
import { format } from 'date-fns';

interface RequestCardProps {
  request: MaintenanceRequest;
  compact?: boolean;
}

export function RequestCard({ request, compact = false }: RequestCardProps) {
  const navigate = useNavigate();
  const equipmentList = getEquipmentList();
  const technicians = getTechnicians();
  const equipment = equipmentList.find(e => e.id === request.equipmentId);
  const assignee = request.assignedToId ? technicians.find(t => t.id === request.assignedToId) : null;

  const displayDate = request.scheduledDate || request.dueDate;

  return (
    <div
      onClick={() => navigate(`/requests/${request.id}`)}
      className={cn(
        'request-card card-interactive',
        request.isOverdue && 'request-card-overdue'
      )}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-sm truncate">{request.subject}</h3>
          {equipment && (
            <p className="text-xs text-muted-foreground truncate">
              {equipment.name}
            </p>
          )}
        </div>
        {assignee && (
          <Avatar initials={assignee.name.slice(0, 2).toUpperCase()} size="sm" />
        )}
      </div>

      {!compact && (
        <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
          {request.description}
        </p>
      )}

      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <PriorityBadge priority={request.priority} />
          {request.type === 'preventive' && (
            <span className="text-xs text-info font-medium">Preventive</span>
          )}
        </div>

        {displayDate && (
          <div className={cn(
            'flex items-center gap-1 text-xs',
            request.isOverdue ? 'text-destructive' : 'text-muted-foreground'
          )}>
            {request.isOverdue ? (
              <AlertTriangle className="w-3 h-3" />
            ) : (
              <Clock className="w-3 h-3" />
            )}
            <span>{format(new Date(displayDate), 'MMM d')}</span>
          </div>
        )}
      </div>
    </div>
  );
}
