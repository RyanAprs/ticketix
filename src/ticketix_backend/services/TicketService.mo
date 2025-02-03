import Array "mo:base/Array";
import Principal "mo:base/Principal";
import Result "mo:base/Result";
import Types "../types/Types";

module {
    public func updateTicketStatus( 
        events: Types.Events,
        eventId: Text,
        userId: Principal,
        ticketId: Text,
        status: Types.TicketStatus   
    ) : Result.Result<Types.Event, Text> {
        if (Principal.isAnonymous(userId)) {
            return #err("Anonymous principals are not allowed to update ticket status");
        };

        switch (events.get(eventId)) {
            case (null) {
                return #err("Event not found");  
            };
            case (?event) {
                var ticketFound = false;
                var ticketError : ?Text = null;

                let updatedTickets : [Types.Ticket] = Array.map<Types.Ticket, Types.Ticket>(
                    event.ticket, 
                    func(ticket) {
                        if (ticket.id == ticketId) {
                            ticketFound := true;
                            
                            if (not Principal.equal(ticket.owner, userId)) {
                                return ticket; 
                            };

                            if (ticket.status == #used) {
                                ticketError := ?("This ticket is already used");
                                return ticket;
                            };

                            return {
                                id = ticket.id;
                                eventId = ticket.eventId;
                                owner = ticket.owner;
                                status = status;
                                price = ticket.price;
                            };
                        };
                        return ticket;
                    }
                );

                switch (ticketError) {
                    case (?error) { return #err(error); };
                    case (null) {};
                };

                if (not ticketFound) {
                    return #err("Ticket not found");
                };

                let updatedTicketToCheck = Array.find<Types.Ticket>(
                    updatedTickets, 
                    func(ticket) = ticket.id == ticketId
                );
                
                switch (updatedTicketToCheck) {
                    case (null) { return #err("Ticket update failed"); };
                    case (?ticket) {
                        let updatedEvent : Types.Event = {
                            id = event.id;
                            creator = event.creator;
                            title = event.title;
                            description = event.description;
                            imageUrl = event.imageUrl;
                            eventDate = event.eventDate;
                            total = event.total;
                            createdAt = event.createdAt;
                            ticket = updatedTickets;
                            location = event.location;
                        };

                        events.put(eventId, updatedEvent);

                        return #ok(updatedEvent);
                    };
                };
            };
        };
    };
}