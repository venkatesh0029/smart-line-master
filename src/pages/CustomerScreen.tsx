import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { QueueButton } from "@/components/queue/QueueButton";
import { TicketCard } from "@/components/queue/TicketCard";
import { useQueueStore, Ticket } from "@/lib/queue-store";
import { Users, Clock, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function CustomerScreen() {
  const { services, createTicket, getQueuePosition } = useQueueStore();
  const [currentTicket, setCurrentTicket] = useState<Ticket | null>(null);
  const queuePosition = currentTicket ? getQueuePosition(currentTicket.id) : 0;
  const currentService = currentTicket ? services.find(s => s.id === currentTicket.serviceId) : null;

  const handleTakeTicket = (serviceId: string) => {
    const newTicket = createTicket(serviceId);
    setCurrentTicket(newTicket);
  };

  const handleNewTicket = () => {
    setCurrentTicket(null);
  };

  if (currentTicket && currentService) {
    return (
      <div className="min-h-screen bg-gradient-primary p-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-2">Your Ticket</h1>
            <p className="text-muted-foreground">Please keep this ticket and wait for your number to be called</p>
          </div>
          
          <div className="flex flex-col items-center space-y-6">
            <TicketCard 
              ticket={currentTicket} 
              service={currentService}
              queuePosition={queuePosition}
            />
            
            <div className="flex space-x-4">
              <QueueButton
                variant="counter"
                size="counter"
                onClick={handleNewTicket}
              >
                Take Another Ticket
              </QueueButton>
              
              <Link to="/display">
                <QueueButton variant="display" size="counter">
                  View Queue Status
                </QueueButton>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-primary">
      {/* Header */}
      <header className="bg-white/10 backdrop-blur-sm border-b border-white/20 p-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Smart Queue System</h1>
            <p className="text-white/80">Select a service to get your ticket</p>
          </div>
          <div className="flex space-x-4">
            <Link to="/counter">
              <QueueButton variant="counter" size="counter">
                Counter Login
              </QueueButton>
            </Link>
            <Link to="/display">
              <QueueButton variant="display" size="counter">
                <Users className="mr-2 h-4 w-4" />
                Queue Display
              </QueueButton>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto p-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">
            Choose Your Service
          </h2>
          <p className="text-xl text-white/80">
            Click on a service below to get your queue number
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {services.map((service) => (
            <Card key={service.id} className="hover:shadow-glow transition-all duration-300 group bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/15">
              <CardHeader className="text-center">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-accent flex items-center justify-center shadow-glow">
                  <span className="text-3xl font-bold text-white">
                    {service.prefix}
                  </span>
                </div>
                <CardTitle className="text-2xl text-white">{service.name}</CardTitle>
              </CardHeader>
              
              <CardContent className="text-center space-y-6">
                <div className="flex items-center justify-center space-x-2 text-white/70">
                  <Clock className="h-5 w-5" />
                  <span className="text-base">Average wait: 5-10 min</span>
                </div>
                
                <QueueButton
                  variant="service"
                  size="service"
                  onClick={() => handleTakeTicket(service.id)}
                  className="w-full group-hover:scale-105 bg-gradient-success hover:bg-gradient-success/90 text-white border-0 shadow-lg"
                >
                  Take Ticket
                  <ArrowRight className="ml-2 h-6 w-6" />
                </QueueButton>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Statistics */}
        <div className="mt-16 grid md:grid-cols-3 gap-6">
          <Card className="text-center bg-white/10 backdrop-blur-sm border-white/20">
            <CardContent className="pt-6">
              <div className="text-4xl font-bold text-white mb-2">
                {services.reduce((acc, service) => acc + service.currentSeq, 0)}
              </div>
              <div className="text-white/70 text-lg">Tickets Issued Today</div>
            </CardContent>
          </Card>
          
          <Card className="text-center bg-white/10 backdrop-blur-sm border-white/20">
            <CardContent className="pt-6">
              <div className="text-4xl font-bold text-white mb-2">
                5-10
              </div>
              <div className="text-white/70 text-lg">Average Wait (min)</div>
            </CardContent>
          </Card>
          
          <Card className="text-center bg-white/10 backdrop-blur-sm border-white/20">
            <CardContent className="pt-6">
              <div className="text-4xl font-bold text-white mb-2">
                {services.length}
              </div>
              <div className="text-white/70 text-lg">Active Counters</div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}