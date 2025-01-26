import Types "../types/Types";
import Principal "mo:base/Principal";
import Text "mo:base/Text";
import Result "mo:base/Result";
import Time "mo:base/Time";
import Utils "../utils/Utils";

module {
    // POST TICKET
    public func postTicket(
        tickets: Types.Tickets,
        owner: Principal,
        imageUrl: Text,
        title: Text,
        description: Text,
        price: Nat,
        salesDeadline: Int,
        total: Nat,
        isSold: Bool,
    ) : Result.Result<Types.Ticket, Text>{
        if (Principal.isAnonymous(owner)) {
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
        if (total < 0) {
            return #err("Total ticket must be at least 1");
        };

        // validate price ticket
        if (price < 0) {
            return #err("Price ticket must be at least 1");
        };

        // validate sales deadline ticket
        if (salesDeadline < 0) {
            return #err("Sales deadline cannot be empty");
        };

        let ticketId = Utils.generateUUID(owner, description);

        let newTicket : Types.Ticket = {
            id = ticketId;
            owner = owner;
            title = title;
            description = description;
            imageUrl = imageUrl;
            price = price;
            salesDeadline = salesDeadline;
            total = total;
            isSold = isSold;
            createdAt = Time.now();
            status = #forSale;
        };

        tickets.put(ticketId, newTicket);
        #ok(newTicket);
    };

    // UPDATE TICKET
    public func updateTicket(
        userId: Principal,
        tickets: Types.Tickets,
        ticketId: Text,
        updateData: Types.TicketUpdateData,
    ) : Result.Result<Types.Ticket, Text> {
        if (Principal.isAnonymous(userId)) {
            return #err("Anonymous principals are not allowed");
        };

        switch (tickets.get(ticketId)) {
            case (null) {
                return #err("Ticket not found!");
            };
            case (?ticket) {
                // ONLY OWNER CAN UPDATE
                if ( not Principal.equal(ticket.owner, userId)) {
                    return #err("Only owner can update this ticket");
                };

                // VALIDATE TICKET STATUS
                if (ticket.isSold == true) {
                    return #err("This ticket is already sold");
                };

                if(ticket.status == #used) {
                    return #err("This ticket is already used");
                };

                // VALIDATE TITLE
                let title = switch (updateData.title) {
                    case (null) { ticket.title };
                    case (?newTitle) {
                        if (Text.size(newTitle) < 3 or Text.size(newTitle) > 100) {
                            return #err("Title must be between 3 and 100 characters");
                        };
                        newTitle;
                    };
                };

                // VALIDATE DESCRIPTION
                let description = switch (updateData.description) {
                    case (null) { ticket.description };
                    case (?newDescription) {
                        if (Text.size(newDescription) < 1 or Text.size(newDescription) > 1000) {
                            return #err("Description must be between 1 and 1000 characters");
                        };
                        newDescription;
                    };
                };

                // VALIDATE IMAGE
                let imageUrl = switch (updateData.imageUrl) {
                    case (null) { ticket.imageUrl };
                    case (?newImageUrl) { newImageUrl };
                };

                let price = switch (updateData.price) {
                    case (null) { ticket.price };
                    case (?newPrice) {
                        if (newPrice <= 0) {
                            return #err("Price must be greater than 0");
                        };
                        newPrice;
                    };
                };

                // VALIDATE SALES DEADLINE
                let salesDeadline = switch (updateData.salesDeadline) {
                    case (null) { ticket.salesDeadline };
                    case (?newSalesDeadline) { newSalesDeadline };
                };

                // VALIDATE TITLE
                let total = switch (updateData.total) {
                    case (null) { ticket.total };
                    case (?newTotal) { newTotal };
                };

                // NEW DATA
                let newUpdateTicket: Types.Ticket = {
                    id = ticket.id;
                    owner = ticket.owner;
                    title = title;
                    description = description;
                    imageUrl = imageUrl;
                    price = price;
                    salesDeadline = salesDeadline;
                    total = total;
                    isSold = ticket.isSold;
                    createdAt = ticket.createdAt;
                    status = ticket.status;
                };

                // UPDATE TICKET
                tickets.put(ticketId, newUpdateTicket);
                return #ok(newUpdateTicket);
            };
        };
    };

    // GET DETAIL TICKET
    public func getDetailTicket(
        tickets: Types.Tickets,
        ticketId: Text,
    ) : Result.Result<Types.Ticket, Text> {
        switch (tickets.get(ticketId)) {
            case (null) {
                return #err("Ticket not found!");
            };
            case(?ticket) {
                return #ok(ticket);
            };
        };
    };

    // DELETE TICKET
    public func deleteTicket(
        tickets: Types.Tickets,
        userId: Principal,
        ticketId: Text
    ) : Result.Result<(), Text> {
        switch (tickets.get(ticketId)) {
            case (?ticket) {
                // ONLY OWNER CAN DELETE
                if(not Principal.equal(ticket.owner, userId)) {
                    #err("Only owner can delete this ticket")
                } else {
                    tickets.delete(ticketId);
                    #ok(());
                };
            };
            case (null) { #err("Ticket not found!") }
        }
    };

    // UPDATE TICKET STATUS
    public func updateTicketStatus( 
    tickets: Types.Tickets,
    ticketId: Text,
    userId: Principal,
    status: Types.ticketStatus   
    ) : Result.Result<Types.Ticket, Text> {
        if (Principal.isAnonymous(userId)) {
            return #err("Anonymous principals are not allowed to update ticket status");
        };

        switch (tickets.get(ticketId)) {
            case (null) {
                return #err("Ticket not found!");  
            };
            case (?ticket) {
                if (ticket.status == #used and status == #used) {
                    return #err("This ticket has already been used");
                };

                if(not Principal.equal(ticket.owner, userId)) {
                    return #err("Only owner can edit this ticket status");
                };

                let updatedTicket = { ticket with status = status };
                tickets.put(ticketId, updatedTicket); 

                return #ok(updatedTicket); 
            };
        };
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