import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MoreVertical, Edit, Trash2, Users, Wrench } from 'lucide-react';
import { PageHeader } from '@/components/PageHeader';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { getTeams, deleteTeam, getTechnicians, Team, Technician } from '@/lib/localStorage';
import { useToast } from '@/hooks/use-toast';

const TeamsList = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [teams, setTeams] = useState<Team[]>([]);
  const [technicians, setTechnicians] = useState<Technician[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const teamsData = getTeams();
    const techniciansData = getTechnicians();
    setTeams(teamsData);
    setTechnicians(techniciansData);
  };

  // Get technician count for a specific team
  const getTechnicianCount = (teamId: string) => {
    return technicians.filter(t => t.teamId === teamId).length;
  };

  const handleDelete = (id: string, name: string) => {
    deleteTeam(id);
    loadData();
    toast({
      title: 'Team deleted',
      description: `${name} has been deleted successfully.`,
    });
  };

  return (
    <div className="app-shell">
      <PageHeader 
        title="Teams" 
        subtitle={`${teams.length} maintenance teams`}
        action={{
          label: 'Add Team',
          onClick: () => navigate('/teams/add'),
        }}
      />

      <main className="app-content">
        <div className="px-4 py-4 space-y-6">
          {/* Teams Stats */}
          <section className="grid grid-cols-3 gap-3">
            {teams.map(team => {
              const techCount = getTechnicianCount(team.id);
              
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
                  <p className="text-2xl font-bold">{techCount}</p>
                  <p className="text-xs text-muted-foreground truncate">{team.name}</p>
                </div>
              );
            })}
          </section>

          {/* Teams List */}
          <section>
            <h2 className="text-base font-semibold font-display mb-3">All Teams</h2>
            <div className="space-y-3">
              {teams.map(team => {
                const techCount = getTechnicianCount(team.id);
                
                return (
                <div
                  key={team.id}
                  className="p-4 bg-card rounded-xl border border-border flex items-center justify-between"
                >
                  <div 
                    className="flex items-center gap-3 flex-1 cursor-pointer"
                    onClick={() => navigate(`/teams/${team.id}`)}
                  >
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: team.color + '30' }}
                    >
                      <Users className="w-5 h-5" style={{ color: team.color }} />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold">{team.name}</p>
                      <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Wrench className="w-3.5 h-3.5" />
                          {techCount} Technicians
                        </span>
                      </div>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => navigate(`/teams/edit/${team.id}`)}>
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleDelete(team.id, team.name)}
                        className="text-destructive"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                );})}
            </div>
          </section>

          {teams.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No teams found. Create your first team!</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default TeamsList;
