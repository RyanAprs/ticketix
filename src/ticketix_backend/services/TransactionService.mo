import Types "../types/Types";
import Result "mo:base/Result";
import Array "mo:base/Array";
import Float "mo:base/Float";
import Principal "mo:base/Principal";
import Int "mo:base/Int";
import Time "mo:base/Time";

module {
    // Updated TransactionService.buyTickets function
    public func buyTickets(
        events: Types.Events,
        transactions: Types.Transactions,
        userBalances: Types.UserBalances,
        buyer: Principal,
        eventId: Text,
        ticketIds: [Text]
    ) : async Result.Result<Text, Text> {
        // CHECK IF THE EVENT EXISTS
        switch (events.get(eventId)) {
            case null {
                return #err("Event not found");
            };
            case (?event) {
                // CHECK IF THE BUYER HAS ENOUGH BALANCE
                switch (userBalances.get(buyer)) {
                    case null {
                        return #err("Buyer balance not found");
                    };
                    case (?buyerBalance) {
                        // CALCULATE THE TOTAL COST OF THE TICKETS
                        var totalCost: Float = 0;
                        for (ticketId in ticketIds.vals()) {
                            switch (Array.find(event.ticket, func (t: Types.Ticket) : Bool { t.id == ticketId })) {
                                case null {
                                    return #err("Ticket not found");
                                };
                                case (?ticket) {
                                    totalCost += ticket.price;
                                };
                            };
                        };

                        // CHECK IF THE BUYER HAS ENOUGH BALANCE
                        if (totalCost > buyerBalance.balance) {
                            return #err("Insufficient balance");
                        };

                        // Calculate platform fee (5% of total cost)
                        let platformFee: Float = totalCost * 0.05;
                        let sellerAmount: Float = totalCost - platformFee;

                        // UPDATE THE BUYER'S BALANCE
                        let newBuyerBalance = buyerBalance.balance - totalCost;
                        userBalances.put(buyer, { id = buyer; balance = newBuyerBalance });

                        // UPDATE THE SELLER'S BALANCE
                        switch (userBalances.get(event.creator)) {
                            case null {
                                userBalances.put(event.creator, { id = event.creator; balance = sellerAmount });
                            };
                            case (?sellerBalance) {
                                let newSellerBalance = sellerBalance.balance + sellerAmount;
                                userBalances.put(event.creator, { id = event.creator; balance = newSellerBalance });
                            };
                        };

                        // Update platform balance
                        let platformPrincipal = Principal.fromText("platform-wallet-principal-id");
                        switch (userBalances.get(platformPrincipal)) {
                            case null {
                                userBalances.put(platformPrincipal, {
                                    id = platformPrincipal;
                                    balance = platformFee;
                                });
                            };
                            case (?platformBalance) {
                                let newPlatformBalance = platformBalance.balance + platformFee;
                                userBalances.put(platformPrincipal, {
                                    id = platformPrincipal;
                                    balance = newPlatformBalance;
                                });
                            };
                        };

                        // UPDATE THE TICKETS
                        for (ticketId in ticketIds.vals()) {
                            switch (Array.find(event.ticket, func (t: Types.Ticket) : Bool { t.id == ticketId })) {
                                case null {
                                    return #err("Ticket not found");
                                };
                                case (?ticket) {
                                    let updatedTicket: Types.Ticket = {
                                        id = ticket.id;
                                        eventId = ticket.eventId;
                                        owner = buyer;
                                        status = #owned;
                                        price = ticket.price;
                                    };
                                    let updatedTickets = Array.map(event.ticket, func (t: Types.Ticket) : Types.Ticket {
                                        if (t.id == ticketId) updatedTicket else t
                                    });
                                    events.put(eventId, { event with ticket = updatedTickets });
                                };
                            };
                        };

                        // CREATE TRANSACTION
                        let transactionId = Principal.toText(buyer) # "-" # Int.toText(Time.now());
                        let transaction: Types.Transaction = {
                            id = transactionId;
                            buyer = buyer;
                            seller = event.creator;
                            ticket = event.ticket;
                            totalTicket = ticketIds.size();
                            amount = totalCost;
                            timestamp = Time.now();
                        };
                        transactions.put(buyer, transaction);

                        return #ok(transactionId);  // Return the transaction ID instead of the transaction object
                    };
                };
            };
        };
    };

//   public func buyTicketsDemo(
//     events: Types.Events,
//     transactions: Types.Transactions,
//     buyer: Principal,
//     eventId: Text,
//     ticketIds: [Text]
//     ) : async Result.Result<Text, Text> {
//         // CHECK IF THE EVENT EXISTS
//         switch (events.get(eventId)) {
//             case null {
//                 return #err("Event not found");
//             };
//             case (?event) {
//                 // CHECK IF TICKETS ARE AVAILABLE AND NOT OWNED
//                 for (ticketId in ticketIds.vals()) {
//                     switch (Array.find(event.ticket, func (t: Types.Ticket) : Bool { t.id == ticketId })) {
//                         case null {
//                             return #err("Ticket not found");
//                         };
//                         case (?ticket) {
//                             if (ticket.status == #owned) {
//                                 return #err("Ticket already owned");
//                             };
//                         };
//                     };
//                 };

//                 // UPDATE THE TICKETS
//                 for (ticketId in ticketIds.vals()) {
//                     switch (Array.find(event.ticket, func (t: Types.Ticket) : Bool { t.id == ticketId })) {
//                         case null {
//                             return #err("Ticket not found");
//                         };
//                         case (?ticket) {
//                             let updatedTicket: Types.Ticket = {
//                                 id = ticket.id;
//                                 eventId = ticket.eventId;
//                                 owner = buyer;
//                                 status = #owned;
//                                 price = ticket.price;
//                             };
//                             let updatedTickets = Array.map(event.ticket, func (t: Types.Ticket) : Types.Ticket {
//                                 if (t.id == ticketId) updatedTicket else t
//                             });
//                             events.put(eventId, { event with ticket = updatedTickets });
//                         };
//                     };
//                 };

//                 // CREATE TRANSACTION
//                 let transactionId = Principal.toText(buyer) # "-" # Int.toText(Time.now());
//                 let transaction: Types.Transaction = {
//                     id = transactionId;
//                     buyer = buyer;
//                     seller = event.creator; 
//                     ticket = event.ticket[0];
//                     totalTicket = ticketIds.size();
//                     amount = 0; 
//                     timestamp = Time.now();
//                 };
//                 transactions.put(buyer, transaction);

//                 return #ok(transactionId);
//             };
//         };
//     };

//     public func sellTicket(
//         _users: Types.Users,
//         events: Types.Events,
//         _transactions: Types.Transactions,
//         _userBalances: Types.UserBalances,
//         seller: Principal,
//         eventId: Text,
//         ticketId: Text,
//         price: Float
//     ) : Result.Result<Text, Text> {
//         // CHECK IF THE EVENT EXISTS
//         switch (events.get(eventId)) {
//             case null {
//                 return #err("Event not found");
//             };
//             case (?event) {
//                 // CHECK IF THE TICKET EXIST AND IS OWNED BY THE SELLER
//                 switch (Array.find(event.ticket, func (t: Types.Ticket) : Bool { t.id == ticketId })) {
//                     case null {
//                         return #err("Ticket not found");
//                     };
//                     case (?ticket) {
//                         if (ticket.owner != seller) {
//                             return #err("You do not own this ticket");
//                         };
//                         if (ticket.status != #owned) {
//                             return #err("Ticket is not owned");
//                         };

//                         // UPDATE THE TICKET STATUS TI FIRSALE
//                         let updatedTicket: Types.Ticket = {
//                             id = ticket.id;
//                             eventId = ticket.eventId;
//                             owner = seller;
//                             status = #forSale;
//                             price = price;
//                         };
//                         let updatedTickets = Array.map(event.ticket, func (t: Types.Ticket) : Types.Ticket {
//                             if (t.id == ticketId) {
//                                 return updatedTicket;
//                             } else {
//                                 return t;
//                             };
//                         });
//                         events.put(eventId, { event with ticket = updatedTickets });

//                         return #ok("Ticket is now for sale");
//                     };
//                 };
//             };
//         };
//   };

    public func buyTicketsDemo(
        events: Types.Events,
        transactions: Types.Transactions,
        buyer: Principal,
        eventId: Text,
        ticketIds: [Text]
    ) : async Result.Result<Text, Text> {
        // CHECK IF THE EVENT EXISTS
        switch (events.get(eventId)) {
            case null {
                return #err("Event not found");
            };
            case (?event) {
                // CHECK IF THE REQUESTED NUMBER OF TICKETS IS AVAILABLE
                if (ticketIds.size() > event.total) {
                    return #err("Not enough tickets available");
                };

                // CHECK IF TICKETS ARE AVAILABLE AND NOT OWNED
                for (ticketId in ticketIds.vals()) {
                    switch (Array.find(event.ticket, func (t: Types.Ticket) : Bool { t.id == ticketId })) {
                        case null {
                            return #err("Ticket not found");
                        };
                        case (?ticket) {
                            if (ticket.status == #owned and Principal.equal(ticket.owner, buyer)) {
                                return #err("Ticket already owned");
                            };
                        };
                    };
                };

                // Buat array tiket yang baru
                var updatedTickets = event.ticket;
                
                // UPDATE THE TICKETS
                for (ticketId in ticketIds.vals()) {
                    updatedTickets := Array.map(updatedTickets, func (t: Types.Ticket) : Types.Ticket {
                        if (t.id == ticketId) {
                            {
                                id = t.id;
                                eventId = t.eventId;
                                owner = buyer;  
                                status = #owned;
                                price = t.price;
                            }
                        } else {
                            t
                        }
                    });
                };

                // REDUCE THE TOTAL NUMBER OF AVAILABLE TICKETS AND UPDATE EVENT
                let updatedEvent = {
                    event with
                    total = event.total - ticketIds.size();
                    ticket = updatedTickets;  // Simpan array tiket yang sudah diupdate
                };
                events.put(eventId, updatedEvent);

                // CREATE TRANSACTION
                let transactionId = Principal.toText(buyer) # "-" # Int.toText(Time.now());
                let transaction: Types.Transaction = {
                    id = transactionId;
                    buyer = buyer;
                    seller = event.creator; 
                    ticket = updatedTickets;  // Gunakan tiket yang sudah diupdate
                    totalTicket = ticketIds.size();
                    amount = 0; 
                    timestamp = Time.now();
                };
                transactions.put(buyer, transaction);

                return #ok(transactionId);
            };
        };
    };

    public func resellTicketsDemo(
        events: Types.Events,
        seller: Principal,
        eventId: Text,
        ticketId: Text,
    ) : async Result.Result<Text, Text> {
        // CHECK IF THE EVENT EXISTS
        switch (events.get(eventId)) {
            case null {
                return #err("Event not found");
            };
            case (?event) {
                // CHECK IF THE TICKET EXIST AND IS OWNED BY THE SELLER
                switch (Array.find(event.ticket, func (t: Types.Ticket) : Bool { t.id == ticketId })) {
                    case null {
                        return #err("Ticket not found");
                    };
                    case (?ticket) {
                        // CHECK IF TICKET BELONGS TO THIS EVENT
                        if (ticket.eventId != eventId) {
                            return #err("Ticket does not belong to this event");
                        };
                        
                        if (ticket.owner != seller) {
                            return #err("You do not own this ticket");
                        };
                        if (ticket.status != #owned) {
                            return #err("Ticket is not owned");
                        };

                        // UPDATE THE TICKET STATUS TO FORSALE
                        let updatedTicket: Types.Ticket = {
                            id = ticket.id;
                            eventId = ticket.eventId;
                            owner = seller;
                            status = #forSale;
                            price = ticket.price;
                        };
                        let updatedTickets = Array.map(event.ticket, func (t: Types.Ticket) : Types.Ticket {
                            if (t.id == ticketId) {
                                return updatedTicket;
                            } else {
                                return t;
                            };
                        });
                        events.put(eventId, { event with ticket = updatedTickets });

                        return #ok("Ticket is now for sale");
                    };
                };
            };
        };
  };

}