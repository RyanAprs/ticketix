import Principal "mo:base/Principal";
import HashMap "mo:base/HashMap";
import Array "mo:base/Array";
import Result "mo:base/Result";
import Text "mo:base/Text";
import UserService "services/UserService";
import Types "types/Types";

actor TickeTix {
  var users: Types.Users = HashMap.HashMap(0, Principal.equal, Principal.hash);

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

  // GET USER BY ID
  public query func getUserById(userId : Principal) : async ?Types.User {
    return users.get(userId);
  };

  // GET USER BY USERNAME
  public query func getUserByUsername(username : Text) : async ?Types.User {
    return UserService.getUserByUsername(users, username);
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

  public query func deleteUser(userId : Principal) : async ?Types.User {
    return users.remove(userId);
  };

  public query func greet(name: Text): async Text {
    return "Hello, " # name # "!";
  };
};
