import { Button, Stack, TextField } from '@mui/material';
import { useState } from 'react';
import CustomDialog from './CustomDialog';
import socket from '../components/Socket';
import type { joinRoomCallback, Player } from '@/types';

interface Props {
  setRoom: (r: string) => void;
  setOrientation: (or: 'w' | 'b') => void;
  setPlayers: (p: Array<Player>) => void;
}

export default function InitGame({ setRoom, setOrientation, setPlayers }: Props) {
	const [roomDialogOpen, setRoomDialogOpen] = useState(false);
	const [roomInput, setRoomInput] = useState('');
	const [roomError, setRoomError] = useState('');

	return (
		<Stack justifyContent="center" alignItems="center" sx={{ py: 1, height: '100vh' }}>
			<CustomDialog open={roomDialogOpen} handleClose={() => setRoomDialogOpen(false)} title="Select Room to Join" contentText="Enter a valid room ID to join the room" handleContinue={() => {
				// join a room
				if (!roomInput) return;
				socket.emit('joinRoom', { roomId: roomInput }, (r: joinRoomCallback) => {
					if (r.error) return setRoomError(r.message);
					setRoom(r?.roomId);
					setPlayers(r?.players);
					setOrientation('b');
					setRoomDialogOpen(false);
				});
			}}>
				<TextField
					autoFocus
					margin="dense"
					id="room"
					label="Room ID"
					name="room"
					value={roomInput}
					required
					onChange={(e) => setRoomInput(e.target.value)}
					type="text"
					fullWidth
					variant="standard"
					error={Boolean(roomError)}
					helperText={!roomError ? 'Enter a room ID' : `Invalid room ID: ${roomError}` }
				/>
			</CustomDialog>
			<Button variant="contained" onClick={() => {
				socket.emit('createRoom', (r: string) => {
					setRoom(r);
					setOrientation('w');
				});
			}}>
        Start a game
			</Button>
			<Button onClick={() => setRoomDialogOpen(true) }>
        Join a game
			</Button>
		</Stack>
	);
}