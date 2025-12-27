import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ClipboardList, Wrench, AlertTriangle, CheckCircle, Clock, TrendingUp, Users, Monitor } from 'lucide-react';
import { PageHeader } from '@/components/PageHeader';
import { StatCard } from '@/components/StatCard';
import { RequestCard } from '@/components/RequestCard';
import { StatusBadge } from '@/components/StatusBadge';
import { 
  getRequests, 
  getEquipmentList, 
  getTeams, 
  getTechnicians,
  getEmployees,
  MaintenanceRequest, 
  Equipment, 
  Team,
  RequestStage 
} from '@/lib/localStorage';

const Dashboard = () => {
  const navigate = useNavigate();
  const [requests, setRequests] = useState<MaintenanceRequest[]>([]);
  const [equipmentList, setEquipmentList] = useState<Equipment[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [technicianCount, setTechnicianCount] = useState(0);
  const [employeeCount, setEmployeeCount] = useState(0);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setRequests(getRequests());
    setEquipmentList(getEquipmentList());
    setTeams(getTeams());
    setTechnicianCount(getTechnicians().length);
    setEmployeeCount(getEmployees().length);
  };

  // Stats calculation
  const stats = {
    totalRequests: requests.length,
    submitted: requests.filter(r => r.stage === 'submitted').length,
    inProgress: requests.filter(r => r.stage === 'in_progress').length,
    repaired: requests.filter(r => r.stage === 'repaired').length,
    scrap: requests.filter(r => r.stage === 'scrap').length,
    operational: equipmentList.filter(e => e.status === 'operational').length,
    maintenance: equipmentList.filter(e => e.status === 'maintenance').length,
    outOfOrder: equipmentList.filter(e => e.status === 'out-of-order').length,
  };

  const recentRequests = [...requests]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  const stages: RequestStage[] = ['submitted', 'in_progress', 'repaired', 'scrap'];

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
                value={equipmentList.length}
                icon={Monitor}
                onClick={() => navigate('/equipment')}
              />
              <StatCard
                label="In Progress"
                value={stats.inProgress}
                icon={Clock}
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

          {/* Equipment Status */}
          <section>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-semibold font-display">Equipment Status</h2>
              <button 
                onClick={() => navigate('/equipment')}
                className="text-sm text-primary font-medium"
              >
                View All
              </button>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 bg-card rounded-xl border border-border text-center">
                <div className="w-3 h-3 rounded-full bg-green-500 mx-auto mb-2" />
                <p className="text-xl font-bold">{stats.operational}</p>
                <p className="text-xs text-muted-foreground">Operational</p>
              </div>
              <div className="p-3 bg-card rounded-xl border border-border text-center">
                <div className="w-3 h-3 rounded-full bg-yellow-500 mx-auto mb-2" />
                <p className="text-xl font-bold">{stats.maintenance}</p>
                <p className="text-xs text-muted-foreground">Maintenance</p>
              </div>
              <div className="p-3 bg-card rounded-xl border border-border text-center">
                <div className="w-3 h-3 rounded-full bg-red-500 mx-auto mb-2" />
                <p className="text-xl font-bold">{stats.outOfOrder}</p>
                <p className="text-xs text-muted-foreground">Out of Order</p>
              </div>
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
            
            {teams.length > 0 ? (
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4">
                {teams.map(team => {
                  const teamRequests = requests.filter(r => r.teamId === team.id && r.stage !== 'repaired' && r.stage !== 'scrap').length;
                  const teamEquipment = equipmentList.filter(e => e.teamId === team.id).length;
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
                        <Users className="w-4 h-4" style={{ color: team.color }} />
                      </div>
                      <p className="font-medium text-sm truncate">{team.name}</p>
                      <p className="text-xs text-muted-foreground">{teamRequests} active • {teamEquipment} equip</p>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-6 bg-card rounded-xl border border-border text-center">
                <Users className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">No teams yet</p>
                <button 
                  onClick={() => navigate('/teams/add')}
                  className="mt-2 text-primary text-sm font-medium"
                >
                  Add Team
                </button>
              </div>
            )}
          </section>

          {/* People Stats */}
          <section>
            <h2 className="text-base font-semibold font-display mb-3">People</h2>
            <div className="grid grid-cols-2 gap-3">
              <div 
                onClick={() => navigate('/users/technicians')}
                className="p-4 bg-card rounded-xl border border-border flex items-center gap-3 cursor-pointer hover:shadow-md transition-shadow"
              >
                <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                  <Wrench className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-xl font-bold">{technicianCount}</p>
                  <p className="text-xs text-muted-foreground">Technicians</p>
                </div>
              </div>
              <div 
                onClick={() => navigate('/users/employees')}
                className="p-4 bg-card rounded-xl border border-border flex items-center gap-3 cursor-pointer hover:shadow-md transition-shadow"
              >
                <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                  <Users className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-xl font-bold">{employeeCount}</p>
                  <p className="text-xs text-muted-foreground">Employees</p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
