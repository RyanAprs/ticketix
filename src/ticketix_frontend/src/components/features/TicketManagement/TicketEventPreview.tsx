import { Button } from "@/components/ui/Button/button";
import CustomButton from "@/components/ui/Button/CustomButton";
import LoginDialog from "@/components/ui/Dialog/LoginDialog";
import { CustomInput } from "@/components/ui/Input/CustomInput";
import ModalCustom from "@/components/ui/Modal/ModalCustom";
import { transferIcp } from "@/lib/services/TransactionService";
import { EnhancedTicketType } from "@/pages/ticket/TicketPage";
import { useAuthManager } from "@/store/AuthProvider";
import { Principal } from "@dfinity/principal";
import { Ticket, TicketX } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface TicketEventPreviewProps {
  tickets: EnhancedTicketType[];
  isOwner: boolean;
}

const TicketEventPreview = ({ tickets, isOwner }: TicketEventPreviewProps) => {
  const [openModal, setOpenModal] = useState(false);
  const [selectedTicket, setSelectedTicket] =
    useState<EnhancedTicketType | null>(null);
  const [ticketCount, setTicketCount] = useState<number>(1);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const { isAuthenticated, actor, principal } = useAuthManager();
  const navigate = useNavigate();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleDialogOpen = () => {
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  const handleOpenModal = (ticket: EnhancedTicketType) => {
    setSelectedTicket(ticket);
    setTicketCount(1);
    setError("");
    setOpenModal(true);
  };

  const handlePurchase = async () => {
    if (!selectedTicket) return;

    if (ticketCount > selectedTicket.totalTickets) {
      setError("Jumlah tiket yang dibeli melebihi stok tersedia.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      if (!isAuthenticated) {
        throw new Error("Please login first");
      }

      const totalCost = selectedTicket.price * ticketCount;

      const selectedTickets = Array(ticketCount).fill(selectedTicket.id);

      await transferIcp({
        to: selectedTicket.owner.toString(),
        amount: totalCost,
        ticketIds: selectedTickets,
      });

      if (actor) {
        const result = await actor.purchaseTickets(
          selectedTicket.eventId,
          selectedTickets
        );

        console.log(result);

        if ("err" in result) {
          throw new Error(result.err);
        }

        alert("Purchase successful!");
        setOpenModal(false);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Purchase failed");
    } finally {
      setLoading(false);
    }
  };

  const handlePurchaseDemo = async () => {
    if (!selectedTicket) return;

    if (ticketCount > selectedTicket.totalTickets) {
      setError("The number of tickets purchased exceeded the available stock!");
      return;
    }

    try {
      setLoading(true);
      setError("");

      if (!isAuthenticated) {
        throw new Error("Please login first");
      }

      const selectedTickets = Array(ticketCount).fill(selectedTicket.id);

      if (actor && principal) {
        const result = await actor.buyTicketsDemo(
          selectedTicket.eventId,
          selectedTickets,
          principal,
          selectedTicket.principal
        );

        if ("err" in result) {
          throw new Error(result.err);
        }

        navigate("/dashboard/ticket");
        setOpenModal(false);
      }
    } catch (err) {
      console.error("Demo purchase error:", err);
      setError(err instanceof Error ? err.message : "Demo purchase failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {tickets.length === 0 ? (
        <div className="text-center py-10 flex flex-col gap-4">
          <TicketX />
          <p className="text-lg font-semibold text-gray-600">
            No tickets available
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {tickets.map((ticket, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-6 shadow-xl transition-all duration-300 border border-gray-100"
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
                  <span className="text-sm text-gray-500">
                    Available Tickets
                  </span>
                  <span className="text-sm font-medium text-gray-900">
                    {ticket.totalTickets}
                  </span>
                </div>

                {!isOwner && (
                  <CustomButton
                    onClick={() =>
                      isAuthenticated
                        ? handleOpenModal(ticket)
                        : handleDialogOpen()
                    }
                    className="w-full py-2.5 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors duration-200 focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Purchase Demo
                  </CustomButton>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <ModalCustom
        title="Purchase Ticket"
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
        className="max-w-[700px]"
      >
        {selectedTicket && (
          <div className="px-5 py-3">
            <div className="mt-3 flex items-center gap-3">
              <CustomInput
                type="number"
                label="Total Ticket"
                labelClassName="text-start"
                value={ticketCount}
                min={1}
                max={selectedTicket.totalTickets}
                onChange={(e) => setTicketCount(Number(e.target.value))}
              />
            </div>

            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-700 font-medium">Total Cost</p>
              <p className="text-xl font-bold text-indigo-600">
                {(selectedTicket.price * ticketCount).toFixed(2)} ICP
              </p>
            </div>

            {error && <div className="mt-3 text-red-500 text-sm">{error}</div>}
          </div>
        )}

        <div className="flex w-full justify-end gap-3 px-5 pb-5">
          <Button
            variant="outline"
            onClick={handlePurchase}
            className="mb-3 mt-5"
          >
            {loading ? "Processing..." : "Plug Wallet"}
          </Button>
          <Button
            variant="secondary"
            className="mb-3 mt-5"
            onClick={handlePurchaseDemo}
            disabled={loading || !selectedTicket || ticketCount < 1}
          >
            {loading ? "Processing..." : "Confirm Purchase Demo"}
          </Button>
        </div>
      </ModalCustom>

      <LoginDialog isOpen={isDialogOpen} onClose={handleCloseDialog} />
    </div>
  );
};

export default TicketEventPreview;
