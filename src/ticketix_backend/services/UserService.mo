import Principal "mo:base/Principal";
import Result "mo:base/Result";
import Text "mo:base/Text";
import Types "../types/Types";

module {
  public func authenticateUser(
    userId: Principal,
    users: Types.Users,
    username: Text,
    name: Text,
    balance: Nat,
  ): Result.Result<Types.User, Text> {
    switch (users.get(userId)) {
      case (?_) {
        return #err("User already registered");
      };
      case null {
        let newUser: Types.User = {
          id = userId;
          name = name;
          username = username;
          balance = balance;
          tickets = [];
        };
        users.put(userId, newUser);
        return #ok(newUser); 
      };
    }
  };

public func updateUserProfile(
    users: Types.Users,
    userId: Principal,
    updateData: Types.UserUpdateData,
  ): Result.Result<Types.User, Text> {
    if (Principal.isAnonymous(userId)) {
      return #err("Anonymous principals are not allowed");
    };

    switch (users.get(userId)) {
      case (null) {
        return #err("User not found!");
      };
      case (?user) {
        let username = switch (updateData.username) {
          case (null) { user.username };
          case (?newUsername) {
            if (Text.size(newUsername) < 3 or Text.size(newUsername) > 20) {
              return #err("USERNAME_INVALID: Username must be between 3 and 20 characters");
            };

            if (newUsername != user.username) {
              for ((id, existingUser) in users.entries()) {
                if (id != userId and Text.equal(existingUser.username, newUsername)) {
                  return #err("USERNAME_TAKEN: The username '" # newUsername # "' is already in use.");
                };
              };
            };
            newUsername;
          };
        };

        let name = switch (updateData.name) {
          case (null) { user.name };
          case (?newName) {
            if (Text.size(newName) < 1) {
              return #err("NAME_INVALID: Name must not be empty");
            };
            newName;
          };
        };

        let updatedUser: Types.User = {
          id = user.id;
          username = username;
          name = name;
          balance = user.balance;
          tickets = user.tickets;
        };

        users.put(userId, updatedUser);
        return #ok(updatedUser);
      };
    };
  };


}
