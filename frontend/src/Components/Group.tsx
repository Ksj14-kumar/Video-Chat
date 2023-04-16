import React, { useEffect, useReducer, useRef, useState } from 'react'
import Video from './Video/Components/Video';
import { initialState, propType } from './Types/Group.type';
import { reducerHandler } from './ReducerHandler/Group.reducer';
import IncomingCall from './IncomingCall';
import { toast } from "react-hot-toast"

const streamOptionToGetMedia = { audio: true, video: true }
const displayMediaOptions = { audio: false, video: true }
const servers = {
    iceServers: [
        { urls: ['stun:stun.l.google.com:19302'] },
    ]
};

function Group({ socket }: propType) {
    const [streams, dispatch] = useReducer(reducerHandler, initialState)
    const [incomingCall, setIncomingCall] = useState<boolean>(false)
    const [callPickAlert, setCallPickState] = useState<boolean>(false)
    const _pc = useRef<RTCPeerConnection | null>(null)
    const candidateInfo = useRef<RTCIceCandidate[]>([])
    let pc: RTCPeerConnection;
    // TODO: Divide each user by room
    useEffect(() => {
        socket.on("offerAnswer", async({ sdp }: { sdp: RTCSessionDescription }) => {
            if (_pc.current?.signalingState !== "closed") {
            try {
                await _pc.current?.setRemoteDescription(new RTCSessionDescription(sdp))
                if (sdp.type === "offer") {
                    setIncomingCall(true)
                }
                if (sdp.type === "answer") {
                    setCallPickState(true)
                }
            } catch (err) {

            }
            }
        })
        socket.on("callNotPick", (data) => {
            if (data) {
                setIncomingCall(false)
            }
        })
        socket.on("onEnded", (data) => {
            setCallPickState(false)
            streams.remoteStream?.getTracks().forEach(track => {
                track.stop()
                dispatch({ type: "remote", payload: null })
                window.location.reload()
            })
        })

        socket.on("candidate", ({ candidate }: { candidate: RTCIceCandidate }) => {
            candidateInfo.current = [...candidateInfo.current, candidate]
        })

        //check broser support media devices
        if ("mediaDevices" in navigator && "getUserMedia" in navigator.mediaDevices) {
            // getLocalStream(pc)
            navigator.mediaDevices.getUserMedia(streamOptionToGetMedia)
                .then((stream) => {
                    dispatch({ type: "local", payload: stream })
                    stream.getTracks().forEach(track => {
                        pc.addTrack(track, stream)
                    })
                })
                .catch((err) => {
                    toast.error("camera already in use",)
                    console.log(err, "media not supported")
                })
            pc = new RTCPeerConnection(servers)
            pc.onicecandidate = (e) => {
                if (e.candidate) {
                    socket.emit("candidate", { candidate: e.candidate })
                }
            }
            pc.onconnectionstatechange = (e) => {
            }
            pc.oniceconnectionstatechange = (e) => {
                if (e.target) {
                    const state: RTCIceConnectionState = (e.target as RTCPeerConnection).iceConnectionState
                    switch (state) {
                        case "disconnected":
                            dispatch({ type: "remote", payload: null })
                            setCallPickState(false)
                            toast.success("Call ended", { position: "top-right", duration: 3000 })
                            candidateInfo.current = []
                            window.location.reload()

                        case "connected":

                        case "closed":
                        case "failed":
                            candidateInfo.current = []
                        case "new":
                        default:
                            state
                    }

                }
            }
            pc.ontrack = (e) => {
                dispatch({ type: "remote", payload: e.streams[0] })
            }
            _pc.current = pc
        }
        else{
            toast.error("your browser not supported media")
        }
        return () => {
            candidateInfo.current = []
        }
    }, [socket])
    useEffect(() => {
        //singaling state of RTC PeerConnection, which are closed, have-offer, have-answer, have-preannser
        if (_pc.current?.signalingState !== "closed") {
            candidateInfo.current.forEach((candidate) => {
                try {
                    _pc.current?.addIceCandidate(new RTCIceCandidate(candidate))
                } catch (err) {
                }
            })
        }
        if (_pc.current?.signalingState === "closed") {
            candidateInfo.current = []
        }
    }, [candidateInfo.current])
    function onCall() {
        if (_pc.current) {
            {
                _pc.current.createOffer({ offerToReceiveAudio: true, offerToReceiveVideo: true })
                    .then((sdp) => {
                        if (_pc.current) {
                            {
                                _pc.current.setLocalDescription(sdp)
                                socket.emit("offerAnswer", { sdp })
                            }
                        }
                    })
                    .catch((err) => {
                        console.log("not generate sdp info", err)
                    })
            }
        }
    }
    const onAnswer = () => {
        _pc.current?.createAnswer({ offerToReceiveAudio: true, offerToReceiveVideo: true })
            .then((sdp) => {
                _pc.current?.setLocalDescription(sdp)
                socket.emit("offerAnswer", { sdp })
            })
            .catch((err) => {
                console.log("anser not create", err)
            })
    }

    const onCallPickUp = () => {
        onAnswer()
        setCallPickState(true)
        setIncomingCall(false)
    }
    const outGoingCall = () => {
        onCall()
    }
    const CallnotAccept = () => {
        socket.emit("callReject", false)
        setIncomingCall(false)
    }
    const onEnded = () => {
        streams.remoteStream?.getTracks().forEach(track => {
            track.stop()
            _pc.current?.close()
            dispatch({ type: "remote", payload: null })
            setCallPickState(false)
            candidateInfo.current = []
        })
    }
    const onScreenshare = () => {
        navigator.mediaDevices.getDisplayMedia(displayMediaOptions)
            .then((shareStream) => {
                dispatch({ type: "local", payload: shareStream })
                shareStream.getTracks().forEach(track => {
                    pc.addTrack(track, shareStream)
                })
            })
            .catch((err) => {
                console.log("screen not share", err)
            })
    }
    return (
        <div className='bg-[#4f4c4c] w-full h-[calc(100vh-0rem)] md:py-2'>
            {incomingCall && <IncomingCall onCallPickUp={onCallPickUp} incomingCall={incomingCall} CallnotAccept={CallnotAccept} />}
            <div className="wrapper md:flex md:justify-center gap-x-0">
                <Video VideoStream={streams.localStream} callPickAlert={callPickAlert} self={true} outGoingCall={outGoingCall} socket={socket} onScreenshare={onScreenshare} onEnded={onEnded} />
                {streams.remoteStream && <div className="wrapper_localVideo">
                    <Video VideoStream={streams.remoteStream} self={false} callPickAlert={callPickAlert} outGoingCall={outGoingCall} onScreenshare={onScreenshare} socket={socket} />
                </div>}
            </div>
        </div>
    )
}

export default Group