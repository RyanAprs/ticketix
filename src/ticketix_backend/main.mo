import Principal "mo:base/Principal";
import HashMap "mo:base/HashMap";
import Array "mo:base/Array";
import Result "mo:base/Result";
import Text "mo:base/Text";
import Iter "mo:base/Iter";
import UserService "services/UserService";
import Types "types/Types";
import TicketService "services/TicketService";

actor TickeTix {
  private var users: Types.Users = HashMap.HashMap(0, Principal.equal, Principal.hash);
  private var tickets: Types.Tickets = HashMap.HashMap(0, Text.equal, Text.hash);

  private stable var usersEntries : [(Principal, Types.User)] = [];
  private stable var ticketsEntries : [(Text, Types.Ticket)] = [];

  // PREUPGRADE & POSTUPGRADE
  system func preupgrade() {
    usersEntries := Iter.toArray(users.entries());
    ticketsEntries := Iter.toArray(tickets.entries());
  };

  system func postupgrade() {
    users := HashMap.fromIter<Principal, Types.User>(usersEntries.vals(), 0, Principal.equal, Principal.hash);
    tickets := HashMap.fromIter<Text, Types.Ticket>(ticketsEntries.vals(), 0, Text.equal, Text.hash);
    usersEntries := [];
    ticketsEntries := [];
  };

  //  USERS ENFDPOINT ===========================================================
  // AUTHENTICATE USER
  public func authenticateUser(
    userPrincipal: Principal,
    username: Text,
    balance: Nat,
  ): async Result.Result<Types.User, Text> {
    return UserService.authenticateUser(userPrincipal, users, username, balance);
  };

  // GET CALLER PRINCIPAL
  public shared (msg) func whoami() : async Principal {
    msg.caller;
  };

  // UPDATE USER
  public func updateUserProfile(userId: Principal, updateData: Types.UserUpdateData): async Result.Result<Types.User, Text> {
    return UserService.updateUserProfile(users, userId, updateData);
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

  // GET USER BY PRINCIPAL
  public func getUserByPrincipal(userId: Principal): async Result.Result<Types.User, Text> {
      return UserService.getDetailUser(users, userId);
  };


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
    price: Nat,
    salesDeadline: Int,
    total: Nat,
    isSold: Bool
  ) : async Result.Result<Types.Ticket, Text> {
    return TicketService.postTicket(tickets, owner, imageUrl, title, description, price, salesDeadline, total, isSold);
  };

  // UPDATE TICKET
  public func updateTicket(
    userId: Principal,
    ticketId: Text,
    updateData: Types.TicketUpdateData
  ): async Result.Result<Types.Ticket, Text> {
      return TicketService.updateTicket(userId, tickets, ticketId, updateData);
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

  // DELETE TICKET
  public func deleteTicket (
    ticketId: Text,
    userId: Principal,
  ) : async Result.Result<(), Text> {
    return TicketService.deleteTicket(tickets, userId, ticketId);
  };

};
