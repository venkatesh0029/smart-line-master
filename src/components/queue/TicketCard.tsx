import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, User, Hash } from "lucide-react";
import { Ticket, Service } from "@/lib/queue-store";

interface TicketCardProps {
  ticket: Ticket;
  service: Service;
  queuePosition?: number;
}

export const TicketCard = ({ ticket, service, queuePosition }: TicketCardProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'waiting': return 'bg-warning text-warning-foreground';
      case 'serving': return 'bg-success text-success-foreground animate-pulse-glow';
      case 'served': return 'bg-muted text-muted-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto shadow-queue animate-slide-up">
      <CardHeader className="text-center pb-4">
        <div className="flex items-center justify-center space-x-2 mb-2">
          <Hash className="h-5 w-5 text-primary" />
          <CardTitle className="text-3xl font-bold text-primary">
            {ticket.displayNumber}
          </CardTitle>
        </div>
        <Badge className={getStatusColor(ticket.status)} variant="secondary">
          {ticket.status.toUpperCase()}
        </Badge>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-3">
          <User className="h-5 w-5 text-muted-foreground" />
          <div>
            <p className="font-medium">{service.name}</p>
            <p className="text-sm text-muted-foreground">Service Type</p>
          </div>
        </div>
        
        {queuePosition && queuePosition > 0 && (
          <div className="flex items-center space-x-3">
            <Clock className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="font-medium">{queuePosition} people ahead</p>
              <p className="text-sm text-muted-foreground">Queue Position</p>
            </div>
          </div>
        )}
        
        {ticket.assignedCounter && (
          <div className="text-center p-4 bg-success/10 rounded-lg border border-success/20">
            <p className="text-success font-semibold">
              Please proceed to {ticket.assignedCounter}
            </p>
          </div>
        )}
        
        <div className="text-center text-xs text-muted-foreground">
          Created: {ticket.createdAt.toLocaleTimeString()}
        </div>
      </CardContent>
    </Card>
  );
};