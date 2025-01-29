import Principal "mo:base/Principal";
import HashMap "mo:base/HashMap";
import Array "mo:base/Array";
import Result "mo:base/Result";
import Text "mo:base/Text";
import Iter "mo:base/Iter";
import Blob "mo:base/Blob";
import UserService "services/UserService";
import Types "types/Types";
import IC "ic:aaaaa-aa";
import Cycles "mo:base/ExperimentalCycles";
import Debug "mo:base/Debug";
import Nat8 "mo:base/Nat8";
import Float "mo:base/Float";
import Int "mo:base/Int";
// import TransactionService "services/TransactionService";
import EventService "services/EventService";

actor TickeTix {
  private var users: Types.Users = HashMap.HashMap(0, Principal.equal, Principal.hash);
  private var events: Types.Events = HashMap.HashMap(0, Text.equal, Text.hash);
  private var userBalances: Types.UserBalances = HashMap.HashMap(0, Principal.equal, Principal.hash);
  private var transactions : Types.Transactions = HashMap.HashMap(0, Principal.equal, Principal.hash);

  private stable var usersEntries : [(Principal, Types.User)] = [];
  private stable var eventsEntries : [(Text, Types.Event)] = [];
  private stable var userBalancesEntries : [(Principal, Types.UserBalance)] = [];
  private stable var transactionsEntries : [(Principal, Types.Transaction)] = [];

  // PREUPGRADE & POSTUPGRADE
  system func preupgrade() {
    usersEntries := Iter.toArray(users.entries());
    eventsEntries := Iter.toArray(events.entries());
    userBalancesEntries := Iter.toArray(userBalances.entries());
    transactionsEntries := Iter.toArray(transactions.entries());
  };

  system func postupgrade() {
    users := HashMap.fromIter<Principal, Types.User>(usersEntries.vals(), 0, Principal.equal, Principal.hash);
    events := HashMap.fromIter<Text, Types.Event>(eventsEntries.vals(), 0, Text.equal, Text.hash);
    userBalances := HashMap.fromIter<Principal, Types.UserBalance>(userBalancesEntries.vals(), 0, Principal.equal, Principal.hash);
    transactions := HashMap.fromIter<Principal, Types.Transaction>(transactionsEntries.vals(), 0, Principal.equal, Principal.hash);
    usersEntries := [];
    eventsEntries := [];
    userBalancesEntries := [];
    transactionsEntries := [];
  };

  //  USERS ENFDPOINT ===========================================================
    // AUTHENTICATE USER
    public shared (msg) func authenticateUser(
      username: Text,
    ): async Result.Result<Types.User, Text> {
      return UserService.authenticateUser( msg.caller, users, username);
    };

    // GET CALLER PRINCIPAL
    public shared (msg) func whoami() : async Principal {
      msg.caller;
    };

    // UPDATE USER
    public shared (msg) func updateUserProfile(
      updateData: Types.UserUpdateData
    ): async Result.Result<Types.User, Text> {
      return UserService.updateUserProfile(users, msg.caller, updateData);
    };

    // GET ALL USERS
    public query func getAllUsers(): async [Principal] {
      var userList: [Principal] = [];
      let entries = users.entries();
      
      for (entry in entries) {
        let (key, _) = entry;
        userList := Array.append(userList, [key]);
      };
      
      return userList;
    };

    // GET USER BY USERNAME
    public query func getUserByUsername(username : Text) : async ?Types.User {
      return UserService.getUserByUsername(users, username);
    };

    // GET USER BY ID
    public query func getUserById(userId : Principal) : async ?Types.User {
      return users.get(userId);
    };

    // GET USER BY PRINCIPAL
    public query func getUserByPrincipal(userPrincipal: Principal): async ?Types.User {
      switch(users.get(userPrincipal)) {
          case (?user) {
              return ?user;  
          };
          case null {
              return null;  
          };
      };
    };

    // DELETE USER
    public query func deleteUser(userId : Principal) : async ?Types.User {
      return users.remove(userId);
    };

  // EVENTS ENDPOINT ==========================================================
  // POST EVENT
  public func postEvent(
      creator: Principal,
      imageUrl: Text,
      title: Text,
      description: Text,
      price: Float, 
      salesDeadline: Int,
      total: Nat,
    ) : async Result.Result<Types.Event, Text> {
      let priceInUSD = price / 10000; 
      return EventService.postEvent(events, creator, imageUrl, title, description, priceInUSD, salesDeadline, total);
    };

  // UPDATE EVENT
  public func updateEvent(
    userId: Principal,
    eventId: Text,
    updateData: Types.EventUpdateData
  ): async Result.Result<Types.Event, Text> {
      return EventService.updateEvent(userId, events, eventId, updateData);
  };

  // UPDATE TICKET STATUS
   public shared func updateTicketStatus(
        eventId: Text,
        userId: Principal,
        status: Types.TicketStatus   
    ) : async Result.Result<Types.Event, Text> {
        return EventService.updateTicketStatus(events, eventId, userId, status);
    };

  
  // GET EVENTS
  public func getAllEventPreviews() : async [Types.Event] {
    return Iter.toArray(events.vals());
  };

  // GET DETAIL EVENT
  public func getEventDetail(
    eventId: Text,
  ): async Result.Result<Types.Event, Text> {
    return EventService.getDetailEvent(events, eventId);
  };

  // GET ALL FOR SALE TICKETS
  public func getAllForSaleTicketPreviews() : async Result.Result<[Types.Event], Text> {
      let forSaleTickets = Iter.filter<Types.Event>(
          events.vals(),
          func (event: Types.Event) : Bool {
              let ticketIter = Array.vals(event.ticket);
              for (single in ticketIter) {
                  if (single.status == #forSale) {
                      return true;
                  };
              };
              return false;
          }
      );

      let ticketArray = Iter.toArray(forSaleTickets);
      if (ticketArray.size() == 0) {
          return #err("No tickets for sale available.");
      } else {
          return #ok(ticketArray);
      };
  };

  // GET OWNED TICKETS
  public func getOwnedTickets(
      userId: Principal
  ) : async Result.Result<[Types.Event], Text> {
      let ownedTickets = Iter.filter<Types.Event>(
          events.vals(),
          func (event: Types.Event) : Bool {
              // Convert array to iterator using Array.vals()
              let ticketIter = Array.vals(event.ticket);
              for (ticket in ticketIter) {
                  if (ticket.status == #owned and ticket.owner == userId) {
                      return true;
                  };
              };
              return false;
          }
      );

      let ticketArray = Iter.toArray(ownedTickets);
      if (ticketArray.size() == 0) {
          return #err("You do not own any tickets.");
      } else {
          return #ok(ticketArray);
      };
  };

  // GET ALL OWNED TICKETS
  public func getAllOwnedTickets(
    userId: Principal
  ): async Result.Result<[Types.Event], Text> {
    let ownedTickets = Iter.filter<Types.Event>(
      events.vals(),
      func (ticket: Types.Event) : Bool {
        return ticket.creator == userId;
      }
    );
    
    let ticketArray = Iter.toArray(ownedTickets);
    if (ticketArray.size() == 0) {
      return #err("You do not own any tickets.");
    } else {
      return #ok(ticketArray);
    };
  };

  // GET ALL SINGLE OWNER TICKETS
  public func getAllSingleOwnerTickets(
    userId: Principal
    ) : async Result.Result<[Types.Event], Text> {
        let singleOwnerTickets = Iter.filter<Types.Event>(
            events.vals(),
            func (event: Types.Event) : Bool {
                let ticketIter = Array.vals(event.ticket);
                for (ticket in ticketIter) {
                    if (ticket.owner == userId) {
                        return true;
                    };
                };
                return false;
            }
        );

        let ticketArray = Iter.toArray(singleOwnerTickets);
        if (ticketArray.size() == 0) {
            return #err("You do not own any single tickets.");
        } else {
            return #ok(ticketArray);
        };
  };

  // public func getAllSingleOwnerTicketByEvent(ticketId: Text) : async Result.Result<[Types.Event], Text> {
  //     let singleOwnerTickets = Iter.filter<Types.Event>(
  //         events.vals(),
  //         func (event: Types.Event) : Bool {
  //             let ticketIter = Array.vals(event.ticket);
  //             for (single in ticketIter) {
  //                 if (single.status == #forSale ) {
  //                     return true;
  //                 };
  //             };
  //             return false;
  //         }
  //     );

  //     let ticketArray = Iter.toArray(singleOwnerTickets);
  //     if (ticketArray.size() == 0) {
  //         return #err("No tickets for sale available for this event.");
  //     } else {
  //         return #ok(ticketArray);
  //     };
  // };

  // GET ALL SINGLE OWNER TICKETS BY EVENT
  public func getAllSingleOwnerTicketByEvent(eventId: Text) : async Result.Result<[Types.Ticket], Text> {
      switch (events.get(eventId)) {
          case (null) {
              return #err("Event not found!");
          };
          case (?event) {
              var tickets : [Types.Ticket] = [];
              for (ticket in event.ticket.vals()) {
                  if (ticket.status == #forSale) {
                      tickets := Array.append<Types.Ticket>(tickets, [ticket]);
                  };
              };
              return #ok(tickets);
          };
      };
  };


  // DELETE TICKET
  public func deleteTicket (
    eventId: Text,
    userId: Principal,
  ) : async Result.Result<(), Text> {
    return EventService.deleteEvent(events, userId, eventId);
  };

  // BALANCE ==========================================================================
  // GET ACCOUNT ICP BALANCE
  // public shared (msg) func getAccountBalance() : async Nat {
  //   return await UserService.getAccountBalance(msg.caller);
  // };

  // // GET CREDIT BALANCE
  // public shared (msg) func getCreditBalance() : async Types.UserBalance {
  //   return UserService.getCreditBalance(userBalances, msg.caller);
  // };

  // GET ICP USD RATE
  public func getIcpUsdRate() : async Text {
    let host : Text = "api.coingecko.com";
    let url = "https://" # host # "/api/v3/simple/price?ids=internet-computer&vs_currencies=usd";

    let request_headers = [
      {
        name = "User-Agent";
        value = "icp-price-feed";
      },
      {
        name = "Accept";
        value = "application/json";
      },
    ];

    let http_request : IC.http_request_args = {
      url = url;
      max_response_bytes = ?2048;
      headers = request_headers;
      body = null;
      method = #get;
      transform = ?{
        function = transform;
        context = Blob.fromArray([]);
      };
    };

    Cycles.add<system>(230_949_927_000);

    let http_response : IC.http_request_result = await IC.http_request(http_request);

    Debug.print(debug_show (http_response));

    let decoded_text : Text = switch (Text.decodeUtf8(http_response.body)) {
      case (null) {"Null value returned"};
      case (?y) {y};
    };

    decoded_text;
  };

  public query func transform({
    context : Blob;
    response: IC.http_request_result;
  }) : async IC.http_request_result {

    let _context_array : [Nat8] = Blob.toArray(context);

    {
      response with headers = [];
    }
  };

  // TRANSACTION ==============================================================
  // // Function to purchase tickets
  //  public shared(msg) func purchaseTickets(
  //     ticketId: Text, 
  //     quantity: Nat
  //   ) : async Result.Result<Text, Text> {
  //       let buyer = msg.caller;
  //       return await TransactionService.purchaseTickets(tickets, ticketId, quantity, userBalances, buyer, transactions);
  //   };
    
  //   // Helper function to get available tickets
  //   public query func getAvailableTickets(ticketId: Text) : async Nat {
  //       switch(tickets.get(ticketId)) {
  //           case null { 0 };
  //           case (?ticket) {
  //               Array.filter<Types.SingleTicket>(
  //                   ticket.singleTicket,
  //                   func(t: Types.SingleTicket) : Bool { 
  //                       switch(t.status) {
  //                           case (#forSale) { true };
  //                           case (_) { false };
  //                       };
  //                   }
  //               ).size();
  //           };
  //       };
  //   };

};
