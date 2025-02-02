import CustomButton from "@/components/ui/Button/CustomButton";
import { TicketStatusInterface } from "@/types";
import {
  Calendar,
  User,
  Ticket,
  CheckCircle,
  Clock,
  ChevronRight,
} from "lucide-react";
import { Link } from "react-router-dom";

interface TicketType {
  id: string;
  owner: string;
  status: TicketStatusInterface;
  price: number;
}

interface EventDetailPreviewProps {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  salesDeadline: string;
  total: number;
  owner: string;
  ticket: TicketType[];
  status: string;
  className?: string;
}

const EventDetailPreview = ({
  id,
  title,
  description,
  imageUrl,
  owner,
  salesDeadline,
  total,
  status,
}: EventDetailPreviewProps) => {
  return (
    <div className="mx-auto max-w-6xl px-4 mt-20">
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
                {status === "upComing" ? <Clock /> : <CheckCircle />}
                <span>{status}</span>
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
          <div className="w-full flex justify-center items-end">
            <Link to={`/event/${id}/ticket`}>
              <CustomButton className="mt-6 w-full rounded-lg bg-blue-600 px-4 py-3 text-center font-semibold text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                Check Ticket
                <ChevronRight />
              </CustomButton>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetailPreview;
