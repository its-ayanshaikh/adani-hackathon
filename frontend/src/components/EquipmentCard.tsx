import { useNavigate } from 'react-router-dom';
import { MapPin, Wrench, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Equipment, getTeamById } from '@/data/mockData';

interface EquipmentCardProps {
  equipment: Equipment;
}

const statusConfig = {
  active: { label: 'Active', class: 'bg-success/15 text-success' },
  maintenance: { label: 'Maintenance', class: 'bg-warning/15 text-warning' },
  scrapped: { label: 'Scrapped', class: 'bg-muted text-muted-foreground' },
};

export function EquipmentCard({ equipment }: EquipmentCardProps) {
  const navigate = useNavigate();
  const team = getTeamById(equipment.maintenanceTeamId);
  const config = statusConfig[equipment.status];

  return (
    <div
      onClick={() => navigate(`/equipment/${equipment.id}`)}
      className="equipment-card card-interactive"
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-base truncate">{equipment.name}</h3>
          <p className="text-sm text-muted-foreground">{equipment.category}</p>
        </div>
        <span className={cn(
          'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium shrink-0',
          config.class
        )}>
          {config.label}
        </span>
      </div>

      <div className="space-y-2 text-sm">
        <div className="flex items-center gap-2 text-muted-foreground">
          <MapPin className="w-4 h-4 shrink-0" />
          <span className="truncate">{equipment.location}</span>
        </div>

        {team && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Wrench className="w-4 h-4 shrink-0" />
            <span className="truncate">{team.name}</span>
          </div>
        )}
      </div>

      {equipment.openRequests > 0 && (
        <div className="mt-3 pt-3 border-t border-border">
          <div className="flex items-center gap-2 text-primary">
            <AlertCircle className="w-4 h-4" />
            <span className="text-sm font-medium">
              {equipment.openRequests} open request{equipment.openRequests > 1 ? 's' : ''}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
