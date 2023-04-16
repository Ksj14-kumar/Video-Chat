import React, { useEffect, useState } from 'react'
import { BsFillMicFill, BsFillMicMuteFill } from "react-icons/bs"
import { IoVideocam, IoVideocamOff } from "react-icons/io5"
import { MdCallEnd, MdOutlineScreenShare } from "react-icons/md"
import { IoMdCall } from "react-icons/io"
import { propType } from './types/videoController.type'
function VideoController({ streamController, onMicEnabled, onVideoEnabled, onEnded, callPickAlert, outGoingCall, socket, onScreenshare }: propType) {
    const [onCallAlertMode, setOnCallAlertMode] = useState<boolean>(false)
    useEffect(() => {
        socket?.on("callReject", (data) => {
            setOnCallAlertMode(false)
        })
        if (!callPickAlert) {
            setOnCallAlertMode(false)
        }
        return () => {
            socket?.off("callReject")
            
        }
    }, [socket, callPickAlert])
    return (
        <div className={`controller absolute md:bottom-[1rem] md:left-[40%] z-[4]  ${callPickAlert ? "bottom-[1rem]  mobile1:top-[14.3rem] mobile:top-[13rem] mobile2:right-[11%]" : "mobile1:top-[14.3rem] mobile2:right-[25%] mobile:top-[12.9rem]"}  flex gap-x-2`}>
            {callPickAlert ?
                <>
                    <div className="mic"
                        onClick={onMicEnabled}
                        role="button"
                    >
                        {streamController.mic ?
                            <button className="bg-[#D21312] rounded-full p-3 mobile2:p-2"><BsFillMicFill className='text-xl mobile2:text-[1rem] text-[#fff]' /></button> :
                            <button className="bg-[#D21312] rounded-full p-3 mobile2:p-2"><BsFillMicMuteFill className='text-xl mobile2:text-[1rem] text-[#fff]' /></button>
                        }
                    </div>
                    <div className="video"
                        onClick={onVideoEnabled}
                        role="button"
                    >
                        {
                            streamController.video ?
                                <button className="bg-[#D21312] rounded-full p-3 mobile2:p-2"><IoVideocam className='text-xl text-[#fff] mobile2:text-[1rem]' /></button> :
                                <button className="bg-[#D21312] rounded-full p-3 mobile2:p-2"><IoVideocamOff className='text-xl text-[#fff] mobile2:text-[1rem]' /></button>
                        }
                    </div>
                    <div className="share screen"
                        onClick={onScreenshare}>
                        <button className='bg-[#D21312] rounded-full p-3 mobile2:p-2'><MdOutlineScreenShare className='text-[1.26rem] text-[#fff] mobile2:text-[1rem]' /></button>
                    </div>
                    <div className="disconnect"
                        onClick={onEnded}
                    >
                        <button className='bg-[#D21312] rounded-full p-3 mobile2:p-2'><MdCallEnd className='text-xl text-[#fff] mobile2:text-[1rem]' /></button>
                    </div>
                </> :
                <div className="outgoingCall">
                    {onCallAlertMode ?
                        <p className='text-lg font-serif text-[1.5rem] text-white tracking-wider'>calling...</p>
                        : <button onClick={() => {
                            const timeout = setTimeout(() => {
                                outGoingCall()
                            }, 500)
                            setTimeout(() => {
                                clearTimeout(timeout)
                                socket?.emit("callNotPick", true)
                                setOnCallAlertMode(false)
                            }, 30000)
                            setOnCallAlertMode(true)
                        }} className='bg-[#07db0e] rounded-full p-3'>
                            <IoMdCall className='text-xl text-[#fff]' />
                        </button>}
                </div>
            }
        </div>
    )
}

export default VideoController