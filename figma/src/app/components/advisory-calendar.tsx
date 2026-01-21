import { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar, Clock, Ban } from 'lucide-react';
import * as Dialog from '@radix-ui/react-dialog';
import { useAdminData } from '../contexts/admin-data-context';

interface TimeSlot {
  time: string;
  available: boolean;
}

interface AdvisoryCalendarProps {
  sessionType: string;
  onBookSession: (date: string, time: string, duration: number) => void;
}

export function AdvisoryCalendar({ sessionType, onBookSession }: AdvisoryCalendarProps) {
  const { adminData, isDateBlocked } = useAdminData();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedDuration, setSelectedDuration] = useState<number>(60);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

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

  // Available time slots (9 AM to 5 PM, excluding lunch 12-1 PM)
  const timeSlots: TimeSlot[] = [
    { time: '9:00 AM', available: true },
    { time: '9:30 AM', available: true },
    { time: '10:00 AM', available: true },
    { time: '10:30 AM', available: false },
    { time: '11:00 AM', available: true },
    { time: '11:30 AM', available: true },
    { time: '1:00 PM', available: true },
    { time: '1:30 PM', available: true },
    { time: '2:00 PM', available: true },
    { time: '2:30 PM', available: false },
    { time: '3:00 PM', available: true },
    { time: '3:30 PM', available: true },
    { time: '4:00 PM', available: true },
    { time: '4:30 PM', available: true },
  ];

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    setSelectedDate(null);
    setSelectedTime(null);
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    setSelectedDate(null);
    setSelectedTime(null);
  };

  const handleDateClick = (date: Date | null) => {
    if (!date) return;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (date < today) return; // Can't select past dates
    
    setSelectedDate(date);
    setSelectedTime(null);
  };

  const handleTimeClick = (time: string, available: boolean) => {
    if (!available) return;
    setSelectedTime(time);
  };

  const handleConfirmBooking = () => {
    if (selectedDate && selectedTime) {
      const dateStr = selectedDate.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
      });
      onBookSession(dateStr, selectedTime, selectedDuration);
      setShowConfirmModal(false);
      setSelectedDate(null);
      setSelectedTime(null);
    }
  };

  const days = getDaysInMonth(currentDate);
  const monthName = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return (
    <>
      <div className="bg-card border border-border rounded-xl p-6">
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
            <div key={day} className="text-center text-sm text-muted-foreground p-2">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-2 mb-6">
          {days.map((day, index) => {
            const isToday = day && day.toDateString() === today.toDateString();
            const isPast = day && day < today;
            const isSelected = day && selectedDate && day.toDateString() === selectedDate.toDateString();
            const dateStr = day ? day.toISOString().split('T')[0] : '';
            const blocked = day ? isDateBlocked(dateStr) : false;
            const isDisabled = !day || isPast || blocked;

            return (
              <button
                key={index}
                onClick={() => handleDateClick(day)}
                disabled={isDisabled}
                className={`
                  aspect-square p-2 rounded-lg text-sm transition-all relative
                  ${!day ? 'invisible' : ''}
                  ${isPast && !blocked ? 'text-muted-foreground cursor-not-allowed' : ''}
                  ${blocked ? 'bg-destructive/10 border border-destructive/30 cursor-not-allowed text-destructive' : ''}
                  ${isToday && !blocked ? 'border-2 border-primary' : ''}
                  ${isSelected ? 'bg-primary text-primary-foreground' : ''}
                  ${!isPast && !isSelected && !blocked && day ? 'bg-accent hover:bg-accent/70 hover:border-primary/50' : ''}
                `}
              >
                {day && day.getDate()}
                {blocked && (
                  <Ban className="w-3 h-3 absolute top-1 right-1" />
                )}
              </button>
            );
          })}
        </div>

        {/* Time Slots */}
        {selectedDate && (
          <div className="pt-6 border-t border-border">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="w-5 h-5 text-primary" />
              <h4 className="text-lg">
                Available Times for {selectedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </h4>
            </div>
            
            <div className="grid grid-cols-3 md:grid-cols-4 gap-2 mb-6">
              {timeSlots.map((slot) => (
                <button
                  key={slot.time}
                  onClick={() => handleTimeClick(slot.time, slot.available)}
                  disabled={!slot.available}
                  className={`
                    p-3 rounded-lg text-sm transition-all
                    ${!slot.available ? 'bg-muted text-muted-foreground cursor-not-allowed' : ''}
                    ${slot.available && selectedTime === slot.time ? 'bg-primary text-primary-foreground' : ''}
                    ${slot.available && selectedTime !== slot.time ? 'bg-accent border border-border hover:bg-accent/70 hover:border-primary/50' : ''}
                  `}
                >
                  {slot.time}
                </button>
              ))}
            </div>

            {/* Duration Selection */}
            {selectedTime && (
              <>
                <div className="mb-4">
                  <label className="block text-sm mb-2">Session Duration</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[30, 60, 90].map((duration) => (
                      <button
                        key={duration}
                        onClick={() => setSelectedDuration(duration)}
                        className={`
                          p-3 rounded-lg text-sm transition-all
                          ${selectedDuration === duration 
                            ? 'bg-primary text-primary-foreground' 
                            : 'bg-accent border border-border hover:bg-accent/70'
                          }
                        `}
                      >
                        {duration} min
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => setShowConfirmModal(true)}
                  className="w-full px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all"
                >
                  Book Session
                </button>
              </>
            )}
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      <Dialog.Root open={showConfirmModal} onOpenChange={setShowConfirmModal}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50" />
          <Dialog.Content 
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md p-8 bg-card border border-border rounded-2xl z-50"
            aria-describedby="booking-description"
          >
            <Dialog.Title className="text-2xl mb-6">Confirm Session Booking</Dialog.Title>
            <Dialog.Description id="booking-description" className="sr-only">
              Review and confirm your advisory session booking details
            </Dialog.Description>
            
            <div className="space-y-4 mb-6">
              <div className="p-4 bg-accent rounded-lg">
                <div className="text-sm text-muted-foreground mb-1">Session Type</div>
                <div className="text-lg" style={{ fontWeight: 600 }}>{sessionType}</div>
              </div>
              
              <div className="p-4 bg-accent rounded-lg">
                <div className="text-sm text-muted-foreground mb-1">Date & Time</div>
                <div className="text-lg" style={{ fontWeight: 600 }}>
                  {selectedDate?.toLocaleDateString('en-US', { 
                    weekday: 'long',
                    month: 'long', 
                    day: 'numeric', 
                    year: 'numeric' 
                  })}
                </div>
                <div className="text-lg text-primary">{selectedTime}</div>
              </div>
              
              <div className="p-4 bg-accent rounded-lg">
                <div className="text-sm text-muted-foreground mb-1">Duration</div>
                <div className="text-lg" style={{ fontWeight: 600 }}>{selectedDuration} minutes</div>
              </div>
              
              <div className="p-4 bg-primary/10 border border-primary/30 rounded-lg">
                <div className="text-sm text-muted-foreground mb-1">Advisor</div>
                <div style={{ fontWeight: 600 }}>Sarah Mitchell, CPA</div>
                <div className="text-sm text-muted-foreground mt-2">
                  A meeting link will be sent to your email 24 hours before the session
                </div>
              </div>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 px-6 py-3 bg-accent border border-border rounded-lg hover:bg-accent/70 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmBooking}
                className="flex-1 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all"
              >
                Confirm Booking
              </button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
}