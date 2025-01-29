import Principal "mo:base/Principal";
import HashMap "mo:base/HashMap";
import Array "mo:base/Array";
import Result "mo:base/Result";
import Text "mo:base/Text";
import Iter "mo:base/Iter";
import Blob "mo:base/Blob";
import UserService "services/UserService";
import Types "types/Types";
import TicketService "services/TicketService";
import IC "ic:aaaaa-aa";
import Cycles "mo:base/ExperimentalCycles";
import Debug "mo:base/Debug";
import Nat8 "mo:base/Nat8";

actor TickeTix {
  private var users: Types.Users = HashMap.HashMap(0, Principal.equal, Principal.hash);
  private var tickets: Types.Tickets = HashMap.HashMap(0, Text.equal, Text.hash);
  private var userBalances: Types.UserBalances = HashMap.HashMap(0, Principal.equal, Principal.hash);

  private stable var usersEntries : [(Principal, Types.User)] = [];
  private stable var ticketsEntries : [(Text, Types.Ticket)] = [];
  private stable var userBalancesEntries : [(Principal, Types.UserBalance)] = [];

  // PREUPGRADE & POSTUPGRADE
  system func preupgrade() {
    usersEntries := Iter.toArray(users.entries());
    ticketsEntries := Iter.toArray(tickets.entries());
    userBalancesEntries := Iter.toArray(userBalances.entries());
  };

  system func postupgrade() {
    users := HashMap.fromIter<Principal, Types.User>(usersEntries.vals(), 0, Principal.equal, Principal.hash);
    tickets := HashMap.fromIter<Text, Types.Ticket>(ticketsEntries.vals(), 0, Text.equal, Text.hash);
    userBalances := HashMap.fromIter<Principal, Types.UserBalance>(userBalancesEntries.vals(), 0, Principal.equal, Principal.hash);
    usersEntries := [];
    ticketsEntries := [];
    userBalancesEntries := [];
  };

  //  USERS ENFDPOINT ===========================================================
  // AUTHENTICATE USER
  public shared (msg) func authenticateUser(
    username: Text,
    balance: Nat,
  ): async Result.Result<Types.User, Text> {
    return UserService.authenticateUser( msg.caller, users, username, balance);
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

  // TICKETS ENDPOINT ==========================================================
  // POST TICKET
  public func postTicket(
      owner: Principal,
      imageUrl: Text,
      title: Text,
      description: Text,
      price: Float, 
      salesDeadline: Int,
      total: Nat,
    ) : async Result.Result<Types.Ticket, Text> {
      let priceInUSD = price / 10000; 
      return TicketService.postTicket(tickets, owner, imageUrl, title, description, priceInUSD, salesDeadline, total);
    };


  // UPDATE TICKET
  public func updateTicket(
    userId: Principal,
    ticketId: Text,
    updateData: Types.TicketUpdateData
  ): async Result.Result<Types.Ticket, Text> {
      return TicketService.updateTicket(userId, tickets, ticketId, updateData);
  };

  // UPDATE TICKET STATUS
   public shared func updateTicketStatus(
        ticketId: Text,
        userId: Principal,
        status: Types.ticketStatus   
    ) : async Result.Result<Types.Ticket, Text> {
        return TicketService.updateTicketStatus(tickets, ticketId, userId, status);
    };

  // GET TICKETS
  public func getAllTicketPreviews() : async [Types.Ticket] {
    return Iter.toArray(tickets.vals());
  };

  // GET DETAIL TICKET
  public func getTicketDetail(
    ticketId: Text,
  ): async Result.Result<Types.Ticket, Text> {
    return TicketService.getDetailTicket(tickets, ticketId);
  };

  // GET ALL FOR SALE TICKETS
  public func getAllForSaleTicketPreviews() : async Result.Result<[Types.Ticket], Text> {
      let forSaleTickets = Iter.filter<Types.Ticket>(
          tickets.vals(),
          func (ticket: Types.Ticket) : Bool {
              let ticketIter = Array.vals(ticket.singleTicket);
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
  ) : async Result.Result<[Types.Ticket], Text> {
      let ownedTickets = Iter.filter<Types.Ticket>(
          tickets.vals(),
          func (ticket: Types.Ticket) : Bool {
              // Convert array to iterator using Array.vals()
              let ticketIter = Array.vals(ticket.singleTicket);
              for (single in ticketIter) {
                  if (single.status == #owned and ticket.owner == userId) {
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
  ): async Result.Result<[Types.Ticket], Text> {
    let ownedTickets = Iter.filter<Types.Ticket>(
      tickets.vals(),
      func (ticket: Types.Ticket) : Bool {
        return ticket.owner == userId;
      }
    );
    
    let ticketArray = Iter.toArray(ownedTickets);
    if (ticketArray.size() == 0) {
      return #err("You do not own any tickets.");
    } else {
      return #ok(ticketArray);
    };
  };

  public func getAllSingleOwnerTickets(
    userId: Principal
  ) : async Result.Result<[Types.Ticket], Text> {
      let singleOwnerTickets = Iter.filter<Types.Ticket>(
          tickets.vals(),
          func (ticket: Types.Ticket) : Bool {
              let ticketIter = Array.vals(ticket.singleTicket);
              for (single in ticketIter) {
                  if (single.singleOwner == userId) {
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

  // DELETE TICKET
  public func deleteTicket (
    ticketId: Text,
    userId: Principal,
  ) : async Result.Result<(), Text> {
    return TicketService.deleteTicket(tickets, userId, ticketId);
  };

  // BALANCE ==========================================================================
  // GET ACCOUNT ICP BALANCE
  public shared (msg) func getAccountBalance() : async Nat {
    return await UserService.getAccountBalance(msg.caller);
  };

  // GET CREDIT BALANCE
  public shared (msg) func getCreditBalance() : async Types.UserBalance {
    return UserService.getCreditBalance(userBalances, msg.caller);
  };

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

};
