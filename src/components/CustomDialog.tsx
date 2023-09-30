import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

interface Props {
  open: boolean
  children?: any
  title: string
  contentText: string
  handleContinue: () => void;
}


export default function CustomDialog({ open, children, title, contentText, handleContinue }: Props) {
  return (
    <Dialog open={open}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText> 
          {contentText}
        </DialogContentText>
        {children}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleContinue}>Continue</Button>
      </DialogActions>
    </Dialog>
  );
}