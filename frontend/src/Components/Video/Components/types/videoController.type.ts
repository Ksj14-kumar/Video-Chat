import { Socket } from "socket.io-client";

export type propType = {
    onMicEnabled: () => void,
    onVideoEnabled: () => void,
    streamController: {
        mic: boolean;
        video: boolean;
    },
    onEnded?: () => void,
    callPickAlert?: boolean,
    outGoingCall: () => void,
    socket: Socket,
    onScreenshare: () => void,
}