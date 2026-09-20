import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import CustomButton from "./button";

const CustomModal = ({
  open,
  onClose,
  title,
  children,
  loading = false,
}) => {
  return (
    <Dialog
      open={open}
      onClose={loading ? undefined : onClose}
      fullWidth
      maxWidth="md"
    >
      <DialogTitle>{title}</DialogTitle>

      <DialogContent dividers>
        {children}
      </DialogContent>

      
    </Dialog>
  );
};

export default CustomModal;