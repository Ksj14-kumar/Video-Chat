import React, { useEffect } from 'react'
import { IoCall } from "react-icons/io5";
import { motion } from "framer-motion"
import ring from "../assets/tune.mp3"
type propType = {
    onCallPickUp: () => void,
    CallnotAccept: () => void,
    incomingCall: boolean
}
function IncomingCall({ onCallPickUp, CallnotAccept, incomingCall }: propType) {
    const audio = new Audio(ring);

    let timeoutId: number;
    useEffect(() => {
        const playAudio = () => {
            audio.play().then(() => {
            }).catch(error => {
            });
        };
        if (incomingCall) {
            timeoutId = setTimeout(() => {
                playAudio();
            }, 100);
        }
        else if(!incomingCall){
            clearTimeout(timeoutId);
            audio.pause();
        }
        return () => {
            clearTimeout(timeoutId);
            audio.pause();
        };
    }, [incomingCall]);
    return (
        <div className="incoming_wrapper fixed h-full w-full bg-gray-400 rounded-md bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-10  border-gray-100 w-screen h-screen z-[5] top-0">
            <div className="messagew_wrapper w-full h-full flex justify-center items-center flex-col gap-y-[3rem]">
                <motion.button className='text-lg font-serif rounded-full p-[1.8rem] bg-[#5ee907]'><IoCall className='text-[1.8rem] text-[#fff]'
                    onClick={onCallPickUp}
                /></motion.button>
                <motion.button className='text-lg font-serif rounded-full p-[1.8rem] bg-[#ef0404]'><IoCall className='text-[1.8rem] text-[#fff]' onClick={CallnotAccept} /></motion.button>
            </div>
        </div>
    )
}

export default React.memo(IncomingCall)