import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { PlusIcon } from "lucide-react";

import useWindowSize from "@/hooks/useWindowSize";
// import { fetchCreatorContentPreview } from "@/lib/services/contentService";
import { cn } from "@/lib/utils";
import { useAuthManager } from "@/store/AuthProvider";

// import { ContentPreview as ContentPreviewType } from "../../../../../declarations/nekotip_backend/nekotip_backend.did";

import TicketPreview from "./TicketPreview";
import CustomButton from "@/components/ui/Button/CustomButton";

const TicketManagement = () => {
  const { actor, principal } = useAuthManager();
  const { isMobile } = useWindowSize();

  // const [contents, setContents] = useState([] as ContentPreviewType[]);

  // useEffect(() => {
  //   if (actor && principal)
  //     fetchCreatorContentPreview(actor, principal, setContents);
  // }, [actor, principal]);

  return (
    <>
      <div className="flex flex-col gap-3 md:flex-row md:justify-between">
        <h1 className="text-2xl font-semibold text-title lg:text-3xl">
          Ticket Management
        </h1>
        <Link to={"/dashboard/ticket/post"}>
          <CustomButton
            variant="secondary"
            className="w-fit"
            icon={<PlusIcon className="mr-1 size-5" />}
            size={isMobile ? "small" : "default"}
          >
            Sale New Ticket
          </CustomButton>
        </Link>
      </div>
      <div>Ticket List</div>
      {/* <div
        className={cn(
          "mt-3 w-full rounded-lg border border-border p-3 shadow-custom md:px-5 md:py-4",
          contents.length === 0 &&
            "flex min-h-[200px] max-w-[600px] items-center justify-center md:min-h-[300px]"
        )}
      >
        {contents.length === 0 ? (
          <div className="mb-4 flex flex-col items-center space-y-3 text-subtext">
            <p className="text-center font-semibold md:text-lg">
              No content yet. Start creating your first exclusive post!
            </p>
          </div>
        ) : (
          <div className="flex flex-wrap gap-5">
            {contents.map((content) => (
              <Link key={content.id} to={`/creator/content/${content.id}`}>
                <TicketManagement
                  title={content.title}
                  description={content.description}
                  tier={getContentTierLabel(content.tier)}
                  thumbnail={content.thumbnail}
                  likesCount={content.likesCount.toString()}
                  commentsCount={content.commentsCount.toString()}
                  createdAt={formatNSToDate(content.createdAt)}
                />
              </Link>
            ))}
          </div>
        )}
      </div> */}
    </>
  );
};

export default TicketManagement;
