import Types "../types/Types";
import Principal "mo:base/Principal";
import Text "mo:base/Text";
import Result "mo:base/Result";
import Time "mo:base/Time";
import Utils "../utils/Utils";

module {
    public func postTicket(
        tickets: Types.Tickets,
        owner: Principal,
        imageUrl: Text,
        title: Text,
        description: Text,
        price: Nat,
        salesDeadline: Int,
        total: Nat,
        isSold: Bool,
    ) : Result.Result<Types.Ticket, Text>{
        if (Principal.isAnonymous(owner)) {
            return #err("Anonymous principals cannot post content");
        };

        // validate title
        if (Text.size(title) < 3 or Text.size(title) > 100) {
            return #err("Anonymous principals cannot post ticket");
        };

        // validate description
        if (description == "" or Text.size(description) > 1000) {
            return #err("Description must be between 1 and 1000 characters");
        };

        // validate thumbnail
        if (imageUrl == "" or not _isValidUrl(imageUrl)) {
            return #err("Invalid imageUrl URL");
        };

        // validate total ticket
        if (total < 0) {
            return #err("Total ticket must be at least 1");
        };

        let ticketId = Utils.generateUUID(owner, description);

        let newTicket : Types.Ticket = {
            id = ticketId;
            owner = owner;
            title = title;
            description = description;
            imageUrl = imageUrl;
            price = price;
            salesDeadline = salesDeadline;
            total = total;
            isSold = isSold;
            createdAt = Time.now();
        };

        tickets.put(ticketId, newTicket);
        #ok(newTicket);
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