import Principal "mo:base/Principal";
import HashMap "mo:base/HashMap";
import Float "mo:base/Float";

module {
    public type Users = HashMap.HashMap<Principal, User>;
    public type Tickets = HashMap.HashMap<Text, Ticket>;
    public type Transactions = HashMap.HashMap<Principal, Transaction>;
    public type UserBalances = HashMap.HashMap<Principal, UserBalance>;

    public type User = {
        id: Principal;          
        username: Text;         
        balance: Nat;           
        tickets: [Ticket];    
    };

    public type UserBalance = {
        id: Principal;
        balance: Nat;
    };

    public type UserUpdateData = {
        username: ?Text;
    };

    public type ticketStatus = {
        #owned;
        #forSale;
        #used;
    };

    public type Ticket = {
        id: Text;               
        owner: Principal;       
        title: Text;            
        description: Text;      
        imageUrl: Text;        
        price: Float;             
        salesDeadline: Int;    
        total: Nat;             
        createdAt: Int;
        singleTicket: [SingleTicket]
    };

    public type SingleTicket = {
        id: Text;
        singleOwner: Principal;
        status: ticketStatus;          
    };

    public type TicketUpdateData = {
        title: ?Text;            
        description: ?Text;      
        imageUrl: ?Text;        
        price: ?Float;             
        salesDeadline: ?Int;    
        total: ?Nat;             
    };

    public type Transaction = {
        id: Text;               
        buyer: Principal;       
        seller: Principal;      
        ticket: SingleTicket;         
        totalTicket: Nat;      
        amount: Nat;            
        timestamp: Int;         
    };
};
