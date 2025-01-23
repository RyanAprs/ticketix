import Principal "mo:base/Principal";
import HashMap "mo:base/HashMap";

module {
    public type Users = HashMap.HashMap<Principal, User>;
    public type Tickets = HashMap.HashMap<Principal, Ticket>;
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

    public type Ticket = {
        id: Text;               
        title: Text;            
        description: Text;      
        image_url: Text;        
        price: Nat;             
        owner: Principal;       
        sales_deadline: Int;    
        total: Nat;             
        is_sold: Bool;          
    };

    public type Transaction = {
        id: Text;               
        buyer: Principal;       
        seller: Principal;      
        ticket: Ticket;         
        total_ticket: Nat;      
        amount: Nat;            
        timestamp: Int;         
    };
};
