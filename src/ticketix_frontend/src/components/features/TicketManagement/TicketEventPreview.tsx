import { EnhancedTicketType } from "@/pages/ticket/TicketPage";

interface TicketEventPreviewProps {
  tickets: EnhancedTicketType[];
}

const TicketEventPreview = ({ tickets }: TicketEventPreviewProps) => {
  return (
    <div className="container mx-auto px-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {tickets.map((ticket, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow"
          >
            <div className="flex flex-col space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center">
                    <span className="text-indigo-600 text-lg font-semibold">
                      {ticket.totalTickets}
                    </span>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 truncate max-w-[120px] sm:max-w-[160px]">
                      Owner: {ticket.ownerUsername}
                    </p>
                  </div>
                </div>
              </div>

              <div className="text-left">
                <p className="text-lg font-semibold text-indigo-600">
                  {ticket.price} ICP
                </p>
                <p className="text-sm text-gray-500">
                  Total Value: {ticket.price} ICP
                </p>
              </div>

              <div className="flex flex-col space-y-3 pt-4 border-t border-gray-100">
                <div className="flex flex-wrap gap-2">
                  <span className="px-2 py-1 text-xs font-medium text-indigo-600 bg-indigo-100 rounded-full">
                    Available: {ticket.totalTickets}
                  </span>
                  <span className="px-2 py-1 text-xs font-medium text-green-600 bg-green-100 rounded-full">
                    Active
                  </span>
                </div>
                <button className="w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                  Buy Tickets
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TicketEventPreview;
