import { create } from 'zustand';

export interface Service {
  id: string;
  name: string;
  prefix: string;
  currentSeq: number;
  color: string;
}

export interface Counter {
  id: string;
  name: string;
  serviceId: string;
  currentTicket?: string;
}

export interface Ticket {
  id: string;
  number: string;
  displayNumber: string;
  serviceId: string;
  status: 'waiting' | 'serving' | 'served' | 'cancelled';
  assignedCounter?: string;
  createdAt: Date;
  servedAt?: Date;
  queuePosition: number;
}

interface QueueState {
  services: Service[];
  counters: Counter[];
  tickets: Ticket[];
  
  // Actions
  createTicket: (serviceId: string) => Ticket;
  serveNextTicket: (counterId: string) => Ticket | null;
  completeTicket: (ticketId: string) => void;
  getQueuePosition: (ticketId: string) => number;
  getServingTickets: () => Ticket[];
  getWaitingTickets: (serviceId?: string) => Ticket[];
}

// Mock data
const mockServices: Service[] = [
  { id: '1', name: 'General Billing', prefix: 'A', currentSeq: 0, color: 'bg-gradient-primary' },
  { id: '2', name: 'Technical Support', prefix: 'B', currentSeq: 0, color: 'bg-gradient-accent' },
  { id: '3', name: 'Customer Service', prefix: 'C', currentSeq: 0, color: 'bg-gradient-success' },
];

const mockCounters: Counter[] = [
  { id: '1', name: 'Counter 1', serviceId: '1' },
  { id: '2', name: 'Counter 2', serviceId: '1' },
  { id: '3', name: 'Counter 3', serviceId: '2' },
  { id: '4', name: 'Counter 4', serviceId: '3' },
];

export const useQueueStore = create<QueueState>((set, get) => ({
  services: mockServices,
  counters: mockCounters,
  tickets: [],

  createTicket: (serviceId: string) => {
    const state = get();
    const service = state.services.find(s => s.id === serviceId);
    if (!service) throw new Error('Service not found');

    const newSeq = service.currentSeq + 1;
    const ticketNumber = `${service.prefix}${newSeq.toString().padStart(3, '0')}`;
    
    const newTicket: Ticket = {
      id: Date.now().toString(),
      number: ticketNumber,
      displayNumber: ticketNumber,
      serviceId,
      status: 'waiting',
      createdAt: new Date(),
      queuePosition: state.tickets.filter(t => t.serviceId === serviceId && t.status === 'waiting').length + 1,
    };

    set(state => ({
      services: state.services.map(s => 
        s.id === serviceId ? { ...s, currentSeq: newSeq } : s
      ),
      tickets: [...state.tickets, newTicket],
    }));

    return newTicket;
  },

  serveNextTicket: (counterId: string) => {
    const state = get();
    const counter = state.counters.find(c => c.id === counterId);
    if (!counter) return null;

    const nextTicket = state.tickets
      .filter(t => t.serviceId === counter.serviceId && t.status === 'waiting')
      .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())[0];

    if (!nextTicket) return null;

    set(state => ({
      tickets: state.tickets.map(t => 
        t.id === nextTicket.id 
          ? { ...t, status: 'serving' as const, assignedCounter: counterId }
          : t
      ),
      counters: state.counters.map(c => 
        c.id === counterId 
          ? { ...c, currentTicket: nextTicket.displayNumber }
          : c
      ),
    }));

    return { ...nextTicket, status: 'serving' as const, assignedCounter: counterId };
  },

  completeTicket: (ticketId: string) => {
    set(state => ({
      tickets: state.tickets.map(t => 
        t.id === ticketId 
          ? { ...t, status: 'served' as const, servedAt: new Date() }
          : t
      ),
    }));
  },

  getQueuePosition: (ticketId: string) => {
    const state = get();
    const ticket = state.tickets.find(t => t.id === ticketId);
    if (!ticket || ticket.status !== 'waiting') return 0;
    
    return state.tickets
      .filter(t => 
        t.serviceId === ticket.serviceId && 
        t.status === 'waiting' && 
        t.createdAt.getTime() <= ticket.createdAt.getTime()
      )
      .length;
  },

  getServingTickets: () => {
    return get().tickets.filter(t => t.status === 'serving');
  },

  getWaitingTickets: (serviceId?: string) => {
    const tickets = get().tickets.filter(t => t.status === 'waiting');
    return serviceId ? tickets.filter(t => t.serviceId === serviceId) : tickets;
  },
}));