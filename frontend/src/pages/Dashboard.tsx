import { useNavigate } from 'react-router-dom';
import { ClipboardList, Wrench, AlertTriangle, CheckCircle, Clock, TrendingUp } from 'lucide-react';
import { PageHeader } from '@/components/PageHeader';
import { StatCard } from '@/components/StatCard';
import { RequestCard } from '@/components/RequestCard';
import { StatusBadge } from '@/components/StatusBadge';
import { requests, equipment, teams, RequestStage, stageLabels } from '@/data/mockData';

const Dashboard = () => {
  const navigate = useNavigate();

  // Stats calculation
  const stats = {
    totalRequests: requests.length,
    newRequests: requests.filter(r => r.stage === 'new').length,
    inProgress: requests.filter(r => r.stage === 'in_progress').length,
    overdue: requests.filter(r => r.isOverdue).length,
    repaired: requests.filter(r => r.stage === 'repaired').length,
  };

  const recentRequests = requests
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  const stages: RequestStage[] = ['new', 'in_progress', 'repaired', 'scrap'];

  return (
    <div className="app-shell">
      <PageHeader 
        title="GearGuard" 
        subtitle="Maintenance Dashboard"
      />

      <main className="app-content">
        <div className="px-4 py-4 space-y-6">
          {/* Overview Stats */}
          <section>
            <div className="grid grid-cols-2 gap-3">
              <StatCard
                label="Total Requests"
                value={stats.totalRequests}
                icon={ClipboardList}
                variant="primary"
                onClick={() => navigate('/requests')}
              />
              <StatCard
                label="Equipment"
                value={equipment.length}
                icon={Wrench}
                onClick={() => navigate('/equipment')}
              />
              <StatCard
                label="Overdue"
                value={stats.overdue}
                icon={AlertTriangle}
                variant="warning"
              />
              <StatCard
                label="Completed"
                value={stats.repaired}
                icon={CheckCircle}
                variant="success"
              />
            </div>
          </section>

          {/* Kanban Mini View */}
          <section>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-semibold font-display">Request Status</h2>
              <button 
                onClick={() => navigate('/requests')}
                className="text-sm text-primary font-medium"
              >
                View All
              </button>
            </div>
            
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4">
              {stages.map(stage => {
                const count = requests.filter(r => r.stage === stage).length;
                return (
                  <div
                    key={stage}
                    onClick={() => navigate('/requests')}
                    className="flex items-center gap-2 px-4 py-3 bg-card rounded-xl border border-border min-w-fit touch-feedback"
                  >
                    <StatusBadge stage={stage} size="sm" />
                    <span className="font-semibold">{count}</span>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Recent Requests */}
          <section>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-semibold font-display">Recent Requests</h2>
              <button 
                onClick={() => navigate('/requests')}
                className="text-sm text-primary font-medium"
              >
                See All
              </button>
            </div>
            
            <div className="space-y-3">
              {recentRequests.map(request => (
                <RequestCard key={request.id} request={request} />
              ))}
            </div>
          </section>

          {/* Quick Actions */}
          <section>
            <h2 className="text-base font-semibold font-display mb-3">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => navigate('/requests/new')}
                className="p-4 bg-primary text-primary-foreground rounded-xl font-medium touch-feedback flex items-center justify-center gap-2"
              >
                <ClipboardList className="w-5 h-5" />
                New Request
              </button>
              <button
                onClick={() => navigate('/calendar')}
                className="p-4 bg-secondary text-secondary-foreground rounded-xl font-medium touch-feedback flex items-center justify-center gap-2"
              >
                <Clock className="w-5 h-5" />
                Calendar
              </button>
            </div>
          </section>

          {/* Teams Overview */}
          <section>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-semibold font-display">Teams</h2>
              <button 
                onClick={() => navigate('/teams')}
                className="text-sm text-primary font-medium"
              >
                View All
              </button>
            </div>
            
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4">
              {teams.map(team => {
                const teamRequests = requests.filter(r => r.teamId === team.id && r.stage !== 'repaired' && r.stage !== 'scrap').length;
                return (
                  <div
                    key={team.id}
                    onClick={() => navigate(`/teams/${team.id}`)}
                    className="min-w-[140px] p-3 bg-card rounded-xl border border-border touch-feedback"
                  >
                    <div 
                      className="w-8 h-8 rounded-lg mb-2 flex items-center justify-center"
                      style={{ backgroundColor: team.color + '20' }}
                    >
                      <TrendingUp className="w-4 h-4" style={{ color: team.color }} />
                    </div>
                    <p className="font-medium text-sm truncate">{team.name}</p>
                    <p className="text-xs text-muted-foreground">{teamRequests} active</p>
                  </div>
                );
              })}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
