import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Mail, Phone, Briefcase, Wrench } from 'lucide-react';
import { PageHeader } from '@/components/PageHeader';
import { Avatar } from '@/components/Avatar';
import { RequestCard } from '@/components/RequestCard';
import { requests, equipment } from '@/data/mockData';
import { getTeamById, getTechnicians, Technician } from '@/lib/localStorage';
import { cn } from '@/lib/utils';

const TeamDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [technicians, setTechnicians] = useState<Technician[]>([]);

  const team = id ? getTeamById(id) : undefined;

  useEffect(() => {
    if (team) {
      const allTechnicians = getTechnicians();
      const teamTechnicians = allTechnicians.filter(t => t.teamId === team.id);
      setTechnicians(teamTechnicians);
    }
  }, [team]);
  
  if (!team) {
    return (
      <div className="app-shell">
        <PageHeader title="Team Not Found" showBack />
        <main className="app-content flex items-center justify-center">
          <p className="text-muted-foreground">This team doesn't exist.</p>
        </main>
      </div>
    );
  }

  const teamRequests = requests.filter(r => r.teamId === team.id);
  const activeRequests = teamRequests.filter(r => r.stage !== 'repaired' && r.stage !== 'scrap');
  const assignedEquipment = equipment.filter(e => e.maintenanceTeamId === team.id);

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
    <div className="app-shell">
      <PageHeader 
        title={team.name}
        subtitle={`${technicians.length} technicians`}
        showBack
      />

      <main className="app-content">
        <div className="px-4 py-4 space-y-6">
          {/* Stats */}
          <section className="grid grid-cols-3 gap-3">
            <div className="p-4 bg-card rounded-xl border border-border text-center">
              <p className="text-2xl font-bold">{technicians.length}</p>
              <p className="text-xs text-muted-foreground">Technicians</p>
            </div>
            <div className="p-4 bg-card rounded-xl border border-border text-center">
              <p className="text-2xl font-bold">{activeRequests.length}</p>
              <p className="text-xs text-muted-foreground">Active</p>
            </div>
            <div className="p-4 bg-card rounded-xl border border-border text-center">
              <p className="text-2xl font-bold">{assignedEquipment.length}</p>
              <p className="text-xs text-muted-foreground">Equipment</p>
            </div>
          </section>

          {/* Team Technicians */}
          <section>
            <h2 className="text-base font-semibold font-display mb-3">Technicians ({technicians.length})</h2>
            {technicians.length > 0 ? (
              <div className="space-y-3">
                {technicians.map(tech => (
                  <div
                    key={tech.id}
                    onClick={() => navigate(`/users/technicians/edit/${tech.id}`)}
                    className="p-4 bg-card rounded-xl border border-border flex items-center gap-4 cursor-pointer hover:shadow-md transition-shadow"
                  >
                    <Avatar initials={`${tech.firstName[0]}${tech.lastName[0]}`} size="lg" />
                    <div className="flex-1">
                      <p className="font-semibold">{tech.firstName} {tech.lastName}</p>
                      <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                        <Wrench className="w-3.5 h-3.5" />
                        <span>{tech.specialization}</span>
                      </div>
                    </div>
                    <span
                      className={cn(
                        'px-2 py-1 rounded-full text-xs font-medium capitalize',
                        getStatusColor(tech.status)
                      )}
                    >
                      {tech.status.replace('-', ' ')}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 bg-card rounded-xl border border-border text-center">
                <Wrench className="w-10 h-10 mx-auto mb-2 text-muted-foreground" />
                <p className="text-muted-foreground">No technicians in this team yet</p>
                <button 
                  onClick={() => navigate('/users/technicians/add')}
                  className="mt-2 text-primary text-sm font-medium"
                >
                  Add Technician
                </button>
              </div>
            )}
          </section>

          {/* Active Requests */}
          {activeRequests.length > 0 && (
            <section>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-base font-semibold font-display">
                  Active Requests ({activeRequests.length})
                </h2>
              </div>
              <div className="space-y-3">
                {activeRequests.slice(0, 5).map(request => (
                  <RequestCard key={request.id} request={request} compact />
                ))}
                {activeRequests.length > 5 && (
                  <button
                    onClick={() => navigate('/requests')}
                    className="w-full p-3 text-center text-sm text-primary font-medium"
                  >
                    View all {activeRequests.length} requests
                  </button>
                )}
              </div>
            </section>
          )}

          {/* Assigned Equipment */}
          <section>
            <h2 className="text-base font-semibold font-display mb-3">
              Assigned Equipment ({assignedEquipment.length})
            </h2>
            <div className="space-y-2">
              {assignedEquipment.map(eq => (
                <div
                  key={eq.id}
                  onClick={() => navigate(`/equipment/${eq.id}`)}
                  className="p-3 bg-card rounded-lg border border-border flex items-center justify-between touch-feedback"
                >
                  <div>
                    <p className="font-medium text-sm">{eq.name}</p>
                    <p className="text-xs text-muted-foreground">{eq.location}</p>
                  </div>
                  {eq.openRequests > 0 && (
                    <span className="px-2 py-0.5 bg-primary/15 text-primary text-xs font-medium rounded-full">
                      {eq.openRequests}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default TeamDetail;
