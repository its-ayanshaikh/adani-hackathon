import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Monitor, Calendar, Wrench, MapPin, User, Users, Shield, ClipboardList, Plus } from 'lucide-react';
import { PageHeader } from '@/components/PageHeader';
import { Button } from '@/components/ui/button';
import { RequestCard } from '@/components/RequestCard';
import {
  getEquipmentById,
  getRequests,
  Equipment,
  MaintenanceRequest,
} from '@/lib/localStorage';
import { format, differenceInMonths } from 'date-fns';
import { cn } from '@/lib/utils';

const EquipmentDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [equipment, setEquipment] = useState<Equipment | null>(null);
  const [requests, setRequests] = useState<MaintenanceRequest[]>([]);
  const [openRequestsCount, setOpenRequestsCount] = useState(0);

  useEffect(() => {
    if (id) {
      const eq = getEquipmentById(id);
      setEquipment(eq || null);

      if (eq) {
        const allRequests = getRequests();
        const equipmentRequests = allRequests.filter(r => r.equipmentId === eq.id);
        setRequests(equipmentRequests);
        
        const openCount = equipmentRequests.filter(
          r => r.stage === 'submitted' || r.stage === 'in_progress'
        ).length;
        setOpenRequestsCount(openCount);
      }
    }
  }, [id]);

  if (!equipment) {
    return (
      <div className="app-shell">
        <PageHeader title="Equipment Not Found" showBack />
        <main className="app-content flex items-center justify-center">
          <p className="text-muted-foreground">This equipment doesn't exist.</p>
        </main>
      </div>
    );
  }

  const warrantyMonthsLeft = differenceInMonths(
    new Date(equipment.purchaseDate).setMonth(
      new Date(equipment.purchaseDate).getMonth() + equipment.warrantyPeriod
    ),
    new Date()
  );

  const completedRequests = requests.filter(r => r.stage === 'repaired').length;
  const totalRepairTime = requests
    .filter(r => r.duration)
    .reduce((sum, r) => sum + (r.duration || 0), 0);

  const getStatusColor = (status: Equipment['status']) => {
    switch (status) {
      case 'operational':
        return 'bg-green-500';
      case 'maintenance':
        return 'bg-yellow-500';
      case 'out-of-order':
        return 'bg-red-500';
    }
  };

  return (
    <div className="app-shell">
      <PageHeader 
        title={equipment.name}
        subtitle={equipment.categoryName}
        showBack
        action={{
          label: 'Edit',
          onClick: () => navigate(`/equipment/list/edit/${equipment.id}`),
        }}
      />

      <main className="app-content">
        <div className="px-4 py-4 space-y-6">
          {/* Status Card */}
          <section className="p-4 bg-card rounded-xl border border-border">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={cn('w-4 h-4 rounded-full', getStatusColor(equipment.status))} />
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <p className="font-semibold capitalize">{equipment.status.replace('-', ' ')}</p>
                </div>
              </div>
              {openRequestsCount > 0 && (
                <span className="px-3 py-1.5 bg-primary/15 text-primary text-sm font-semibold rounded-full">
                  {openRequestsCount} Open
                </span>
              )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3">
              <div className="text-center p-3 bg-muted rounded-lg">
                <p className="text-xl font-bold">{requests.length}</p>
                <p className="text-xs text-muted-foreground">Total Requests</p>
              </div>
              <div className="text-center p-3 bg-muted rounded-lg">
                <p className="text-xl font-bold">{completedRequests}</p>
                <p className="text-xs text-muted-foreground">Completed</p>
              </div>
              <div className="text-center p-3 bg-muted rounded-lg">
                <p className="text-xl font-bold">{totalRepairTime.toFixed(1)}h</p>
                <p className="text-xs text-muted-foreground">Repair Time</p>
              </div>
            </div>
          </section>

          {/* Equipment Details */}
          <section className="space-y-3">
            <h2 className="text-base font-semibold font-display">Equipment Details</h2>
            
            <div className="p-4 bg-card rounded-xl border border-border space-y-3">
              <div className="flex items-start gap-3">
                <Monitor className="w-5 h-5 text-muted-foreground mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">Serial Number</p>
                  <p className="font-medium">{equipment.serialNumber}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-muted-foreground mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">Location</p>
                  <p className="font-medium">{equipment.location}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-muted-foreground mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">Purchase Date</p>
                  <p className="font-medium">{format(new Date(equipment.purchaseDate), 'MMM d, yyyy')}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-muted-foreground mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">Warranty</p>
                  <p className="font-medium">
                    {equipment.warrantyPeriod} months
                    {warrantyMonthsLeft > 0 && (
                      <span className="text-sm text-success ml-2">({warrantyMonthsLeft} months left)</span>
                    )}
                    {warrantyMonthsLeft <= 0 && (
                      <span className="text-sm text-destructive ml-2">(Expired)</span>
                    )}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Assignment */}
          <section className="space-y-3">
            <h2 className="text-base font-semibold font-display">Assignment</h2>
            
            <div className="p-4 bg-card rounded-xl border border-border space-y-3">
              <div className="flex items-start gap-3">
                <User className="w-5 h-5 text-muted-foreground mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">Assigned Employee</p>
                  <p className="font-medium">{equipment.employeeName}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Users className="w-5 h-5 text-muted-foreground mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">Maintenance Team</p>
                  <p className="font-medium">{equipment.teamName}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Wrench className="w-5 h-5 text-muted-foreground mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">Assigned Technician</p>
                  <p className="font-medium">{equipment.technicianName}</p>
                </div>
              </div>
            </div>
          </section>

          {/* Maintenance History */}
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold font-display">
                Maintenance History ({requests.length})
              </h2>
              <Button
                size="sm"
                onClick={() => navigate('/requests/new', { state: { equipmentId: equipment.id } })}
                className="flex items-center gap-1"
              >
                <Plus className="w-4 h-4" />
                New Request
              </Button>
            </div>

            {requests.length > 0 ? (
              <div className="space-y-3">
                {requests
                  .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                  .map(request => (
                    <RequestCard key={request.id} request={request} compact />
                  ))}
              </div>
            ) : (
              <div className="p-8 bg-card rounded-xl border border-border text-center">
                <ClipboardList className="w-10 h-10 mx-auto mb-2 text-muted-foreground" />
                <p className="text-muted-foreground mb-3">No maintenance history yet</p>
                <Button
                  onClick={() => navigate('/requests/new', { state: { equipmentId: equipment.id } })}
                >
                  Create First Request
                </Button>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
};

export default EquipmentDetailPage;
