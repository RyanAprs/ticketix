import { cn } from "@/lib/utils/cn";
import CustomButton from "@/components/ui/Button/CustomButton";
import { Link } from "react-router-dom";
import { Calendar, Ticket } from "lucide-react";
import { useState } from "react";
import DeleteDialog from "@/components/ui/Dialog/DeleteDialog";

interface TicketOwnedPreviewProps {
  id: string;
  title: string;
  imageUrl: string;
  price: number;
  salesDeadline: string;
  total: number;
  className?: string;
}

const TicketOwnedPreview = ({
  id,
  title,
  imageUrl,
price,
  total,
  salesDeadline,
  className,
}: TicketOwnedPreviewProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleDeleteClick = () => {
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  return (
    <div
      className={cn(
        "min-w-[300px] max-w-md cursor-pointer border bg-offWhite text-subtext transition-all hover:shadow-hover",
        className
      )}
    >
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <img src={imageUrl} alt={title} className="h-48 w-full object-cover" />
        <div className="absolute bottom-0 p-4">
          <h2 className="text-xl font-bold text-white">{title}</h2>
        </div>
      </div>

      <div className="space-y-4 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Ticket className="h-5 w-5 text-blue-600" />
            <span className="text-sm text-gray-600">{total} tickets left</span>
          </div>
          <p className="text-lg font-bold text-blue-600">{price} ICP</p>
        </div>

        <div className="flex items-center space-x-2 text-gray-500">
          <Calendar className="h-5 w-5" />
          <p className="text-sm">Available until {salesDeadline}</p>
        </div>

        <div className="mt-5 flex items-center justify-center gap-6 md:mt-9 md:gap-10">
          <CustomButton
            onClick={() => console.log("Edit")}
            variant={"secondary"}
          >
            Edit
          </CustomButton>

          <CustomButton onClick={handleDeleteClick}>Delete</CustomButton>
        </div>
      </div>

      <DeleteDialog isOpen={isDialogOpen} onClose={handleCloseDialog} />
    </div>
  );
};

export default TicketOwnedPreview;
