import { useState, useEffect } from 'react';
import { Calendar, Lock, Video, AlertCircle, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { useUser } from '../../contexts/user-context';
import { useAdminData } from '../../contexts/admin-data-context';
import { AdvisoryCalendar } from '../../components/advisory-calendar';
import * as Tabs from '@radix-ui/react-tabs';

interface AdvisorySession {
  id: string;
  type: string;
  date: string;
  time: string;
  duration: number;
  advisor: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  link?: string;
}

export function AdvisoryPage() {
  const { userData, updateUserData } = useUser();
  const { adminData } = useAdminData();
  const [sessions, setSessions] = useState<AdvisorySession[]>([]);
  const [selectedSessionType, setSelectedSessionType] = useState<string | null>(null);

  // Load sessions from userData
  useEffect(() => {
    if (userData?.advisorySessions) {
      setSessions(userData.advisorySessions);
    }
  }, [userData?.advisorySessions]);

  const employeeCount = userData?.employees?.length || 0;
  const hasMinimum = employeeCount >= 5;
  const hasAdvisoryTier = userData?.selectedTiers?.advisory || false;
  const hasTaxTier = userData?.selectedTiers?.tax || false;
  const hasActiveTier = hasAdvisoryTier || hasTaxTier;
  const canSchedule = hasMinimum && hasActiveTier;

  const sessionTypes = [
    {
      id: 'quarterly-review',
      name: 'Quarterly Review',
      description: 'Review your quarterly financial performance and plan for the next quarter',
      duration: 60,
      available: hasAdvisoryTier,
    },
    {
      id: 'annual-planning',
      name: 'Annual Planning',
      description: 'Strategic planning session for the upcoming fiscal year',
      duration: 90,
      available: hasAdvisoryTier,
    },
    {
      id: 'tax-strategy',
      name: 'Tax Strategy Session',
      description: 'Tax planning and optimization with a licensed CPA',
      duration: 60,
      available: hasTaxTier,
    },
    {
      id: 'cash-flow',
      name: 'Cash Flow Analysis',
      description: 'Deep dive into cash flow optimization and forecasting',
      duration: 60,
      available: hasAdvisoryTier,
    },
  ];

  const handleBookSession = (type: string, date: string, time: string, duration: number) => {
    const newSession: AdvisorySession = {
      id: Date.now().toString(),
      type,
      date,
      time,
      duration,
      advisor: 'Sarah Mitchell, CPA',
      status: 'scheduled',
      link: `https://meet.clevio.com/${Math.random().toString(36).substring(7)}`,
    };

    const updatedSessions = [...sessions, newSession];
    setSessions(updatedSessions);
    updateUserData({ advisorySessions: updatedSessions });

    // Simulate sending notification email
    toast.success('Session booked successfully!', {
      description: 'Confirmation sent to operations team',
    });

    // Simulate email notification (would be actual API call in production)
    console.log('📧 Email sent to chad@huzle.com:');
    console.log({
      subject: 'New Advisory Session Booking',
      to: 'chad@huzle.com',
      body: {
        companyName: userData?.companyName || 'Company',
        contactEmail: userData?.email,
        contactPhone: userData?.phone || 'Not provided',
        sessionType: type,
        dateTime: `${date} at ${time}`,
        duration: `${duration} minutes`,
        advisor: 'Sarah Mitchell, CPA',
      },
    });

    setSelectedSessionType(null);
  };

  const handleReschedule = (sessionId: string) => {
    toast.info('Reschedule feature coming soon');
  };

  const upcomingSessions = sessions.filter(s => s.status === 'scheduled');
  const pastSessions = sessions.filter(s => s.status !== 'scheduled');

  return (
    <div className="p-6 lg:p-12">
      <div className="max-w-[1200px] mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl mb-2">Advisory Sessions</h1>
          <p className="text-muted-foreground">Schedule time with licensed financial professionals</p>
        </div>

        {/* Access Control Alert */}
        {!canSchedule && (
          <div className="mb-8 p-6 bg-destructive/10 border border-destructive/30 rounded-xl">
            <div className="flex items-start gap-3 mb-4">
              <Lock className="w-6 h-6 text-destructive mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <h3 className="text-lg mb-2 text-destructive">Advisory Scheduling Locked</h3>
                <p className="text-muted-foreground mb-4">
                  To unlock advisory session scheduling, please complete the following requirements:
                </p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  {!hasMinimum && (
                    <li className="flex items-center gap-2">
                      <AlertCircle className="w-4 h-4" />
                      <span>
                        Add at least {5 - employeeCount} more team member{5 - employeeCount !== 1 ? 's' : ''} (currently {employeeCount}/5)
                      </span>
                      <Link to="/dashboard/employees" className="text-primary hover:underline ml-2">
                        Add now →
                      </Link>
                    </li>
                  )}
                  {!hasActiveTier && (
                    <li className="flex items-center gap-2">
                      <AlertCircle className="w-4 h-4" />
                      <span>Activate Centurion Tax™ or Centurion Advisory™ tier</span>
                      <Link to="/dashboard/services" className="text-primary hover:underline ml-2">
                        View tiers →
                      </Link>
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Scheduling Interface */}
        {canSchedule && (
          <div className="mb-8">
            <h2 className="text-2xl mb-6">Schedule a Session</h2>
            
            <Tabs.Root value={selectedSessionType || ''} onValueChange={setSelectedSessionType}>
              {/* Session Type Tabs */}
              <Tabs.List className="flex gap-2 mb-6 border-b border-border overflow-x-auto">
                {sessionTypes.filter(type => type.available).map((type) => (
                  <Tabs.Trigger
                    key={type.id}
                    value={type.id}
                    className={`
                      px-6 py-3 text-sm transition-all border-b-2 whitespace-nowrap
                      ${selectedSessionType === type.id 
                        ? 'border-primary text-primary' 
                        : 'border-transparent text-muted-foreground hover:text-foreground'
                      }
                    `}
                  >
                    {type.name}
                  </Tabs.Trigger>
                ))}
              </Tabs.List>

              {/* Calendar Views */}
              {sessionTypes.filter(type => type.available).map((type) => (
                <Tabs.Content key={type.id} value={type.id}>
                  <div className="mb-6 p-4 bg-accent rounded-lg">
                    <h3 className="mb-2" style={{ fontWeight: 600 }}>{type.name}</h3>
                    <p className="text-sm text-muted-foreground">{type.description}</p>
                  </div>
                  
                  <AdvisoryCalendar
                    sessionType={type.name}
                    onBookSession={(date, time, duration) => 
                      handleBookSession(type.name, date, time, duration)
                    }
                  />
                </Tabs.Content>
              ))}
            </Tabs.Root>

            {!selectedSessionType && (
              <div className="p-12 bg-card border border-border rounded-xl text-center">
                <Calendar className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl mb-2">Select a Session Type</h3>
                <p className="text-sm text-muted-foreground">
                  Choose from the tabs above to view available times and schedule your session
                </p>
              </div>
            )}
          </div>
        )}

        {/* Upcoming Sessions */}
        <div className="p-8 bg-card border border-border rounded-xl mb-8">
          <h3 className="text-xl mb-6">Upcoming Sessions</h3>

          {upcomingSessions.length > 0 ? (
            <div className="space-y-4">
              {upcomingSessions.map((session) => (
                <div key={session.id} className="p-6 bg-accent rounded-xl">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <Calendar className="w-5 h-5 text-primary" />
                        <h4 className="text-lg" style={{ fontWeight: 600 }}>{session.type}</h4>
                        <span className="px-3 py-1 bg-primary/20 text-primary text-xs rounded-full">
                          Scheduled
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm mb-4">
                        <div>
                          <div className="text-muted-foreground mb-1">Date & Time</div>
                          <div style={{ fontWeight: 600 }}>{session.date}</div>
                          <div className="text-primary">{session.time}</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground mb-1">Duration</div>
                          <div style={{ fontWeight: 600 }}>{session.duration} minutes</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground mb-1">Advisor</div>
                          <div style={{ fontWeight: 600 }}>{session.advisor}</div>
                        </div>
                      </div>

                      {session.link && (
                        <div className="p-3 bg-primary/10 border border-primary/30 rounded-lg">
                          <div className="text-sm text-muted-foreground mb-2">Meeting Link</div>
                          <a
                            href={session.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline flex items-center gap-2"
                          >
                            <Video className="w-4 h-4" />
                            Join Session
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() => handleReschedule(session.id)}
                      className="ml-4 text-sm text-muted-foreground hover:text-foreground"
                    >
                      Reschedule
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h4 className="text-lg mb-2">No Upcoming Sessions</h4>
              <p className="text-sm text-muted-foreground">
                {canSchedule
                  ? 'Schedule your first advisory session above'
                  : 'Complete requirements to schedule sessions'}
              </p>
            </div>
          )}
        </div>

        {/* Past Sessions */}
        {pastSessions.length > 0 && (
          <div className="p-8 bg-card border border-border rounded-xl">
            <h3 className="text-xl mb-6">Past Sessions</h3>
            <div className="space-y-4">
              {pastSessions.map((session) => (
                <div key={session.id} className="p-4 bg-accent/50 rounded-lg flex items-center justify-between">
                  <div>
                    <div className="mb-1" style={{ fontWeight: 600 }}>{session.type}</div>
                    <div className="text-sm text-muted-foreground">
                      {session.date} at {session.time}
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-muted text-muted-foreground text-xs rounded-full capitalize">
                    {session.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}