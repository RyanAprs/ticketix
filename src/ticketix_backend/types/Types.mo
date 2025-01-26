import Principal "mo:base/Principal";
import HashMap "mo:base/HashMap";

module {
    public type Users = HashMap.HashMap<Principal, User>;
    public type Tickets = HashMap.HashMap<Text, Ticket>;
    public type Transactions = HashMap.HashMap<Principal, Transaction>;

    public type User = {
        id: Principal;          
        username: Text;         
        balance: Nat;           
        tickets: [Ticket];    
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
        price: Nat;             
        salesDeadline: Int;    
        total: Nat;             
        isSold: Bool;
        createdAt: Int;
        status: ticketStatus;          
    };

    public type TicketUpdateData = {
        title: ?Text;            
        description: ?Text;      
        imageUrl: ?Text;        
        price: ?Nat;             
        salesDeadline: ?Int;    
        total: ?Nat;             
    };

    public type Transaction = {
        id: Text;               
        buyer: Principal;       
        seller: Principal;      
        ticket: Ticket;         
        totalTicket: Nat;      
        amount: Nat;            
        timestamp: Int;         
    };
};
