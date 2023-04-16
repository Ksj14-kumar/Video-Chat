import { actionType, initialState } from "../Types/Group.type"

export const reducerHandler = (state: typeof initialState, action: actionType) => {
    switch (action.type) {
        case "local":
            return {
                ...state,
                localStream: action.payload
            }
        case "remote":
            return {
                ...state,
                remoteStream: action.payload
            }

        default:
            return state
    }

}
