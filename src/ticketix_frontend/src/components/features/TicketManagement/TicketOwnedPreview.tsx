import { cn } from "@/lib/utils/cn";
import CustomButton from "@/components/ui/Button/CustomButton";
import { Link } from "react-router-dom";

interface TicketOwnedPreviewProps {
  id: string;
  title: string;
  imageUrl: string;
  price: number;
  total: number;
  salesDeadline: string;
  className?: string;
}

const TicketOwnedPreview = ({
  id,
  title,
  imageUrl,
  price,
  salesDeadline,
  total,
  className,
}: TicketOwnedPreviewProps) => {
  const handleBuyTicket = () => {
    console.log("buy ticket");
  };
  return (
    <div
      className={cn(
        "min-w-[300px] max-w-md cursor-pointer border bg-offWhite text-subtext transition-all hover:shadow-hover",
        className
      )}
    >
      <Link to={`/ticket/${id}`}>
        <img
          src={imageUrl}
          alt={title}
          className="h-40 w-full bg-mainAccent object-cover"
        />
        <div className="p-4">
          <h2 className="text-xl font-bold text-title">{title}</h2>
          <p className="text-lg font-semibold text-caption">{price} ICP</p>
          <p className="text-lg font-semibold text-caption">{total} left</p>
        </div>
      </Link>
      <div className="p-4 flex justify-between items-center">
        <h2>Available until {salesDeadline}</h2>
        <CustomButton
          onClick={handleBuyTicket}
          className="w-full bg-mainAccent text-subtext py-2 hover:bg-mainAccentDark transition duration-200"
        >
          Buy Ticket
        </CustomButton>
      </div>
    </div>
  );
};

export default TicketOwnedPreview;
