import { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar, Clock, User, X } from 'lucide-react';
import * as Dialog from '@radix-ui/react-dialog';
import { toast } from 'sonner';

interface CalendarEvent {
  id: string;
  clientName: string;
  clientEmail?: string;
  clientPhone?: string;
  sessionType: string;
  date: Date;
  time: string;
  duration: number;
  advisor: string;
  status: 'scheduled' | 'blocked';
}

interface AdminCalendarViewProps {
  events: CalendarEvent[];
  onBlockTime?: (date: Date, time: string) => void;
  onUnblockTime?: (eventId: string) => void;
}

export function AdminCalendarView({ events, onBlockTime, onUnblockTime }: AdminCalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [showEventModal, setShowEventModal] = useState(false);

  // Generate calendar days for current month
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startDayOfWeek = firstDay.getDay();

    const days: (Date | null)[] = [];

    // Add empty slots for days before month starts
    for (let i = 0; i < startDayOfWeek; i++) {
      days.push(null);
    }

    // Add actual days
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }

    return days;
  };

  const getEventsForDate = (date: Date) => {
    return events.filter(event => {
      const eventDate = new Date(event.date);
      return eventDate.toDateString() === date.toDateString();
    });
  };

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const handleDateClick = (date: Date | null) => {
    if (!date) return;
    setSelectedDate(date);
  };

  const handleEventClick = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setShowEventModal(true);
  };

  const handleUnblock = () => {
    if (selectedEvent && selectedEvent.status === 'blocked' && onUnblockTime) {
      onUnblockTime(selectedEvent.id);
      toast.success('Time slot unblocked');
      setShowEventModal(false);
    }
  };

  const days = getDaysInMonth(currentDate);
  const monthName = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const selectedDateEvents = selectedDate ? getEventsForDate(selectedDate) : [];

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-2 bg-card border border-border rounded-xl p-6">
          {/* Month Navigation */}
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl" style={{ fontWeight: 600 }}>{monthName}</h3>
            <div className="flex gap-2">
              <button
                onClick={previousMonth}
                className="p-2 bg-accent border border-border rounded-lg hover:bg-accent/70 transition-all"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={nextMonth}
                className="p-2 bg-accent border border-border rounded-lg hover:bg-accent/70 transition-all"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Day Headers */}
          <div className="grid grid-cols-7 gap-2 mb-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div key={day} className="text-center text-sm text-muted-foreground p-2 font-semibold">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-2">
            {days.map((day, index) => {
              const isToday = day && day.toDateString() === today.toDateString();
              const isSelected = day && selectedDate && day.toDateString() === selectedDate.toDateString();
              const dayEvents = day ? getEventsForDate(day) : [];
              const hasEvents = dayEvents.length > 0;
              const hasBlocked = dayEvents.some(e => e.status === 'blocked');

              return (
                <button
                  key={index}
                  onClick={() => handleDateClick(day)}
                  disabled={!day}
                  className={`
                    min-h-[80px] p-2 rounded-lg text-sm transition-all border-2 relative
                    ${!day ? 'invisible' : ''}
                    ${isToday ? 'border-primary' : 'border-transparent'}
                    ${isSelected ? 'bg-primary/20 border-primary' : 'bg-accent hover:bg-accent/70'}
                    ${hasEvents && !isSelected ? 'border-primary/30' : ''}
                  `}
                >
                  {day && (
                    <div className="flex flex-col h-full">
                      <div className={`mb-1 ${isToday ? 'text-primary font-semibold' : ''}`}>
                        {day.getDate()}
                      </div>
                      {hasEvents && (
                        <div className="flex flex-col gap-1 flex-1">
                          {dayEvents.slice(0, 2).map((event) => (
                            <div
                              key={event.id}
                              className={`
                                text-[10px] px-1 py-0.5 rounded truncate
                                ${event.status === 'blocked' 
                                  ? 'bg-destructive/20 text-destructive' 
                                  : 'bg-primary/20 text-primary'
                                }
                              `}
                            >
                              {event.status === 'blocked' ? 'Blocked' : event.time}
                            </div>
                          ))}
                          {dayEvents.length > 2 && (
                            <div className="text-[10px] text-muted-foreground">
                              +{dayEvents.length - 2} more
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Day Details Sidebar */}
        <div className="bg-card border border-border rounded-xl p-6">
          <h3 className="text-lg mb-4" style={{ fontWeight: 600 }}>
            {selectedDate 
              ? selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
              : 'Select a date'}
          </h3>

          {selectedDate && selectedDateEvents.length > 0 ? (
            <div className="space-y-3">
              {selectedDateEvents.map((event) => (
                <button
                  key={event.id}
                  onClick={() => handleEventClick(event)}
                  className={`
                    w-full text-left p-4 rounded-lg transition-all
                    ${event.status === 'blocked'
                      ? 'bg-destructive/10 border border-destructive/30 hover:bg-destructive/20'
                      : 'bg-accent border border-border hover:bg-accent/70'
                    }
                  `}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-4 h-4 text-primary" />
                    <span className="font-semibold">{event.time}</span>
                    {event.status === 'blocked' && (
                      <span className="ml-auto text-xs text-destructive">Blocked</span>
                    )}
                  </div>
                  {event.status !== 'blocked' && (
                    <>
                      <div className="text-sm mb-1">{event.clientName}</div>
                      <div className="text-xs text-muted-foreground">{event.sessionType}</div>
                    </>
                  )}
                </button>
              ))}
            </div>
          ) : selectedDate ? (
            <div className="text-center py-8">
              <Calendar className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">No sessions scheduled</p>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-sm text-muted-foreground">Click a date to view scheduled sessions</p>
            </div>
          )}
        </div>
      </div>

      {/* Event Details Modal */}
      <Dialog.Root open={showEventModal} onOpenChange={setShowEventModal}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50" />
          <Dialog.Content 
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md p-8 bg-card border border-border rounded-2xl z-50"
            aria-describedby="event-description"
          >
            <div className="flex items-start justify-between mb-6">
              <Dialog.Title className="text-2xl">
                {selectedEvent?.status === 'blocked' ? 'Blocked Time' : 'Session Details'}
              </Dialog.Title>
              <Dialog.Description id="event-description" className="sr-only">
                View details for the selected calendar event
              </Dialog.Description>
              <Dialog.Close className="text-muted-foreground hover:text-foreground">
                <X className="w-5 h-5" />
              </Dialog.Close>
            </div>

            {selectedEvent && (
              <div className="space-y-4">
                {selectedEvent.status === 'blocked' ? (
                  <>
                    <div className="p-4 bg-destructive/10 border border-destructive/30 rounded-lg">
                      <div className="text-sm text-muted-foreground mb-1">Status</div>
                      <div className="text-destructive font-semibold">Time Blocked</div>
                    </div>
                    
                    <div className="p-4 bg-accent rounded-lg">
                      <div className="text-sm text-muted-foreground mb-1">Date & Time</div>
                      <div className="font-semibold">
                        {selectedEvent.date.toLocaleDateString('en-US', { 
                          weekday: 'long',
                          month: 'long', 
                          day: 'numeric', 
                          year: 'numeric' 
                        })}
                      </div>
                      <div className="text-primary">{selectedEvent.time}</div>
                    </div>

                    <button
                      onClick={handleUnblock}
                      className="w-full px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all"
                    >
                      Unblock This Time
                    </button>
                  </>
                ) : (
                  <>
                    <div className="p-4 bg-accent rounded-lg">
                      <div className="text-sm text-muted-foreground mb-1">Client</div>
                      <div className="text-lg font-semibold">{selectedEvent.clientName}</div>
                      {selectedEvent.clientEmail && (
                        <div className="text-sm text-muted-foreground mt-1">{selectedEvent.clientEmail}</div>
                      )}
                      {selectedEvent.clientPhone && (
                        <div className="text-sm text-muted-foreground">{selectedEvent.clientPhone}</div>
                      )}
                    </div>

                    <div className="p-4 bg-accent rounded-lg">
                      <div className="text-sm text-muted-foreground mb-1">Session Type</div>
                      <div className="font-semibold">{selectedEvent.sessionType}</div>
                    </div>

                    <div className="p-4 bg-accent rounded-lg">
                      <div className="text-sm text-muted-foreground mb-1">Date & Time</div>
                      <div className="font-semibold">
                        {selectedEvent.date.toLocaleDateString('en-US', { 
                          weekday: 'long',
                          month: 'long', 
                          day: 'numeric', 
                          year: 'numeric' 
                        })}
                      </div>
                      <div className="text-primary">{selectedEvent.time}</div>
                    </div>

                    <div className="p-4 bg-accent rounded-lg">
                      <div className="text-sm text-muted-foreground mb-1">Duration</div>
                      <div className="font-semibold">{selectedEvent.duration} minutes</div>
                    </div>

                    <div className="p-4 bg-accent rounded-lg">
                      <div className="text-sm text-muted-foreground mb-1">Advisor</div>
                      <div className="font-semibold">{selectedEvent.advisor}</div>
                    </div>

                    <div className="flex gap-3">
                      <button className="flex-1 px-6 py-3 bg-accent border border-border rounded-lg hover:bg-accent/70 transition-all">
                        Reschedule
                      </button>
                      <button className="flex-1 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all">
                        Send Reminder
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
}