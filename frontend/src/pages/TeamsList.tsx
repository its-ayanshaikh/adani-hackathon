import { useNavigate } from 'react-router-dom';
import { PageHeader } from '@/components/PageHeader';
import { TeamCard } from '@/components/TeamCard';
import { teams, requests } from '@/data/mockData';

const TeamsList = () => {
  const navigate = useNavigate();

  return (
    <div className="app-shell">
      <PageHeader 
        title="Teams" 
        subtitle={`${teams.length} maintenance teams`}
      />

      <main className="app-content">
        <div className="px-4 py-4 space-y-6">
          {/* Teams Stats */}
          <section className="grid grid-cols-3 gap-3">
            {teams.map(team => {
              const activeCount = requests.filter(
                r => r.teamId === team.id && r.stage !== 'repaired' && r.stage !== 'scrap'
              ).length;
              
              return (
                <div
                  key={team.id}
                  onClick={() => navigate(`/teams/${team.id}`)}
                  className="p-3 bg-card rounded-xl border border-border text-center touch-feedback"
                >
                  <div 
                    className="w-8 h-8 rounded-full mx-auto mb-2"
                    style={{ backgroundColor: team.color + '30' }}
                  />
                  <p className="text-2xl font-bold">{activeCount}</p>
                  <p className="text-xs text-muted-foreground truncate">{team.name}</p>
                </div>
              );
            })}
          </section>

          {/* Teams List */}
          <section>
            <h2 className="text-base font-semibold font-display mb-3">All Teams</h2>
            <div className="space-y-3">
              {teams.map(team => (
                <TeamCard key={team.id} team={team} />
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default TeamsList;
