import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, parseISO } from 'date-fns';
import { PageHeader } from '@/components/PageHeader';
import { Button } from '@/components/ui/button';
import { requests, getEquipmentById, getPreventiveRequests } from '@/data/mockData';
import { cn } from '@/lib/utils';

const CalendarView = () => {
  const navigate = useNavigate();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const preventiveRequests = getPreventiveRequests();

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Pad days for week alignment
  const startDay = monthStart.getDay();
  const paddedDays = [...Array(startDay).fill(null), ...days];

  const getRequestsForDate = (date: Date) => {
    return preventiveRequests.filter(r => {
      if (!r.scheduledDate) return false;
      return isSameDay(parseISO(r.scheduledDate), date);
    });
  };

  const selectedDateRequests = selectedDate ? getRequestsForDate(selectedDate) : [];

  return (
    <div className="app-shell">
      <PageHeader 
        title="Calendar" 
        subtitle="Preventive maintenance schedule"
        action={{
          label: 'Schedule',
          onClick: () => navigate('/requests/new')
        }}
      />

      <main className="app-content">
        <div className="px-4 py-4 space-y-4">
          {/* Month Navigation */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
              className="p-2 rounded-lg hover:bg-muted touch-feedback"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h2 className="text-lg font-semibold font-display">
              {format(currentMonth, 'MMMM yyyy')}
            </h2>
            <button
              onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
              className="p-2 rounded-lg hover:bg-muted touch-feedback"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Calendar Grid */}
          <div className="bg-card rounded-xl border border-border p-3">
            {/* Weekday Headers */}
            <div className="grid grid-cols-7 mb-2">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="text-center text-xs font-medium text-muted-foreground py-2">
                  {day}
                </div>
              ))}
            </div>

            {/* Days Grid */}
            <div className="grid grid-cols-7 gap-1">
              {paddedDays.map((day, index) => {
                if (!day) {
                  return <div key={`empty-${index}`} className="aspect-square" />;
                }

                const dayRequests = getRequestsForDate(day);
                const hasRequests = dayRequests.length > 0;
                const isSelected = selectedDate && isSameDay(day, selectedDate);
                const isToday = isSameDay(day, new Date());

                return (
                  <button
                    key={day.toISOString()}
                    onClick={() => setSelectedDate(day)}
                    className={cn(
                      'aspect-square rounded-lg flex flex-col items-center justify-center relative transition-colors',
                      isSelected 
                        ? 'bg-primary text-primary-foreground' 
                        : isToday
                          ? 'bg-accent text-accent-foreground'
                          : 'hover:bg-muted',
                    )}
                  >
                    <span className={cn(
                      'text-sm',
                      isSelected ? 'font-semibold' : ''
                    )}>
                      {format(day, 'd')}
                    </span>
                    {hasRequests && (
                      <div className={cn(
                        'absolute bottom-1 w-1.5 h-1.5 rounded-full',
                        isSelected ? 'bg-primary-foreground' : 'bg-primary'
                      )} />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Selected Date Requests */}
          {selectedDate && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold font-display">
                  {format(selectedDate, 'EEEE, MMMM d')}
                </h3>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => navigate('/requests/new')}
                  className="flex items-center gap-1"
                >
                  <Plus className="w-4 h-4" />
                  Add
                </Button>
              </div>

              {selectedDateRequests.length === 0 ? (
                <div className="p-6 bg-muted/50 rounded-xl text-center">
                  <p className="text-muted-foreground text-sm">
                    No maintenance scheduled for this date
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {selectedDateRequests.map(request => {
                    const equipment = getEquipmentById(request.equipmentId);
                    return (
                      <div
                        key={request.id}
                        onClick={() => navigate(`/requests/${request.id}`)}
                        className="p-4 bg-card rounded-xl border border-border touch-feedback"
                      >
                        <p className="font-medium">{request.subject}</p>
                        {equipment && (
                          <p className="text-sm text-muted-foreground">{equipment.name}</p>
                        )}
                        <span className="inline-block mt-2 px-2 py-0.5 bg-info/15 text-info text-xs font-medium rounded">
                          Preventive
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Upcoming Preventive Maintenance */}
          {!selectedDate && (
            <div className="space-y-3">
              <h3 className="font-semibold font-display">Upcoming Preventive</h3>
              {preventiveRequests
                .filter(r => r.scheduledDate && new Date(r.scheduledDate) >= new Date())
                .sort((a, b) => new Date(a.scheduledDate!).getTime() - new Date(b.scheduledDate!).getTime())
                .slice(0, 5)
                .map(request => {
                  const equipment = getEquipmentById(request.equipmentId);
                  return (
                    <div
                      key={request.id}
                      onClick={() => navigate(`/requests/${request.id}`)}
                      className="p-4 bg-card rounded-xl border border-border touch-feedback flex items-center justify-between"
                    >
                      <div>
                        <p className="font-medium">{request.subject}</p>
                        {equipment && (
                          <p className="text-sm text-muted-foreground">{equipment.name}</p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">
                          {format(new Date(request.scheduledDate!), 'MMM d')}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {format(new Date(request.scheduledDate!), 'EEE')}
                        </p>
                      </div>
                    </div>
                  );
                })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default CalendarView;
