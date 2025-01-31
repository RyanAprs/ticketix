import CreateEventForm from "@/components/features/EventManagement/CreateEventForm";
import LayoutDashboard from "@/components/ui/Layout/LayoutDashboard";

const CreateEventPage = () => {
  return (
    <LayoutDashboard title="Create Ticket" className="w-full">
      <h1 className="text-2xl font-semibold text-title lg:text-3xl">
        Create Event
      </h1>
      <CreateEventForm />
    </LayoutDashboard>
  );
};

export default CreateEventPage;
