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
    // POST TICKET
    public func postTicket(
    tickets: Types.Tickets,
    owner: Principal,
    imageUrl: Text,
    title: Text,
    description: Text,
    price: Float,
    salesDeadline: Int,
    total: Nat,
) : Result.Result<Types.Ticket, Text> {
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

    // Inisialisasi array untuk menyimpan single tickets
    var singleTickets : [Types.SingleTicket] = [];
    
    // Membuat array baru dengan Buffer
    let ticketBuffer = Buffer.Buffer<Types.SingleTicket>(total);

    // Generate single tickets
    for(i in Iter.range(0, Nat.sub(total, 1))) {
        let singleTicketId = Utils.generateUUID(owner, description # Int.toText(i));
        
        let newSingleTicket: Types.SingleTicket = {
            id = singleTicketId;
            status = #forSale;
            singleOwner = owner;
        };
        
        ticketBuffer.add(newSingleTicket);
    };

    // Convert buffer ke array
    singleTickets := Buffer.toArray(ticketBuffer);

    let newTicket : Types.Ticket = {
        id = ticketId;
        owner = owner;
        title = title;
        description = description;
        imageUrl = imageUrl;
        price = price;
        salesDeadline = salesDeadline;
        total = total;
        createdAt = Time.now();
        singleTicket = singleTickets;
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
                if (not Principal.equal(ticket.owner, userId)) {
                    return #err("Only owner can update this ticket");
                };

                // CEK IF ANY TICKET IS USED
                for (singleTicket in ticket.singleTicket.vals()) {
                    if (singleTicket.status == #used) {
                        return #err("Cannot update ticket, some tickets are already used");
                    };
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

                // VALIDATE PRICE
                let price = switch (updateData.price) {
                    case (null) { ticket.price };
                    case (?newPrice) {
                        if (newPrice <= 0) {
                            return #err("Price must be greater than 0");
                        };
                        let priceInUSD = newPrice / 10000; 
                        priceInUSD;
                    };
                };

                // VALIDATE SALES DEADLINE
                let salesDeadline = switch (updateData.salesDeadline) {
                    case (null) { ticket.salesDeadline };
                    case (?newSalesDeadline) { newSalesDeadline };
                };

                // VALIDATE TOTAL
                let total = switch (updateData.total) {
                    case (null) { ticket.total };
                    case (?newTotal) { 
                        if (newTotal < ticket.singleTicket.size()) {
                            return #err("New total cannot be less than existing tickets");
                        };
                        newTotal 
                    };
                };

                // GENERATE ADDITIONAL SINGLE TICKETS IF TOTAL INCREASED
                var singleTickets = ticket.singleTicket;
                if (total > ticket.total) {
                    let additionalTickets = Nat.sub(total, ticket.total);
                    for (i in Iter.range(0, Nat.sub(additionalTickets, 1))) {
                        let singleTicketId = Utils.generateUUID(userId, description # Int.toText(i));
                        let newSingleTicket : Types.SingleTicket = {
                            id = singleTicketId;
                            status = #forSale;
                            singleOwner = userId;
                        };
                        singleTickets := Array.append(singleTickets, [newSingleTicket]);
                    };
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
                    createdAt = ticket.createdAt;
                    singleTicket = singleTickets;
                };

                // UPDATE TICKET
                tickets.put(ticketId, newUpdateTicket);
                return #ok(newUpdateTicket);
            };
        };
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
                for (singleTicket in ticket.singleTicket.vals()) {
                    if (singleTicket.status == #used) {
                        return #err("Cannot update ticket, some tickets are already used");
                    };
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