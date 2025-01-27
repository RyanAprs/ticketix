import TicketManagement from "@/components/features/TicketManagement/TicketManagement";
import LayoutDashboard from "@/components/ui/Layout/LayoutDashboard";

const MyTickets = () => {
  return (
    <LayoutDashboard title="My Tickets" className="w-full">
      <TicketManagement  />
    </LayoutDashboard>
  );
};

export default MyTickets;
