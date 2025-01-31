import { Button } from "@/components/ui/Button/button";
import CustomButton from "@/components/ui/Button/CustomButton";
import { CustomInput } from "@/components/ui/Input/CustomInput";
import ModalCustom from "@/components/ui/Modal/ModalCustom";
import { EnhancedTicketType } from "@/pages/ticket/TicketPage";
import { Ticket } from "lucide-react";
import { useState } from "react";

interface TicketEventPreviewProps {
  tickets: EnhancedTicketType[];
}

const TicketEventPreview = ({ tickets }: TicketEventPreviewProps) => {
  const [openModal, setOpenModal] = useState(false);
  const [ticketCount, setTicketCount] = useState<number>(1);
  const [error, setError] = useState<string>("");

  const handlePurchase = (ticket: EnhancedTicketType) => {
    if (ticketCount > ticket.totalTickets) {
      setError("Jumlah tiket yang dibeli melebihi stok tersedia.");
      return;
    }

    const selectedTickets = Array(ticketCount).fill(ticket.id);
    console.log("Ticket IDs:", selectedTickets);

    setError("");
    setOpenModal(false);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {tickets.map((ticket, index) => (
          <div
            key={index}
            className="bg-white rounded-xl p-6 hover:shadow-xl transition-all duration-300 border border-gray-100"
          >
            <div className="flex flex-col space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Ticket className="w-5 h-5 text-indigo-500" />
                  <p className="text-sm font-medium text-gray-600 truncate">
                    {ticket.ownerUsername}
                  </p>
                </div>
                <span className="text-lg font-semibold text-indigo-600">
                  {ticket.price} ICP
                </span>
              </div>

              <div className="flex items-center justify-between py-3 border-y border-gray-100">
                <span className="text-sm text-gray-500">Available Tickets</span>
                <span className="text-sm font-medium text-gray-900">
                  {ticket.totalTickets}
                </span>
              </div>

              <CustomButton
                onClick={() => setOpenModal(true)}
                className="w-full py-2.5 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors duration-200 focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Purchase Ticket
              </CustomButton>
            </div>
          </div>
        ))}
      </div>

      <ModalCustom
        title="Purchase Ticket"
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
        className="max-w-[700px]"
      >
        <div className="px-5 py-3 text-subtext">
          <div className="mt-3 flex items-center gap-3">
            <CustomInput
              type="number"
              label="Total Ticket"
              labelClassName="text-start"
              value={ticketCount}
              onChange={(e) => setTicketCount(Number(e.target.value))}
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
        </div>
        <div className="flex w-full justify-end">
          <Button
            variant="secondary"
            className="mb-3 mt-5"
            onClick={() => handlePurchase(tickets[0])}
          >
            Purchase
          </Button>
        </div>
      </ModalCustom>
    </div>
  );
};

export default TicketEventPreview;
