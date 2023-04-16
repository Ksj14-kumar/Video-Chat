import { Socket } from "socket.io-client"

export type propType = {
    VideoStream: null | MediaStream,
    self: boolean,
    callPickAlert?: boolean,
    outGoingCall: () => void,
    socket: Socket,
    onScreenshare:()=>void,
    onEnded?:()=>void
}
export type streamActionType = {
    type: "mic" | "video",
    payload: boolean
}