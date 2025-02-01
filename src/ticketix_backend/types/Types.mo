import Principal "mo:base/Principal";
import HashMap "mo:base/HashMap";
import Float "mo:base/Float";

module {
    public type Users = HashMap.HashMap<Principal, User>;
    public type Events = HashMap.HashMap<Text, Event>;
    public type Transactions = HashMap.HashMap<Principal, Transaction>;
    public type UserBalances = HashMap.HashMap<Principal, UserBalance>;

    public type User = {
        id: Principal;          
        username: Text;         
    };

    public type UserBalance = {
        id: Principal;
        balance: Float;
    };

    public type UserUpdateData = {
        username: ?Text;
    };

    public type Event = {
        id: Text;               
        creator: Principal;       
        title: Text;            
        description: Text;      
        imageUrl: Text;        
        salesDeadline: Int;    
        total: Nat;             
        createdAt: Int;
        ticket: [Ticket];
    };

    public type TicketStatus = {
        #owned;
        #forSale;
        #used;
    };

    public type Ticket = {
        id: Text;
        eventId: Text;
        owner: Principal;
        status: TicketStatus;  
        price: Float;        
    };

    public type EventUpdateData = {
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
        ticket: Ticket;         
        totalTicket: Nat;      
        amount: Float;            
        timestamp: Int;         
    };
};
