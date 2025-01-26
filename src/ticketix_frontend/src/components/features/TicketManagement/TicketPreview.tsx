import { MessageSquareIcon, ThumbsUpIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { TicketStatus } from "@/types";

interface TicketPreviewProps {
  title: string;
  description: string;
  imageUrl: string;
  price: number;
  owner: string;
  salesDeadline: number;
  total: number;
  isSold: boolean;
  status: TicketStatus;
  className?: string;
}

const TicketPreview = ({
  description,
  title,
  className,
}: TicketPreviewProps) => {
  return (
    <div
      className={cn(
        "min-w-[300px] max-w-md cursor-pointer rounded-lg border bg-offWhite text-subtext transition-all hover:shadow-hover",
        className
      )}
    >
      {/* <img
        src={thumbnail}
        alt={title}
        className="h-40 w-full rounded-t-lg bg-mainAccent object-cover"
      />
      <div className="p-4">
        <h2 className="text-lg font-semibold text-title">{title}</h2>
        <p className="text-sm text-caption">{description}</p>
        <p className="text-sm text-caption">{createdAt}</p>

        <div className="mt-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <ThumbsUpIcon className="size-5" />
              {likesCount}
            </div>
            <div className="flex items-center gap-1">
              <MessageSquareIcon className="size-5" />
              {commentsCount}
            </div>
          </div>
          <p className="bg- flex items-center rounded-lg border px-3 py-1 text-sm font-medium">
            {tier === "Free" ? "Free" : isUnlocked ? "Unlocked" : tier}
          </p>
        </div>
      </div> */}
    </div>
  );
};

export default TicketPreview;
