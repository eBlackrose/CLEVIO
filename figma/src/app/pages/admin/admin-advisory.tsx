import { useState } from 'react';
import { Calendar, Clock, User, CheckCircle2, AlertCircle, LayoutGrid, List, Ban, Plus } from 'lucide-react';
import { toast } from 'sonner';
import * as Dialog from '@radix-ui/react-dialog';
import { useAdminData, AdvisorySession } from '../../contexts/admin-data-context';

export function AdminAdvisory() {
  const { adminData, updateAdvisorySession, addBlockedDate, removeBlockedDate } = useAdminData();
  const [filterStatus, setFilterStatus] = useState<'all' | 'scheduled' | 'completed' | 'cancelled' | 'overdue'>('all');
  const [viewMode, setViewMode] = useState<'upcoming' | 'past'>('upcoming');
  const [viewType, setViewType] = useState<'calendar' | 'list'>('list');
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>('');
  
  // Block date form
  const [blockForm, setBlockForm] = useState({
    reason: '',
    isFullDay: true,
    startTime: '09:00',
    endTime: '17:00',
  });
  
  const sessions = adminData.advisorySessions;
  const blockedDates = adminData.blockedDates;
  
  const filteredSessions = sessions.filter(session => {
    const matchesStatus = filterStatus === 'all' || session.status === filterStatus;
    const isPast = session.status === 'completed' || session.status === 'cancelled';
    const matchesView = viewMode === 'upcoming' ? !isPast : isPast;
    return matchesStatus && matchesView;
  });
  
  const upcomingSessions = sessions.filter(s => s.status === 'scheduled' || s.status === 'overdue');
  const overdueSessions = sessions.filter(s => s.status === 'overdue');
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'text-primary bg-primary/20';
      case 'completed': return 'text-green-500 bg-green-500/20';
      case 'cancelled': return 'text-muted-foreground bg-muted';
      case 'overdue': return 'text-destructive bg-destructive/20';
      default: return 'text-muted-foreground bg-muted';
    }
  };
  
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'initial': return 'bg-blue-500/20 text-blue-500';
      case 'quarterly': return 'bg-purple-500/20 text-purple-500';
      case 'annual': return 'bg-orange-500/20 text-orange-500';
      case 'adhoc': return 'bg-green-500/20 text-green-500';
      default: return 'bg-muted text-muted-foreground';
    }
  };
  
  const handleComplete = (id: string, clientName: string) => {
    updateAdvisorySession(id, { status: 'completed' });
    toast.success(`Session completed for ${clientName}`);
  };
  
  const handleCancel = (id: string, clientName: string) => {
    updateAdvisorySession(id, { status: 'cancelled' });
    toast.info(`Session cancelled for ${clientName}`);
  };
  
  const handleBlockDate = () => {
    if (!selectedDate || !blockForm.reason) {
      toast.error('Please select a date and provide a reason');
      return;
    }
    
    addBlockedDate({
      date: selectedDate,
      reason: blockForm.reason,
      isFullDay: blockForm.isFullDay,
      startTime: blockForm.isFullDay ? undefined : blockForm.startTime,
      endTime: blockForm.isFullDay ? undefined : blockForm.endTime,
    });
    
    toast.success(`Date blocked: ${selectedDate}`);
    setShowBlockModal(false);
    setBlockForm({
      reason: '',
      isFullDay: true,
      startTime: '09:00',
      endTime: '17:00',
    });
    setSelectedDate('');
  };
  
  const handleRemoveBlock = (id: string, date: string) => {
    removeBlockedDate(id);
    toast.info(`Block removed for ${date}`);
  };
  
  // Generate calendar days for current month
  const generateCalendarDays = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startDayOfWeek = firstDay.getDay();
    
    const days: (Date | null)[] = [];
    for (let i = 0; i < startDayOfWeek; i++) {
      days.push(null);
    }
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    return days;
  };
  
  const calendarDays = generateCalendarDays();
  const monthName = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  
  const getSessionsForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return sessions.filter(s => s.scheduledDate === dateStr);
  };
  
  const isDateBlocked = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return blockedDates.some(b => b.date === dateStr);
  };
  
  const advisoryStats = {
    total: upcomingSessions.length,
    scheduled: sessions.filter(s => s.status === 'scheduled').length,
    overdue: overdueSessions.length,
  };
  
  return (
    <div className="p-6 lg:p-8">
      <div className="max-w-[1600px] mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl mb-2">Advisory Queue</h1>
          <p className="text-muted-foreground">Manage advisory sessions and advisor availability</p>
        </div>
        
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="p-6 bg-card border border-border rounded-xl">
            <div className="flex items-center justify-between mb-4">
              <div className="text-sm text-muted-foreground">Total Upcoming</div>
              <Calendar className="w-5 h-5 text-primary" />
            </div>
            <div className="text-3xl mb-1" style={{ fontWeight: 600 }}>{advisoryStats.total}</div>
          </div>
          
          <div className="p-6 bg-card border border-border rounded-xl">
            <div className="flex items-center justify-between mb-4">
              <div className="text-sm text-muted-foreground">Scheduled</div>
              <CheckCircle2 className="w-5 h-5 text-green-500" />
            </div>
            <div className="text-3xl mb-1" style={{ fontWeight: 600 }}>{advisoryStats.scheduled}</div>
          </div>
          
          <div className="p-6 bg-card border border-destructive/50 rounded-xl bg-destructive/5">
            <div className="flex items-center justify-between mb-4">
              <div className="text-sm text-muted-foreground">Overdue</div>
              <AlertCircle className="w-5 h-5 text-destructive" />
            </div>
            <div className="text-3xl text-destructive mb-1" style={{ fontWeight: 600 }}>{advisoryStats.overdue}</div>
          </div>
        </div>
        
        {/* View Controls */}
        <div className="mb-6 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div className="flex gap-2">
            <button
              onClick={() => setViewType('list')}
              className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 ${
                viewType === 'list' ? 'bg-primary text-primary-foreground' : 'bg-accent border border-border'
              }`}
            >
              <List className="w-4 h-4" />
              List View
            </button>
            <button
              onClick={() => setViewType('calendar')}
              className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 ${
                viewType === 'calendar' ? 'bg-primary text-primary-foreground' : 'bg-accent border border-border'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
              Calendar View
            </button>
          </div>
          
          <button
            onClick={() => setShowBlockModal(true)}
            className="px-4 py-2 bg-destructive/20 text-destructive border border-destructive/30 rounded-lg hover:bg-destructive/30 transition-all flex items-center gap-2"
          >
            <Ban className="w-4 h-4" />
            Block Availability
          </button>
        </div>
        
        {/* Calendar View */}
        {viewType === 'calendar' && (
          <div className="mb-8">
            <div className="bg-card border border-border rounded-xl p-6">
              <h3 className="text-xl mb-4" style={{ fontWeight: 600 }}>{monthName}</h3>
              
              <div className="grid grid-cols-7 gap-2">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} className="text-center text-sm text-muted-foreground p-2">
                    {day}
                  </div>
                ))}
                
                {calendarDays.map((day, index) => {
                  if (!day) {
                    return <div key={`empty-${index}`} className="aspect-square" />;
                  }
                  
                  const daySessions = getSessionsForDate(day);
                  const isBlocked = isDateBlocked(day);
                  const isToday = day.toDateString() === new Date().toDateString();
                  
                  return (
                    <div
                      key={index}
                      className={`aspect-square p-2 rounded-lg border transition-all ${
                        isBlocked 
                          ? 'bg-destructive/10 border-destructive/30 cursor-not-allowed' 
                          : isToday
                          ? 'bg-primary/10 border-primary'
                          : 'bg-accent border-border hover:border-primary cursor-pointer'
                      }`}
                      onClick={() => {
                        if (!isBlocked) {
                          setSelectedDate(day.toISOString().split('T')[0]);
                          setShowBlockModal(true);
                        }
                      }}
                    >
                      <div className="text-sm mb-1">{day.getDate()}</div>
                      {isBlocked && (
                        <div className="text-xs text-destructive">
                          <Ban className="w-3 h-3" />
                        </div>
                      )}
                      {daySessions.length > 0 && !isBlocked && (
                        <div className="text-xs text-primary">
                          {daySessions.length} session{daySessions.length > 1 ? 's' : ''}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
        
        {/* Blocked Dates List */}
        {blockedDates.length > 0 && (
          <div className="mb-8">
            <h3 className="text-xl mb-4" style={{ fontWeight: 600 }}>Blocked Dates</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {blockedDates.map(blocked => (
                <div key={blocked.id} className="p-4 bg-destructive/5 border border-destructive/30 rounded-xl">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Ban className="w-4 h-4 text-destructive" />
                      <span style={{ fontWeight: 600 }}>{blocked.date}</span>
                    </div>
                    <button
                      onClick={() => handleRemoveBlock(blocked.id, blocked.date)}
                      className="text-xs text-muted-foreground hover:text-foreground"
                    >
                      Remove
                    </button>
                  </div>
                  <p className="text-sm text-muted-foreground mb-1">{blocked.reason}</p>
                  {!blocked.isFullDay && (
                    <p className="text-xs text-muted-foreground">
                      {blocked.startTime} - {blocked.endTime}
                    </p>
                  )}
                  {blocked.isFullDay && (
                    <p className="text-xs text-muted-foreground">Full day</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Filters (List View) */}
        {viewType === 'list' && (
          <div className="mb-6 flex flex-col md:flex-row gap-4">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              <option value="all">All Statuses</option>
              <option value="scheduled">Scheduled</option>
              <option value="overdue">Overdue</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
            
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode('upcoming')}
                className={`px-4 py-3 rounded-lg transition-all ${
                  viewMode === 'upcoming' ? 'bg-primary text-primary-foreground' : 'bg-accent border border-border'
                }`}
              >
                Upcoming
              </button>
              <button
                onClick={() => setViewMode('past')}
                className={`px-4 py-3 rounded-lg transition-all ${
                  viewMode === 'past' ? 'bg-primary text-primary-foreground' : 'bg-accent border border-border'
                }`}
              >
                Past
              </button>
            </div>
          </div>
        )}
        
        {/* Sessions List */}
        {viewType === 'list' && (
          <div className="space-y-4">
            {filteredSessions.map((session) => (
              <div key={session.id} className="p-6 bg-card border border-border rounded-xl">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg" style={{ fontWeight: 600 }}>{session.clientName}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs uppercase ${getStatusColor(session.status)}`} style={{ fontWeight: 600 }}>
                        {session.status}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs capitalize ${getTypeColor(session.type)}`}>
                        {session.type}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-6 text-sm text-muted-foreground mb-2">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        {session.scheduledDate}
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        {session.scheduledTime} ({session.duration}min)
                      </div>
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        {session.advisorName}
                      </div>
                    </div>
                    
                    {session.notes && (
                      <p className="text-sm text-muted-foreground italic">{session.notes}</p>
                    )}
                  </div>
                </div>
                
                {session.status === 'scheduled' && (
                  <div className="flex items-center gap-3 pt-4 border-t border-border">
                    <button 
                      onClick={() => handleComplete(session.id, session.clientName)}
                      className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all text-sm"
                    >
                      Mark Complete
                    </button>
                    <button 
                      onClick={() => handleCancel(session.id, session.clientName)}
                      className="px-4 py-2 bg-accent border border-border rounded-lg hover:bg-accent/70 transition-all text-sm"
                    >
                      Cancel Session
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
        
        {viewType === 'list' && filteredSessions.length === 0 && (
          <div className="text-center py-16">
            <Calendar className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
            <h3 className="text-xl mb-2">No Sessions Found</h3>
            <p className="text-muted-foreground">
              {sessions.length === 0 
                ? 'No advisory sessions scheduled yet.' 
                : 'No sessions match the selected filters.'}
            </p>
          </div>
        )}
      </div>
      
      {/* Block Date Modal */}
      <Dialog.Root open={showBlockModal} onOpenChange={setShowBlockModal}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/80 z-50" />
          <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-[500px] max-h-[90vh] overflow-y-auto bg-card border border-border rounded-xl p-6 z-50">
            <Dialog.Title className="text-2xl mb-2" style={{ fontWeight: 600 }}>
              Block Advisor Availability
            </Dialog.Title>
            <Dialog.Description className="text-muted-foreground mb-6">
              Block dates or time slots when advisors are unavailable
            </Dialog.Description>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm mb-2">Date *</label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
              
              <div>
                <label className="block text-sm mb-2">Reason *</label>
                <input
                  type="text"
                  value={blockForm.reason}
                  onChange={(e) => setBlockForm({ ...blockForm, reason: e.target.value })}
                  placeholder="e.g., Holiday, Training, Conference"
                  className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
              
              <div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={blockForm.isFullDay}
                    onChange={(e) => setBlockForm({ ...blockForm, isFullDay: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <span className="text-sm">Block full day</span>
                </label>
              </div>
              
              {!blockForm.isFullDay && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm mb-2">Start Time</label>
                    <input
                      type="time"
                      value={blockForm.startTime}
                      onChange={(e) => setBlockForm({ ...blockForm, startTime: e.target.value })}
                      className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-2">End Time</label>
                    <input
                      type="time"
                      value={blockForm.endTime}
                      onChange={(e) => setBlockForm({ ...blockForm, endTime: e.target.value })}
                      className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowBlockModal(false);
                  setBlockForm({ reason: '', isFullDay: true, startTime: '09:00', endTime: '17:00' });
                  setSelectedDate('');
                }}
                className="flex-1 px-4 py-3 bg-accent border border-border rounded-lg hover:bg-accent/70 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleBlockDate}
                className="flex-1 px-4 py-3 bg-destructive text-destructive-foreground rounded-lg hover:bg-destructive/90 transition-all"
              >
                Block Date
              </button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
