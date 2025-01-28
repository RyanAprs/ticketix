import CustomButton from "../Button/CustomButton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./dialog";

const DeleteDialog = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Ticket</DialogTitle>
          <DialogDescription>
            Are you sure want to delete this ticket?
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4 flex justify-end gap-4">
          <CustomButton onClick={onClose} variant="secondary">
            Cancel
          </CustomButton>
          <CustomButton
            onClick={() => {
              console.log("Ticket deleted");
              onClose();
            }}
          >
            Confirm
          </CustomButton>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteDialog;
