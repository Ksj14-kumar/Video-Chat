import { streamActionType } from "../types/video.type"

export const streamReducerHandler = (state: { mic: boolean, video: boolean }, action: streamActionType) => {
    switch (action.type) {
        case "mic":
            return {
                ...state,
                mic: action.payload
            }
        case "video":
            return {
                ...state,
                video: action.payload
            }
        default:
            return state
    }

}