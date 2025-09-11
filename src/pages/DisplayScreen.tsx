import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { QueueButton } from "@/components/queue/QueueButton";
import { useQueueStore } from "@/lib/queue-store";
import { Monitor, Users, Clock, ArrowLeft, RefreshCw } from "lucide-react";
import { Link } from "react-router-dom";

export default function DisplayScreen() {
  const { services, counters, getServingTickets, getWaitingTickets } = useQueueStore();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [autoRefresh, setAutoRefresh] = useState(true);
  
  const servingTickets = getServingTickets();
  const allWaitingTickets = getWaitingTickets();

  // Auto-refresh every 3 seconds
  useEffect(() => {
    if (!autoRefresh) return;
    
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 3000);

    return () => clearInterval(interval);
  }, [autoRefresh]);

  // Update time every second
  useEffect(() => {
    const timeInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timeInterval);
  }, []);

  const getCounterName = (counterId?: string) => {
    if (!counterId) return 'N/A';
    return counters.find(c => c.id === counterId)?.name || 'N/A';
  };

  const getServiceInfo = (serviceId: string) => {
    return services.find(s => s.id === serviceId);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link to="/">
              <QueueButton variant="display" size="counter">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </QueueButton>
            </Link>
            <div className="flex items-center space-x-3">
              <Monitor className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-3xl font-bold text-foreground">Queue Display</h1>
                <p className="text-muted-foreground">Live queue status</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <div className="text-xl font-bold text-foreground">
                {currentTime.toLocaleTimeString()}
              </div>
              <div className="text-sm text-muted-foreground">
                {currentTime.toLocaleDateString()}
              </div>
            </div>
            
            <button
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={`p-2 rounded-lg transition-colors ${
                autoRefresh 
                  ? 'bg-success text-success-foreground' 
                  : 'bg-muted text-muted-foreground'
              }`}
            >
              <RefreshCw className={`h-4 w-4 ${autoRefresh ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-8">
        {/* Currently Serving Section */}
        <div className="mb-12">
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold text-foreground mb-2">Now Serving</h2>
            <p className="text-xl text-muted-foreground">Current customers being served</p>
          </div>

          {servingTickets.length === 0 ? (
            <Card className="text-center py-16">
              <CardContent>
                <Users className="h-24 w-24 mx-auto text-muted-foreground mb-6 opacity-50" />
                <h3 className="text-2xl font-semibold text-foreground mb-2">
                  No Active Service
                </h3>
                <p className="text-muted-foreground">
                  All counters are currently available
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {servingTickets.map((ticket) => {
                const service = getServiceInfo(ticket.serviceId);
                const counterName = getCounterName(ticket.assignedCounter);
                
                return (
                  <Card key={ticket.id} className="bg-success/10 border-2 border-success/20 animate-pulse-glow">
                    <CardHeader className="text-center pb-4">
                      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-success flex items-center justify-center">
                        <span className="text-2xl font-bold text-success-foreground">
                          {service?.prefix}
                        </span>
                      </div>
                      <CardTitle className="text-4xl font-bold text-success">
                        {ticket.displayNumber}
                      </CardTitle>
                      <Badge className="bg-success text-success-foreground" variant="secondary">
                        NOW SERVING
                      </Badge>
                    </CardHeader>
                    
                    <CardContent className="text-center space-y-2">
                      <div className="text-lg font-semibold text-foreground">
                        {counterName}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {service?.name}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>

        {/* Queue Overview */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {services.map((service) => {
            const waitingForService = getWaitingTickets(service.id);
            const nextTicket = waitingForService[0];
            
            return (
              <Card key={service.id} className="hover:shadow-queue transition-shadow">
                <CardHeader className="text-center">
                  <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-primary flex items-center justify-center">
                    <span className="text-xl font-bold text-primary-foreground">
                      {service.prefix}
                    </span>
                  </div>
                  <CardTitle className="text-lg">{service.name}</CardTitle>
                </CardHeader>
                
                <CardContent className="text-center space-y-4">
                  <div className="flex items-center justify-center space-x-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      {waitingForService.length} waiting
                    </span>
                  </div>
                  
                  {nextTicket ? (
                    <div className="p-3 bg-primary/10 rounded-lg border border-primary/20">
                      <div className="text-lg font-bold text-primary">
                        {nextTicket.displayNumber}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Next in line
                      </div>
                    </div>
                  ) : (
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <div className="text-sm text-muted-foreground">
                        No customers waiting
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Statistics */}
        <div className="grid md:grid-cols-4 gap-6">
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-primary mb-2">
                {servingTickets.length}
              </div>
              <div className="text-muted-foreground">Currently Serving</div>
            </CardContent>
          </Card>
          
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-warning mb-2">
                {allWaitingTickets.length}
              </div>
              <div className="text-muted-foreground">Total Waiting</div>
            </CardContent>
          </Card>
          
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-success mb-2">
                {services.reduce((acc, service) => acc + service.currentSeq, 0)}
              </div>
              <div className="text-muted-foreground">Tickets Today</div>
            </CardContent>
          </Card>
          
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-accent mb-2">
                {counters.length}
              </div>
              <div className="text-muted-foreground">Active Counters</div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}