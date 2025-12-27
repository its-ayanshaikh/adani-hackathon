import { useNavigate } from 'react-router-dom';
import { Users } from 'lucide-react';
import { Team } from '@/data/mockData';
import { Avatar } from './Avatar';

interface TeamCardProps {
  team: Team;
}

export function TeamCard({ team }: TeamCardProps) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/teams/${team.id}`)}
      className="equipment-card card-interactive"
    >
      <div className="flex items-center gap-3 mb-4">
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: team.color + '20' }}
        >
          <Users className="w-5 h-5" style={{ color: team.color }} />
        </div>
        <div>
          <h3 className="font-semibold text-base">{team.name}</h3>
          <p className="text-sm text-muted-foreground">
            {team.members.length} member{team.members.length > 1 ? 's' : ''}
          </p>
        </div>
      </div>

      <div className="flex items-center -space-x-2">
        {team.members.slice(0, 4).map((member) => (
          <Avatar
            key={member.id}
            initials={member.avatar}
            size="md"
            className="ring-2 ring-card"
          />
        ))}
        {team.members.length > 4 && (
          <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs font-medium ring-2 ring-card">
            +{team.members.length - 4}
          </div>
        )}
      </div>
    </div>
  );
}
