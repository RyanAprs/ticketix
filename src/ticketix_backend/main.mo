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
import EventService "services/EventService";
import TicketService "services/TicketService";
import TransactionService "services/TransactionService";

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
      return UserService.authenticateUser(msg.caller, users, username, userBalances);
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

    // GET USER BY PRINCIPAL
    public query func getUserBalance(userPrincipal: Principal): async ?Types.UserBalance {
      switch(userBalances.get(userPrincipal)) {
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

    // public func getUserBalance(
    //   userId: Principal,
    //   userBalances: HashMap.HashMap<Principal, Types.UserBalance>
    // ): Result.Result<Float, Text> {
    //     switch (userBalances.get(userId)) {
    //       case (?balance) {
    //         return #ok(balance.balance); 
    //       };
    //       case null {
    //         return #err("User not found"); 
    //       };
    //     }
    // };

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

  // GET OWNED EVENT
  public func getOwnedEvents(
      userId: Principal
  ) : async Result.Result<[Types.Event], Text> {
      let ownedEvent = Iter.filter<Types.Event>(
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

      let ticketArray = Iter.toArray(ownedEvent);
      if (ticketArray.size() == 0) {
          return #err("You do not own any event.");
      } else {
          return #ok(ticketArray);
      };
  };

  // GET ALL EVENT BY CREATOR
  public func getEventByCreator(
    userId: Principal
  ): async Result.Result<[Types.Event], Text> {
    let ownedEvents = Iter.filter<Types.Event>(
      events.vals(),
      func (event: Types.Event) : Bool {
        return event.creator == userId;
      }
    );
    
    let eventArray = Iter.toArray(ownedEvents);
    if (eventArray.size() == 0) {
      return #err("You do not own any event.");
    } else {
      return #ok(eventArray);
    };
  };

    // DELETE EVENT
  public func deleteEvent (
    eventId: Text,
    userId: Principal,
  ) : async Result.Result<(), Text> {
    return EventService.deleteEvent(events, userId, eventId);
  };

    // COMPLETED EVENT STATUS
   public shared(msg) func updateEventStatusToCompleted(
        eventId: Text
    ): async Result.Result<Types.Event, Text> {
        return EventService.updateEventStatusToCompleted(
            events,     
            eventId,    
            msg.caller  
        );
    };

  // TICKET ENDPOINT ==========================================================================
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

  // GET ALL TICKET BY OWNER
  public shared(_msg) func getTicketByOwner(
    // events: Types.Events,
    userId: Principal
  ) : async Result.Result<[Types.Ticket], Text> {
    var userTickets : [Types.Ticket] = [];

    for (event in events.vals()) {
        let ownedTickets = Array.filter(
            event.ticket,
            func (ticket: Types.Ticket) : Bool {
                Principal.equal(ticket.owner, userId)
            }
        );

        if (ownedTickets.size() > 0) {
            userTickets := Array.append(userTickets, ownedTickets);
        };
    };

    if (userTickets.size() == 0) {
        return #err("You do not own any tickets");
    };
      return #ok(userTickets);
  };

  // GET ALL TICKET BY OWNER AND STATUS OWNED
  public shared(_msg) func getTicketByOwnerOwnedStatus(
    userId: Principal
  ) : async Result.Result<[Types.Ticket], Text> {
    var userTickets : [Types.Ticket] = [];

    for (event in events.vals()) {
        let ownedTickets = Array.filter(
            event.ticket,
            func (ticket: Types.Ticket) : Bool {
                Principal.equal(ticket.owner, userId) and ticket.status == #owned;
            }
        );

        if (ownedTickets.size() > 0) {
            userTickets := Array.append(userTickets, ownedTickets);
        };
    };

    if (userTickets.size() == 0) {
        return #err("You do not own any tickets");
    };
      return #ok(userTickets);
  };

  // GET ALL FOR SALE TICKETS BY EVENT
  public func getAllForSaleTicketByEvent(eventId: Text) : async Result.Result<[Types.Ticket], Text> {
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

    // UPDATE TICKET STATUS
    public shared(msg) func updateTicketStatus(
        eventId : Text,
        ticketId : Text,
        status : Types.TicketStatus
    ) : async Result.Result<Types.Event, Text> {
        let userId = msg.caller;
        return TicketService.updateTicketStatus(
            events, 
            eventId, 
            userId, 
            ticketId, 
            status
        );
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
  // GET TRANSACTION BY USER ID
  public func getTransactionByUserId(
    userId: Principal
  ): async Result.Result<[Types.Transaction], Text> {
    let userTransactions = Iter.filter<Types.Transaction>(
      transactions.vals(),
      func (transaction: Types.Transaction) : Bool {
        return transaction.buyer == userId or transaction.seller == userId;
      }
    );
    
    let transactionArray = Iter.toArray(userTransactions);
    if (transactionArray.size() == 0) {
      return #err("You do not own any transaction.");
    } else {
      return #ok(transactionArray);
    };
  };
  // PURCHASE TICKETS
  public shared (msg) func purchaseTickets(
    eventId: Text,
    ticketIds: [Text],
  ) : async Result.Result<Text, Text> {
      let buyer = msg.caller;
      
      return await TransactionService.buyTickets(
          events,        
          transactions,  
          userBalances,  
          buyer,
          eventId,
          ticketIds
      );
  };

  public func buyTicketsDemo(
    eventId: Text,
    ticketIds: [Text],
    buyer: Principal,
    seller: Principal
  ) : async Result.Result<Text, Text> {
      
      return await TransactionService.buyTicketsDemo(
          events,        
          transactions,  
          userBalances,
          buyer,
          eventId,
          ticketIds,
          seller
      );
  };

  public func resellTicketsDemo(
    eventId: Text,
    seller: Principal,
    ticketId: Text,
  ): async Result.Result<Text, Text> {
    return await TransactionService.resellTicketsDemo(
      events, 
      seller, 
      eventId, 
      ticketId
    );
  };

};
