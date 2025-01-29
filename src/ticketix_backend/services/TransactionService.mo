// import Result "mo:base/Result";
// import Array "mo:base/Array";
// import Float "mo:base/Float";
// import Int "mo:base/Int";
// import Principal "mo:base/Principal";
// import Buffer "mo:base/Buffer";
// import Time "mo:base/Time";
// import Text "mo:base/Text";
// import Types "../types/Types";

// module {
//     public func purchaseTickets(
//         events: Types.Events, 
//         eventId: Text,
//         quantity: Nat,
//         userBalances: Types.UserBalances,
//         buyer: Principal,
//         transactions: Types.Transactions
//         ):  async Result.Result<Text, Text> {
//         // Get the ticket
//         switch(events.get(eventId)) {
//             case null {
//                 return #err("Ticket not found");
//             };
//             case (?event) {
//                 // Check if enough events are available
//                 let availableTickets = Array.filter<Types.Ticket>(
//                     event.ticket, 
//                     func(t: Types.Ticket) : Bool { 
//                         switch(t.status) {
//                             case (#forSale) { true };
//                             case (_) { false };
//                         };
//                     }
//                 );

//                 if (availableTickets.size() < quantity) {
//                     return #err("Not enough tickets available");
//                 };

//                 // Calculate total cost (convert Float to Nat)
//                 let floatCost = event.price * Float.fromInt(quantity);
//                 let intCost = Float.toInt(floatCost);
//                 let totalCost = Int.abs(intCost);

//                 // Check buyer's balance
//                 switch(userBalances.get(buyer)) {
//                     case null {
//                         return #err("Buyer balance not found");
//                     };
//                     case (?buyerBalance) {
//                         if (buyerBalance.balance < totalCost) {
//                             return #err("Insufficient balance");
//                         };

//                         // Update buyer's balance
//                         let newBuyerBalance : Types.UserBalance = {
//                             id = buyer;
//                             balance = buyerBalance.balance - totalCost;
//                         };
//                         userBalances.put(buyer, newBuyerBalance);

//                         // Update seller's balance
//                         switch(userBalances.get(event.creator)) {
//                             case null {
//                                 return #err("Seller balance not found");
//                             };
//                             case (?sellerBalance) {
//                                 let newSellerBalance : Types.UserBalance = {
//                                     id = event.creator;
//                                     balance = sellerBalance.balance + totalCost;
//                                 };
//                                 userBalances.put(event.creator, newSellerBalance);
//                             };
//                         };

//                         // Update ticket ownership and status
//                         var updatedSingleTickets = Buffer.Buffer<Types.Ticket>(0);
//                         var purchasedCount = 0;

//                         for (ticket in event.ticket.vals()) {
//                             if (purchasedCount < quantity and ticket.status == #forSale) {
//                                 let updatedTicket : Types.Ticket = {
//                                     id = ticket.id;
//                                     owner = buyer;
//                                     status = #owned;
//                                 };
//                                 updatedSingleTickets.add(updatedTicket);
//                                 purchasedCount += 1;
//                             } else {
//                                 updatedSingleTickets.add(singleTicket);
//                             };
//                         };

//                         // Create updated ticket
//                         let updatedTicket : Types.Ticket = {
//                             id = ticket.id;
//                             owner = ticket.owner;
//                             title = ticket.title;
//                             description = ticket.description;
//                             imageUrl = ticket.imageUrl;
//                             price = ticket.price;
//                             salesDeadline = ticket.salesDeadline;
//                             total = ticket.total;
//                             createdAt = ticket.createdAt;
//                             singleTicket = Buffer.toArray(updatedSingleTickets);
//                         };

//                         tickets.put(ticketId, updatedTicket);

//                         // Create transaction record with proper timestamp conversion
//                         let currentTime = Time.now();
//                         let transactionTime = Int.abs(currentTime);

//                         let transaction : Types.Transaction = {
//                             id = Text.concat(ticketId, Int.toText(currentTime));
//                             buyer = buyer;
//                             seller = ticket.owner;
//                             ticket = updatedSingleTickets.get(0);  
//                             totalTicket = quantity;
//                             amount = totalCost;
//                             timestamp = transactionTime;
//                         };

//                         transactions.put(buyer, transaction);

//                         return #ok("Transaction successful");
//                     };
//                 };
//             };
//         };
//     };

//   //   public func withdrawTicketix(
//   //     transactions: Types.Transactions,
//   //     userBalances: Types.UserBalances,
//   //     userId: Principal,
//   //     amount: Nat
//   // ): async Result.Result<Types.Transaction, Text> {
//   //     // Validate amount
//   //     if (amount == 0) {
//   //         return #err("Withdrawal amount must be greater than 0");
//   //     };

//   //     // Check minimum withdrawal amount
//   //     if (amount < 10_000) {
//   //         return #err("Minimum withdrawal amount is 0.01 ICP");
//   //     };

//   //     // Check maximum withdrawal amount
//   //     let maxWithdrawal: Nat = 1_000_000_000_000; // 10,000 ICP
//   //     if (amount > maxWithdrawal) {
//   //         return #err("Maximum withdrawal limit is 10,000 ICP");
//   //     };

//   //     // Check user balance
//   //     switch (userBalances.get(userId)) {
//   //         case null {
//   //             return #err("User balance not found");
//   //         };
//   //         case (?userBalance) {
//   //             let totalAmount = amount + 10_000; // Including transaction fee
//   //             if (userBalance.balance < totalAmount) {
//   //                 return #err("Insufficient balance (including transaction fees)");
//   //             };

//   //             // Create transaction record
//   //             let currentTime = Time.now();
//   //             let transactionId = Text.concat(
//   //                 Principal.toText(userId),
//   //                 Int.toText(currentTime)
//   //             );

//   //             let withdrawalTransaction: Types.Transaction = {
//   //                 id = transactionId;
//   //                 buyer = userId;
//   //                 seller = userId; // Same for withdrawal
//   //                 ticket = {
//   //                     id = ""; // Ensure this matches the SingleTicket type
//   //                     singleOwner = userId;
//   //                     status = #owned; // Ensure this matches your SingleTicket status
//   //                     // Include any other required fields for SingleTicket
//   //                 };
//   //                 totalTicket = 0;
//   //                 amount = amount;
//   //                 timestamp = Int.abs(currentTime); // Ensure this is an Int
//   //             };

//   //             // Update user balance
//   //             let newBalance: Types.UserBalance = {
//   //                 id = userId;
//   //                 balance = userBalance.balance - totalAmount;
//   //             };
//   //             userBalances.put(userId, newBalance);

//   //             // Store transaction
//   //             transactions.put(userId, withdrawalTransaction);

//   //             return #ok("Withdrawal successful");
//   //         };
//   //     };
//   // };
// }