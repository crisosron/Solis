let GAME_ROOM_EVENTS = {
    REQUESTS: {
        LEAVE_GAME_ROOM: "leave-game-room",
        JOIN_GAME_ROOM: "join-game-room",
        UPDATE_STATE: "update-state",
        SELECT_COLOR_OPTION: "select-color-option",
        SEND_MESSAGE: "send-message"
    },

    RESPONSES: {
        PLAYER_JOINED: "player-joined",
        COLOR_OPTION_SELECTED: "color-option-selected",
        COLOR_OPTION_SELECTION_REJECTED: "color-option-selection-rejected",
        DISPLAY_MESSAGE: "display-message"
    },

}

module.exports = GAME_ROOM_EVENTS;