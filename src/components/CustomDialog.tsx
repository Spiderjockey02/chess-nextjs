import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import type { ReactNode } from 'react';

interface Props {
  open: boolean;
  children?: ReactNode;
  title: string;
  contentText: string;
  handleContinue: () => void;
	handleClose?: () => void;
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