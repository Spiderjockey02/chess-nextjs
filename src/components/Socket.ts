import { io } from "socket.io-client";
fetch('http://localhost:3000/api/socket');
const socket = io();
export default socket;