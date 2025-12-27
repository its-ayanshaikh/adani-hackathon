import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ClipboardList, LayoutGrid, List, GripVertical } from 'lucide-react';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  useDroppable,
  DragStartEvent,
  DragEndEvent,
} from '@dnd-kit/core';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { PageHeader } from '@/components/PageHeader';
import { RequestCard } from '@/components/RequestCard';
import { StatusBadge } from '@/components/StatusBadge';
import { EmptyState } from '@/components/EmptyState';
import { FAB } from '@/components/FAB';
import { Input } from '@/components/ui/input';
import { requests as initialRequests, RequestStage, stageLabels, MaintenanceRequest } from '@/data/mockData';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

// Draggable Request Card
const DraggableRequestCard = ({ request, compact }: { request: MaintenanceRequest; compact?: boolean }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: request.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'relative group touch-manipulation',
        isDragging && 'z-50'
      )}
    >
      <div
        {...attributes}
        {...listeners}
        className="absolute left-0 top-0 bottom-0 w-8 flex items-center justify-center cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity z-10"
      >
        <GripVertical className="w-4 h-4 text-muted-foreground" />
      </div>
      <RequestCard request={request} compact={compact} />
    </div>
  );
};

// Droppable Column
const DroppableColumn = ({ 
  stage, 
  requests, 
  children 
}: { 
  stage: RequestStage; 
  requests: MaintenanceRequest[];
  children: React.ReactNode;
}) => {
  const { setNodeRef, isOver } = useDroppable({ id: stage });

  return (
    <div 
      ref={setNodeRef}
      className={cn(
        'kanban-column transition-all duration-200',
        isOver && 'ring-2 ring-primary ring-offset-2 ring-offset-background'
      )}
    >
      <div className="flex items-center justify-between mb-3">
        <StatusBadge stage={stage} />
        <span className="text-sm font-semibold text-muted-foreground">
          {requests.length}
        </span>
      </div>
      <div className="space-y-2 min-h-[100px]">
        {children}
        {requests.length === 0 && (
          <div className={cn(
            "text-center py-8 text-sm text-muted-foreground border-2 border-dashed rounded-lg transition-colors",
            isOver ? "border-primary bg-primary/5" : "border-border"
          )}>
            Drop here
          </div>
        )}
      </div>
    </div>
  );
};

const RequestList = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');
  const [filterStage, setFilterStage] = useState<RequestStage | null>(null);
  const [requestsData, setRequestsData] = useState<MaintenanceRequest[]>(initialRequests);
  const [activeRequest, setActiveRequest] = useState<MaintenanceRequest | null>(null);

  const stages: RequestStage[] = ['new', 'in_progress', 'repaired', 'scrap'];

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 200,
        tolerance: 5,
      },
    })
  );

  const filteredRequests = requestsData.filter(req => {
    const matchesSearch = req.subject.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStage = !filterStage || req.stage === filterStage;
    return matchesSearch && matchesStage;
  });

  const requestsByStage = stages.reduce((acc, stage) => {
    acc[stage] = filteredRequests.filter(r => r.stage === stage);
    return acc;
  }, {} as Record<RequestStage, MaintenanceRequest[]>);

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const request = requestsData.find(r => r.id === active.id);
    if (request) {
      setActiveRequest(request);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveRequest(null);

    if (!over) return;

    const requestId = active.id as string;
    const overId = over.id as string;

    // Check if dropping on a stage column
    const targetStage = stages.find(s => s === overId);
    
    if (targetStage) {
      // Dropped directly on a column
      updateRequestStage(requestId, targetStage);
    } else {
      // Dropped on another request - find which stage that request belongs to
      const targetRequest = requestsData.find(r => r.id === overId);
      if (targetRequest) {
        updateRequestStage(requestId, targetRequest.stage);
      }
    }
  };

  const updateRequestStage = (requestId: string, newStage: RequestStage) => {
    const request = requestsData.find(r => r.id === requestId);
    if (!request || request.stage === newStage) return;

    setRequestsData(prev =>
      prev.map(r =>
        r.id === requestId ? { ...r, stage: newStage } : r
      )
    );

    toast.success(`Moved to ${stageLabels[newStage]}`, {
      description: request.subject,
    });
  };

  return (
    <div className="app-shell">
      <PageHeader 
        title="Requests" 
        subtitle={`${requestsData.length} total requests`}
      />

      <main className="app-content">
        <div className="px-4 py-4 space-y-4">
          {/* Search and View Toggle */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search requests..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <button
              onClick={() => setViewMode(viewMode === 'kanban' ? 'list' : 'kanban')}
              className="p-2.5 rounded-lg border border-input bg-card touch-feedback"
            >
              {viewMode === 'kanban' ? (
                <List className="w-5 h-5" />
              ) : (
                <LayoutGrid className="w-5 h-5" />
              )}
            </button>
          </div>

          {/* Stage Filter Pills (for list view) */}
          {viewMode === 'list' && (
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4">
              <button
                onClick={() => setFilterStage(null)}
                className={cn(
                  'px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors',
                  !filterStage 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-muted text-muted-foreground'
                )}
              >
                All
              </button>
              {stages.map(stage => (
                <button
                  key={stage}
                  onClick={() => setFilterStage(stage)}
                  className={cn(
                    'px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors',
                    filterStage === stage 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-muted text-muted-foreground'
                  )}
                >
                  {stageLabels[stage]}
                </button>
              ))}
            </div>
          )}

          {/* Content */}
          {filteredRequests.length === 0 ? (
            <EmptyState
              icon={ClipboardList}
              title="No requests found"
              description="Try adjusting your search or create a new request."
              action={{
                label: 'New Request',
                onClick: () => navigate('/requests/new')
              }}
            />
          ) : viewMode === 'kanban' ? (
            /* Kanban View with Drag and Drop */
            <DndContext
              sensors={sensors}
              collisionDetection={closestCorners}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
            >
              <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4">
                {stages.map(stage => (
                  <DroppableColumn
                    key={stage}
                    stage={stage}
                    requests={requestsByStage[stage]}
                  >
                    {requestsByStage[stage].map(request => (
                      <DraggableRequestCard
                        key={request.id}
                        request={request}
                        compact
                      />
                    ))}
                  </DroppableColumn>
                ))}
              </div>
              
              <DragOverlay>
                {activeRequest && (
                  <div className="opacity-90 rotate-3 scale-105">
                    <RequestCard request={activeRequest} compact />
                  </div>
                )}
              </DragOverlay>
            </DndContext>
          ) : (
            /* List View */
            <div className="space-y-3">
              {filteredRequests.map(request => (
                <RequestCard key={request.id} request={request} />
              ))}
            </div>
          )}
        </div>
      </main>

      <FAB onClick={() => navigate('/requests/new')} />
    </div>
  );
};

export default RequestList;
