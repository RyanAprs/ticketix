import { MessageSquareIcon, ThumbsUpIcon } from "lucide-react";

import { cn } from "@/lib/utils/cn";

interface TicketPreviewProps {
  title: string;
  description: string;
  imageUrl: string;
  price: number;
  owner: string;
  salesDeadline: number;
  total: number;
  isSold: boolean;
  className?: string;
}

const TicketPreview = ({
  title,
  description,
  imageUrl,
  price,
  owner,
  salesDeadline,
  total,
  className,
}: TicketPreviewProps) => {
  return (
    <div
      className={cn(
        "min-w-[300px] max-w-md cursor-pointer rounded-lg border bg-offWhite text-subtext transition-all hover:shadow-hover",
        className
      )}
    >
      <img
        src={imageUrl}
        alt={title}
        className="h-40 w-full rounded-t-lg bg-mainAccent object-cover"
      />
      <div className="p-4">
        <h2 className="text-lg font-semibold text-title">{title}</h2>
        <p className="text-sm text-caption">{description}</p>
        <p className="text-sm text-caption">{owner}</p>
        <p className="text-sm text-caption">{price}</p>
        <p className="text-sm text-caption">Available until {salesDeadline}</p>
        <p className="text-sm text-caption">{total}</p>
      </div>
    </div>
  );
};

export default TicketPreview;
