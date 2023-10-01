import { useState, useCallback, useEffect } from 'react';
import { Container, TextField } from '@mui/material';
import { Game, socket, CustomDialog, InitGame } from '@/components';
import type { Player } from '@/types';

export default function Home() {
	const [username, setUsername] = useState<string>('');
	const [usernameSubmitted, setUsernameSubmitted] = useState<boolean>(false);

	const [room, setRoom] = useState<string>('');
	const [orientation, setOrientation] = useState<'w' | 'b'>('w');
	const [players, setPlayers] = useState<Array<Player>>([]);

	const cleanup = useCallback(() => {
		setRoom('');
		setOrientation('w');
		setPlayers([]);
	}, []);

	useEffect(() => {
		socket.on('opponentJoined', (roomData) => {
			setPlayers(roomData.players);
		});
	}, []);

	return (
		<Container>
			<CustomDialog
				open={!usernameSubmitted}
				handleClose={() => setUsernameSubmitted(true)}
				title="Pick a username"
				contentText="Please select a username"
				handleContinue={() => {
					if (!username) return;
					socket.emit('username', username);
					setUsernameSubmitted(true);
				}}
			>
				<TextField autoFocus margin="dense" id="username"	label="Username"	name="username"	value={username}	required	onChange={(e) => setUsername(e.target.value)}	type="text"	fullWidth	variant="standard"/>
			</CustomDialog>
			{
				room ? <Game room={room} orientation={orientation} players={players} cleanup={cleanup} /> : <InitGame setRoom={setRoom} setOrientation={setOrientation} setPlayers={setPlayers} />
			}
		</Container>
	);
}
