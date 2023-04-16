import React, { useEffect, useRef, useState, useReducer, useCallback } from 'react'
import VideoController from './VideoController'
import { propType } from './types/video.type'
import { streamReducerHandler } from './ReducerHandler/Video.Reducer'
function Video({ VideoStream, self, callPickAlert, outGoingCall, socket, onScreenshare, onEnded }: propType) {
    const videoStreamRef = useRef<HTMLVideoElement>(null)
    const [streamController, dispatchStreamController] = useReducer(streamReducerHandler, { mic: true, video: true })
    useEffect(() => {
        if (self && !callPickAlert) {
            VideoStream?.getAudioTracks().forEach(track => track.enabled = false)
        }
        if (self && callPickAlert) {
            VideoStream?.getAudioTracks().forEach(track => track.enabled = true)
        }
        if (videoStreamRef.current) {
            videoStreamRef.current.srcObject = VideoStream
        }
        return ()=>{
            dispatchStreamController({type:"mic",payload:true})
            dispatchStreamController({type:"video",payload:true})
        }
    }, [VideoStream, callPickAlert,self])
    const onMicEnabled = () => {
        VideoStream?.getAudioTracks().forEach(track => track.enabled = !track.enabled)
        dispatchStreamController({ type: "mic", payload: !streamController.mic })
    }

    const onVideoEnabled = () => {
        VideoStream?.getVideoTracks().forEach(track => track.enabled = !track.enabled)
        dispatchStreamController({ type: "video", payload: !streamController.video })
    }

    return (
        <div className={`wrapperVideo relative  bg-red-600 ${self ? "rounded-l-md rounded-r-none" : "rounded-r-md"}`}>
            <video src="" ref={videoStreamRef} autoPlay className={`md:w-[32rem] md:h-[270px]  w-[16rem]  h-[250px] ${self ? "md:rounded-l-md" : "md:rounded-r-md"} rounded-br-none rounded-tr-none w-full flex-shrink-0 shrink-0 h-[50vh] object-cover  ${self ? "mobile:fixed mobile1:rounded-md z-[3] mobile:w-[20rem] mobile:right-1 mobile:h-[16rem] mobile:rounded-md mobile2:border-[1px] mobile2:border-neutral-800 mobile1:w-[14rem] mobile1:right-2 mobile1:fixed mobile1:h-[17rem] mobile1:drop-shadow-md mobile1:top-4" : "mobile2:h-[calc(100vh-.1rem)]"}
            `}></video>
            {(VideoStream && self) && <VideoController callPickAlert={callPickAlert} onMicEnabled={onMicEnabled} onVideoEnabled={onVideoEnabled} streamController={streamController} onEnded={onEnded} outGoingCall={outGoingCall} socket={socket} onScreenshare={onScreenshare} />}
        </div>
    )
}
export default Video
