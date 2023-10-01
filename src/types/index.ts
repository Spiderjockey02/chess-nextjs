export interface Player {
  id: string
  username: string
}

export interface joinRoomCallback extends Error, RoomData {}

export interface Error {
  error: boolean
  message: string
}


export interface RoomData {
  roomId: string
  players: Array<Player>
}