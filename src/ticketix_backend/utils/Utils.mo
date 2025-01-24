import Principal "mo:base/Principal";
import Int "mo:base/Int";
import Nat32 "mo:base/Nat32";
import Text "mo:base/Text";
import Time "mo:base/Time";

module {
  public func generateUUID(userPrincipal : Principal, ticket : Text) : Text {
    let principalText = Principal.toText(userPrincipal);
    let timestamp = Int.toText(Time.now());
    let ticketHash = Nat32.toText(Text.hash(ticket));

    let combined = principalText # timestamp # ticketHash;
    let finalHash = Text.hash(combined);
    return Nat32.toText(finalHash);
  };
};
