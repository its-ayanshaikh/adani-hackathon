import { useParams, useNavigate } from 'react-router-dom';
import { Mail, Phone, Briefcase, ClipboardList } from 'lucide-react';
import { PageHeader } from '@/components/PageHeader';
import { Avatar } from '@/components/Avatar';
import { RequestCard } from '@/components/RequestCard';
import { teams, requests, equipment } from '@/data/mockData';

const TeamDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const team = teams.find(t => t.id === id);
  
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

  return (
    <div className="app-shell">
      <PageHeader 
        title={team.name}
        subtitle={`${team.members.length} members`}
        showBack
      />

      <main className="app-content">
        <div className="px-4 py-4 space-y-6">
          {/* Stats */}
          <section className="grid grid-cols-3 gap-3">
            <div className="p-4 bg-card rounded-xl border border-border text-center">
              <p className="text-2xl font-bold">{team.members.length}</p>
              <p className="text-xs text-muted-foreground">Members</p>
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

          {/* Team Members */}
          <section>
            <h2 className="text-base font-semibold font-display mb-3">Team Members</h2>
            <div className="space-y-3">
              {team.members.map(member => (
                <div
                  key={member.id}
                  className="p-4 bg-card rounded-xl border border-border flex items-center gap-4"
                >
                  <Avatar initials={member.avatar} size="lg" />
                  <div className="flex-1">
                    <p className="font-semibold">{member.name}</p>
                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                      <Briefcase className="w-3.5 h-3.5" />
                      <span>{member.role}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
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
