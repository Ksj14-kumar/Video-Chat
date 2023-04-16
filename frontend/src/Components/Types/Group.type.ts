import { Socket } from "socket.io-client"

export type propType = {
    socket: Socket
}


export type initialTypeReducer = {
    localStream: null | MediaStream
    remoteStream: null | MediaStream
}
export type actionType = {
    type: "local" | "remote",
    payload: MediaStream | null
}


export const initialState: initialTypeReducer = {
    localStream: null,
    remoteStream: null
}
