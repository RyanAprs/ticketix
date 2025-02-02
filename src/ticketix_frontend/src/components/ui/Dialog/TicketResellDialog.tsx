import React from "react";
import { Ticket } from "lucide-react";
import { Link } from "react-router-dom";
import { Dialog } from "@headlessui/react";
import CustomButton from "../Button/CustomButton";

interface Ticket {
  id: string;
  eventId: string;
  price: number;
}

interface TicketResellDialogProps {
  open?: boolean;
  onOpenChange: (open: boolean) => void;
  ticketOwned: Ticket[];
  onConfirmResell: (eventId: string, ticketId: string) => void;
}

const TicketResellDialog: React.FC<TicketResellDialogProps> = ({
  open = false,
  onOpenChange,
  ticketOwned = [],
  onConfirmResell,
}) => {
  const close = () => onOpenChange(false);

  return (
    <Dialog open={open} onClose={onOpenChange} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-md rounded-2xl bg-white p-6">
          <Dialog.Title className="text-2xl font-bold text-gray-900">
            Resell Tickets
          </Dialog.Title>

          <div className="mt-2">
            <p className="text-sm text-gray-500">
              Select the tickets you would like to put up for resale in the
              marketplace.
            </p>
          </div>

          <div className="mt-4 max-h-[60vh] overflow-y-auto pr-2">
            {ticketOwned.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 bg-gray-50 rounded-lg">
                <Ticket className="w-12 h-12 text-gray-400 mb-4" />
                <p className="text-lg font-medium text-gray-900">
                  No Tickets Available
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  You don't have any tickets to resell yet. Purchase tickets
                  first!
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {ticketOwned.map((ticket, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-indigo-50 rounded-lg">
                          <Ticket className="w-5 h-5 text-indigo-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            Ticket #{ticket.id}
                          </p>
                          <p className="text-sm text-gray-500">
                            Event ID: {ticket.eventId}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-semibold text-indigo-600">
                          {ticket.price} ICP
                        </p>
                      </div>
                    </div>

                    <div className="block w-full">
                      <CustomButton
                        onClick={() =>
                          onConfirmResell(ticket.eventId, ticket.id)
                        }
                        className="w-full py-2 px-4 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        Resale
                      </CustomButton>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default TicketResellDialog;
