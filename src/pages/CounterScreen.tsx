import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { QueueButton } from "@/components/queue/QueueButton";
import { useQueueStore } from "@/lib/queue-store";
import { Phone, CheckCircle, Clock, Users, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

export default function CounterScreen() {
  const { counters, services, tickets, serveNextTicket, completeTicket, getWaitingTickets } = useQueueStore();
  const [selectedCounter, setSelectedCounter] = useState<string>("");
  const [currentServingTicket, setCurrentServingTicket] = useState<string>("");

  const counter = counters.find(c => c.id === selectedCounter);
  const service = counter ? services.find(s => s.id === counter.serviceId) : null;
  const waitingTickets = counter ? getWaitingTickets(counter.serviceId) : [];
  const servingTicket = tickets.find(t => t.assignedCounter === selectedCounter && t.status === 'serving');

  useEffect(() => {
    if (servingTicket) {
      setCurrentServingTicket(servingTicket.displayNumber);
    } else {
      setCurrentServingTicket("");
    }
  }, [servingTicket]);

  const handleCallNext = () => {
    if (!selectedCounter) return;
    
    const nextTicket = serveNextTicket(selectedCounter);
    if (nextTicket) {
      setCurrentServingTicket(nextTicket.displayNumber);
    }
  };

  const handleCompleteService = () => {
    if (servingTicket) {
      completeTicket(servingTicket.id);
      setCurrentServingTicket("");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border p-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link to="/">
              <QueueButton variant="display" size="counter">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Main
              </QueueButton>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Counter Management</h1>
              <p className="text-muted-foreground">Serve customers and manage queue</p>
            </div>
          </div>
          <Link to="/display">
            <QueueButton variant="display" size="counter">
              <Users className="mr-2 h-4 w-4" />
              Queue Display
            </QueueButton>
          </Link>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-8">
        {/* Counter Selection */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Select Your Counter</CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={selectedCounter} onValueChange={setSelectedCounter}>
              <SelectTrigger className="w-full max-w-md">
                <SelectValue placeholder="Choose your counter..." />
              </SelectTrigger>
              <SelectContent>
                {counters.map((counter) => {
                  const counterService = services.find(s => s.id === counter.serviceId);
                  return (
                    <SelectItem key={counter.id} value={counter.id}>
                      {counter.name} - {counterService?.name}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {selectedCounter && counter && service && (
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Current Service Panel */}
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center">
                    <span className="text-sm font-bold text-primary-foreground">
                      {service.prefix}
                    </span>
                  </div>
                  <span>{counter.name}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {currentServingTicket ? (
                  <div className="text-center p-8 bg-success/10 border-2 border-success/20 rounded-2xl">
                    <div className="text-6xl font-bold text-success mb-4 animate-pulse-glow">
                      {currentServingTicket}
                    </div>
                    <Badge className="bg-success text-success-foreground mb-4" variant="secondary">
                      NOW SERVING
                    </Badge>
                    <QueueButton
                      variant="success"
                      size="counter"
                      onClick={handleCompleteService}
                      className="w-full"
                    >
                      <CheckCircle className="mr-2 h-5 w-5" />
                      Complete Service
                    </QueueButton>
                  </div>
                ) : (
                  <div className="text-center p-8 border-2 border-dashed border-border rounded-2xl">
                    <Clock className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground mb-4">No customer currently being served</p>
                    <QueueButton
                      variant="counter"
                      size="counter"
                      onClick={handleCallNext}
                      disabled={waitingTickets.length === 0}
                      className="w-full"
                      pulse={waitingTickets.length > 0}
                    >
                      <Phone className="mr-2 h-5 w-5" />
                      Call Next Customer
                    </QueueButton>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Queue Status Panel */}
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Queue Status - {service.name}</span>
                  <Badge variant="secondary">
                    {waitingTickets.length} waiting
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {waitingTickets.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No customers waiting</p>
                    </div>
                  ) : (
                    waitingTickets.slice(0, 10).map((ticket, index) => (
                      <div
                        key={ticket.id}
                        className={`flex items-center justify-between p-3 rounded-lg border ${
                          index === 0 
                            ? 'bg-primary/10 border-primary/20' 
                            : 'bg-muted/50 border-border'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                            index === 0 
                              ? 'bg-primary text-primary-foreground' 
                              : 'bg-muted-foreground text-background'
                          }`}>
                            {index + 1}
                          </div>
                          <div>
                            <div className="font-semibold">{ticket.displayNumber}</div>
                            <div className="text-xs text-muted-foreground">
                              {ticket.createdAt.toLocaleTimeString()}
                            </div>
                          </div>
                        </div>
                        {index === 0 && (
                          <Badge className="bg-primary text-primary-foreground" variant="secondary">
                            NEXT
                          </Badge>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {!selectedCounter && (
          <div className="text-center py-16">
            <Users className="h-24 w-24 mx-auto text-muted-foreground mb-6 opacity-50" />
            <h3 className="text-2xl font-semibold text-foreground mb-2">
              Select Your Counter
            </h3>
            <p className="text-muted-foreground">
              Choose a counter above to start serving customers
            </p>
          </div>
        )}
      </main>
    </div>
  );
}