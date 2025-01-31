import Types "../types/Types";
import Principal "mo:base/Principal";
import Text "mo:base/Text";
import Result "mo:base/Result";
import Time "mo:base/Time";
import Float "mo:base/Float";
import Iter "mo:base/Iter";
import Nat "mo:base/Nat";
import Int "mo:base/Int";
import Array "mo:base/Array";
import Buffer "mo:base/Buffer";
import Utils "../utils/Utils";

module {
    // POST EVENT
    public func postEvent(
        events: Types.Events,
        creator: Principal,
        imageUrl: Text,
        title: Text,
        description: Text,
        price: Float,
        salesDeadline: Int,
        total: Nat,
    ) : Result.Result<Types.Event, Text> {
        if (Principal.isAnonymous(creator)) {
            return #err("Anonymous principals cannot post content");
        };

        // validate title
        if (Text.size(title) < 3 or Text.size(title) > 100) {
            return #err("Title must be between 3 and 100 characters");
        };

        // validate description
        if (description == "" or Text.size(description) > 1000) {
            return #err("Description must be between 1 and 1000 characters");
        };

        // validate image
        if (imageUrl == "" or not _isValidUrl(imageUrl)) {
            return #err("Invalid imageUrl URL");
        };

        // validate total ticket
        if (total < 1) {  
            return #err("Total ticket must be at least 1");
        };

        // validate price ticket
        if (price < 0.1) {  
            return #err("Price must be at least 0.1");
        };

        // validate sales deadline ticket
        if (salesDeadline < 0) {
            return #err("Sales deadline cannot be empty");
        };

        let eventId = Utils.generateUUID(creator, description);

        var ticket : [Types.Ticket] = [];

        let ticketBuffer = Buffer.Buffer<Types.Ticket>(total);

        // Generate ticket
        for(i in Iter.range(0, Nat.sub(total, 1))) {
            let ticketId = Utils.generateUUID(creator, description # Int.toText(i));
            
            let newTicket: Types.Ticket = {
                id = ticketId;
                eventId = eventId;
                status = #forSale;
                owner = creator;
                price = price;
            };
            
            ticketBuffer.add(newTicket);
        };

        // Convert buffer to array
        ticket := Buffer.toArray(ticketBuffer);

        let newEvent : Types.Event = {
            id = eventId;
            creator = creator;  
            title = title;
            description = description;
            imageUrl = imageUrl;
            price = price;
            salesDeadline = salesDeadline;
            total = total;
            createdAt = Time.now();
            ticket = ticket;
        };

        events.put(eventId, newEvent);
        return #ok(newEvent);
    };

    // UPDATE EVENT
    public func updateEvent(
        userId: Principal,
        events: Types.Events,
        eventId: Text,
        updateData: Types.EventUpdateData,
    ) : Result.Result<Types.Event, Text> {
        if (Principal.isAnonymous(userId)) {
            return #err("Anonymous principals are not allowed");
        };

        switch (events.get(eventId)) {
            case (null) {
                return #err("Event not found!");
            };
            case (?event) {
                // ONLY OWNER CAN UPDATE
                if (not Principal.equal(event.creator, userId)) {
                    return #err("Only creator can update this event");
                };

                // CEK IF ANY TICKET IS USED
                for (ticket in event.ticket.vals()) {
                    if (ticket.status == #used) {
                        return #err("Cannot update event, some tickets are already used");
                    };
                };

                // VALIDATE TITLE
                let title = switch (updateData.title) {
                    case (null) { event.title };
                    case (?newTitle) {
                        if (Text.size(newTitle) < 3 or Text.size(newTitle) > 100) {
                            return #err("Title must be between 3 and 100 characters");
                        };
                        newTitle;
                    };
                };

                // VALIDATE DESCRIPTION
                let description = switch (updateData.description) {
                    case (null) { event.description };
                    case (?newDescription) {
                        if (Text.size(newDescription) < 1 or Text.size(newDescription) > 1000) {
                            return #err("Description must be between 1 and 1000 characters");
                        };
                        newDescription;
                    };
                };

                // VALIDATE IMAGE
                let imageUrl = switch (updateData.imageUrl) {
                    case (null) { event.imageUrl };
                    case (?newImageUrl) { newImageUrl };
                };

                // VALIDATE SALES DEADLINE
                let salesDeadline = switch (updateData.salesDeadline) {
                    case (null) { event.salesDeadline };
                    case (?newSalesDeadline) { newSalesDeadline };
                };

                // VALIDATE TOTAL
                let total = switch (updateData.total) {
                    case (null) { event.total };
                    case (?newTotal) { 
                        if (newTotal < event.ticket.size()) {
                            return #err("New total cannot be less than existing tickets");
                        };
                        newTotal 
                    };
                };

                // GENERATE ADDITIONAL SINGLE TICKETS IF TOTAL INCREASED
            var ticket = event.ticket;
            if (total > event.total) {
                let additionalTickets = Nat.sub(total, event.total);
                for (i in Iter.range(0, Nat.sub(additionalTickets, 1))) {
                    // VALIDATE PRICE
                    let price = switch (updateData.price) {
                        case (null) { 
                            if (event.ticket.size() > 0) {
                                event.ticket[0].price
                            } else {
                                return #err("No existing ticket price found");
                            };
                        };
                        case (?newPrice) {
                            if (newPrice <= 0) {
                                return #err("Price must be greater than 0");
                            };
                            let priceInUSD = newPrice / 10000; 
                            priceInUSD;
                        };
                    };
                    let ticketId = Utils.generateUUID(userId, description # Int.toText(i));
                    let newSingleTicket : Types.Ticket = {
                        id = ticketId;
                        eventId = eventId;
                        owner = userId;
                        status = #forSale;
                        price = price;
                    };
                    ticket := Array.append(ticket, [newSingleTicket]);
                };
            };
                 // NEW DATA
                let newUpdateEvent: Types.Event = {
                    id = event.id;
                    creator = event.creator; 
                    title = title;
                    description = description;
                    imageUrl = imageUrl;
                    salesDeadline = salesDeadline;
                    total = total;
                    createdAt = event.createdAt;
                    ticket = ticket;
                };

                // UPDATE EVENT
                events.put(eventId, newUpdateEvent);  
                return #ok(newUpdateEvent);
            };
        };
    };

    // COMPLETED EVENT STATUS
    public func updateEventStatusToCompleted( 
        events: Types.Events,
        eventId: Text,
        userId: Principal,
    ) : Result.Result<Types.Event, Text> {
        if (Principal.isAnonymous(userId)) {
            return #err("Anonymous principals are not allowed to update ticket status");
        };

        switch (events.get(eventId)) {
            case (null) {
                return #err("Ticket not found!");  
            };
            case (?event) {
                if(not Principal.equal(event.creator, userId)) {
                    return #err("Only creator can edit this event status");
                };

                let updatedEvent = { event with status = #completed };
                events.put(eventId, updatedEvent); 

                return #ok(updatedEvent); 
            };
        };
    };

    // GET DETAIL EVENT
    public func getDetailEvent(
        events: Types.Events,
        eventId: Text,
    ) : Result.Result<Types.Event, Text> {
        switch (events.get(eventId)) {
            case (null) {
                return #err("Event not found!");
            };
            case(?event) {
                return #ok(event);
            };
        };
    };

    // DELETE EVENT
    public func deleteEvent(
        events: Types.Events,
        userId: Principal,
        eventId: Text
    ) : Result.Result<(), Text> {
        switch (events.get(eventId)) {
            case (?event) {
                // ONLY OWNER CAN DELETE
                if(not Principal.equal(event.creator, userId)) {
                    #err("Only owner can delete this event")
                } else {
                    events.delete(eventId);
                    #ok(());
                };
            };
            case (null) { #err("Ecent not found!") }
        }
    };

    // Helper function to validate URLs (basic implementation)
    private func _isValidUrl(url : Text) : Bool {
        // Basic URL validation
        if (url == "") return false;

        // Check for http or https protocol
        let hasValidProtocol = Text.startsWith(url, #text("http://")) or Text.startsWith(url, #text("https://"));

        // Check for basic domain structure
        let hasDomain = Text.contains(url, #text("."));

        return hasValidProtocol and hasDomain;
    };
}