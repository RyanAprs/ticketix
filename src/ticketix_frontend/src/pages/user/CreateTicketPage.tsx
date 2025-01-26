import CreateTicketForm from "@/components/features/TicketManagement/CreateTicketForm";
import LayoutDashboard from "@/components/ui/Layout/LayoutDashboard";

const CreateTicketPage = () => {
  return (
    <LayoutDashboard title="Create Ticket" className="w-full">
      <h1 className="text-2xl font-semibold text-title lg:text-3xl">
        Sale Ticket
      </h1>
      <CreateTicketForm />
    </LayoutDashboard>
  );
};

export default CreateTicketPage;
