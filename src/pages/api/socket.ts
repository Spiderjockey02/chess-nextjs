// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { Player } from '@/types';
import type { NextApiRequest, NextApiResponse } from 'next';
import { Server } from 'Socket.IO';
import { v4 as uuidV4 } from 'uuid';

const rooms = new Map<string, {roomId: string, players: Array<Player>}>();
export default function SocketHandler(req: NextApiRequest, res: NextApiResponse) {
	if (res.socket.server.io) {
		console.log('Socket is already running');
	} else {
		console.log('Socket is initializing');
		const io = new Server(res.socket.server);
		res.socket.server.io = io;

		// A connection has been made
		io.on('connection', (socket) => {
			console.log('client connected', socket.id);

			// Someone has submitted a username tp be used
			socket.on('username', (username) => {
				console.log('username:', username);
				socket.data.username = username;
			});

			// A chess room has been created
			socket.on('createRoom', async (callback) => {
				const roomId = uuidV4();
				await socket.join(roomId);

				rooms.set(roomId, {
					roomId,
					players: [{ id: socket.id, username: socket.data?.username }],
				});

				callback(roomId);
			});

			// Someone has joined a chess room
			socket.on('joinRoom', async (args, callback) => {
				// check if room exists and has a player waiting
				const room = rooms.get(args.roomId);
				let error, message;

				if (!room) {
					error = true;
					message = 'room does not exist';
				} else if (room.players.length <= 0) {
					error = true;
					message = 'room is empty';
				} else if (room.players.length >= 2) {
					error = true;
					message = 'room is full';
				}

				if (error) {
					if (callback) callback({ error, message });
					return;
				}

				await socket.join(args.roomId);

				// add the joining user's data to the list of players in the room
				const roomUpdate = {
					...room,
					players: [
						...room.players,
						{ id: socket.id, username: socket.data?.username },
					],
				};

				rooms.set(args.roomId, roomUpdate);
				callback(roomUpdate);
				socket.to(args.roomId).emit('opponentJoined', roomUpdate);
			});

			// A move has been played on the chess board
			socket.on('move', (data) => {
				socket.to(data.room).emit('move', data.move);
			});

			// Someone has left/disconnected from the room
			socket.on('disconnect', () => {
				const gameRooms = Array.from(rooms.values());

				gameRooms.forEach((room) => {
					const userInRoom = room.players.find((player) => player.id === socket.id);

					if (userInRoom) {
						if (room.players.length < 2) {
							// if there's only 1 player in the room, close it and exit.
							rooms.delete(room.roomId);
							return;
						}

						socket.to(room.roomId).emit('playerDisconnected', userInRoom);
					}
				});
			});

			// Game has ended so cleanup data
			socket.on('closeRoom', async (data) => {
				socket.to(data.roomId).emit('closeRoom', data);

				const clientSockets = await io.in(data.roomId).fetchSockets();

				clientSockets.forEach((s) => {
					s.leave(data.roomId);
				});

				rooms.delete(data.roomId);
			});
		});
	}
	res.end();
}
