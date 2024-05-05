import { io } from "socket.io-client";
//TODO move in configuration?
const URL = "http://localhost:3000";
export const socket = io(URL);