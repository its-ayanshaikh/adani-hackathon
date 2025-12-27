import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Calendar, Shield, Wrench, ClipboardList, Users, Hash } from 'lucide-react';
import { PageHeader } from '@/components/PageHeader';
import { RequestCard } from '@/components/RequestCard';
import { Avatar } from '@/components/Avatar';
import { Button } from '@/components/ui/button';
import { equipment, getTeamById, getMemberById, getRequestsByEquipment } from '@/data/mockData';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

const statusConfig = {
  active: { label: 'Active', class: 'bg-success/15 text-success' },
  maintenance: { label: 'In Maintenance', class: 'bg-warning/15 text-warning' },
  scrapped: { label: 'Scrapped', class: 'bg-muted text-muted-foreground' },
};

const EquipmentDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const eq = equipment.find(e => e.id === id);
  
  if (!eq) {
    return (
      <div className="app-shell">
        <PageHeader title="Equipment Not Found" showBack />
        <main className="app-content flex items-center justify-center">
          <p className="text-muted-foreground">This equipment doesn't exist.</p>
        </main>
      </div>
    );
  }

  const team = getTeamById(eq.maintenanceTeamId);
  const technician = eq.defaultTechnicianId ? getMemberById(eq.defaultTechnicianId) : null;
  const relatedRequests = getRequestsByEquipment(eq.id);
  const config = statusConfig[eq.status];

  const openRequests = relatedRequests.filter(r => r.stage !== 'repaired' && r.stage !== 'scrap');

  return (
    <div className="app-shell">
      <PageHeader 
        title={eq.name}
        subtitle={eq.category}
        showBack
      />

      <main className="app-content">
        <div className="px-4 py-4 space-y-6">
          {/* Status and Serial */}
          <section className="flex items-center justify-between">
            <span className={cn(
              'inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium',
              config.class
            )}>
              {config.label}
            </span>
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Hash className="w-4 h-4" />
              <span className="text-sm font-mono">{eq.serialNumber}</span>
            </div>
          </section>

          {/* Info Cards */}
          <section className="grid grid-cols-1 gap-3">
            <div className="p-4 bg-card rounded-xl border border-border">
              <div className="flex items-center gap-3 text-muted-foreground mb-3">
                <MapPin className="w-4 h-4" />
                <span className="text-sm font-medium">Location</span>
              </div>
              <p className="font-medium">{eq.location}</p>
              <p className="text-sm text-muted-foreground">{eq.department}</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 bg-card rounded-xl border border-border">
                <div className="flex items-center gap-2 text-muted-foreground mb-2">
                  <Calendar className="w-4 h-4" />
                  <span className="text-xs font-medium">Purchased</span>
                </div>
                <p className="font-medium text-sm">
                  {format(new Date(eq.purchaseDate), 'MMM d, yyyy')}
                </p>
              </div>

              <div className="p-4 bg-card rounded-xl border border-border">
                <div className="flex items-center gap-2 text-muted-foreground mb-2">
                  <Shield className="w-4 h-4" />
                  <span className="text-xs font-medium">Warranty</span>
                </div>
                <p className="font-medium text-sm">
                  {format(new Date(eq.warrantyExpiry), 'MMM d, yyyy')}
                </p>
              </div>
            </div>
          </section>

          {/* Assigned To */}
          {eq.assignedTo && (
            <section className="p-4 bg-card rounded-xl border border-border">
              <p className="text-sm text-muted-foreground mb-2">Assigned To</p>
              <p className="font-semibold">{eq.assignedTo}</p>
            </section>
          )}

          {/* Maintenance Team */}
          <section className="p-4 bg-card rounded-xl border border-border">
            <div className="flex items-center gap-2 text-muted-foreground mb-3">
              <Users className="w-4 h-4" />
              <span className="text-sm font-medium">Maintenance Team</span>
            </div>
            
            {team && (
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold">{team.name}</p>
                  {technician && (
                    <p className="text-sm text-muted-foreground">
                      Default: {technician.name}
                    </p>
                  )}
                </div>
                <div className="flex -space-x-2">
                  {team.members.slice(0, 3).map(member => (
                    <Avatar key={member.id} initials={member.avatar} size="sm" className="ring-2 ring-card" />
                  ))}
                </div>
              </div>
            )}
          </section>

          {/* Maintenance Button */}
          <section>
            <Button 
              onClick={() => navigate('/requests')}
              className="w-full flex items-center justify-center gap-2"
              variant="outline"
            >
              <ClipboardList className="w-4 h-4" />
              <span>Maintenance Requests</span>
              {openRequests.length > 0 && (
                <span className="ml-1 px-2 py-0.5 bg-primary text-primary-foreground text-xs rounded-full">
                  {openRequests.length}
                </span>
              )}
            </Button>
          </section>

          {/* Related Requests */}
          {relatedRequests.length > 0 && (
            <section>
              <h2 className="text-base font-semibold font-display mb-3">
                Request History ({relatedRequests.length})
              </h2>
              <div className="space-y-3">
                {relatedRequests.map(request => (
                  <RequestCard key={request.id} request={request} compact />
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
    </div>
  );
};

export default EquipmentDetail;
