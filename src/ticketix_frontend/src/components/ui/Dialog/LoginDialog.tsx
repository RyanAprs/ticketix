import { useAuthManager } from "@/store/AuthProvider";
import CustomButton from "../Button/CustomButton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./dialog";

const LoginDialog = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const { login } = useAuthManager();
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Login</DialogTitle>
          <DialogDescription>
            You must login to purchase tickets{" "}
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4 flex justify-end gap-4">
          <CustomButton
            className="rounded-full bg-mainAccent text-white"
            onClick={() => login()}
          >
            Login
          </CustomButton>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LoginDialog;
