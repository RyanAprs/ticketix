import CustomButton from "@/components/ui/Button/CustomButton";
import { TicketStatusInterface } from "@/types";
import { Calendar, Tag, User, Ticket } from "lucide-react";

interface TicketType {
  id: string;
  owner: string;
  status: TicketStatusInterface;
  price: number;
}

interface EventDetailPreviewProps {
  title: string;
  description: string;
  imageUrl: string;
  // price: number;
  salesDeadline: string;
  total: number;
  owner: string;
  ticket: TicketType[];
  className?: string;
}

const EventDetailPreview = ({
  title,
  description,
  imageUrl,
  // price,
  owner,
  salesDeadline,
  total,
  ticket,
}: EventDetailPreviewProps) => {
  const handleBuy = () => {
    if (ticket) {
      console.log(ticket[0].id);
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-4">
      <div className="overflow-hidden rounded-xl bg-white shadow-lg">
        {/* Hero Section */}
        <div className="relative h-96">
          <img
            src={imageUrl}
            alt={title}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-0 left-0 p-8">
            <h1 className="text-4xl font-bold text-white">{title}</h1>
            <div className="mt-4 flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-white">
                <User className="h-5 w-5" />
                <span>{owner}</span>
              </div>
              <div className="flex items-center space-x-2 text-white">
                <Tag className="h-5 w-5" />
                {/* <span>{price} ICP</span> */}
              </div>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="grid grid-cols-1 gap-8 p-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <section className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  About This Event
                </h2>
                <p className="mt-4 text-gray-600 leading-relaxed">
                  {description}
                </p>
              </div>

              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-gray-900">
                  Event Details
                </h2>
                <div className="rounded-lg bg-gray-50 p-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="flex items-center space-x-3">
                      <Calendar className="h-6 w-6 text-blue-600" />
                      <div>
                        <p className="text-sm text-gray-500">Sales Deadline</p>
                        <p className="font-medium text-gray-900">
                          {salesDeadline}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Ticket className="h-6 w-6 text-blue-600" />
                      <div>
                        <p className="text-sm text-gray-500">
                          Available Tickets
                        </p>
                        <p className="font-medium text-gray-900">{total}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 rounded-lg border bg-white p-6 shadow-sm">
              <div className="mb-6">
                {/* <p className="text-3xl font-bold text-gray-900">{price} ICP</p> */}
                <p className="text-sm text-gray-500">per ticket</p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Available Tickets</span>
                  <span className="font-medium text-gray-900">{total}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Sales End</span>
                  <span className="font-medium text-gray-900">
                    {salesDeadline}
                  </span>
                </div>
              </div>

              <CustomButton
                onClick={handleBuy}
                className="mt-6 w-full rounded-lg bg-blue-600 px-4 py-3 text-center font-semibold text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Buy Ticket
              </CustomButton>

              <p className="mt-4 text-center text-sm text-gray-500">
                Secure checkout powered by Internet Computer
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetailPreview;
