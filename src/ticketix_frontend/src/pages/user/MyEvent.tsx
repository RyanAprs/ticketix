import EventManagement from "@/components/features/EventManagement/EventManagement";
import LayoutDashboard from "@/components/ui/Layout/LayoutDashboard";

const MyEvent = () => {
  return (
    <LayoutDashboard title="My Tickets" className="w-full">
      <EventManagement />
    </LayoutDashboard>
  );
};

export default MyEvent;
