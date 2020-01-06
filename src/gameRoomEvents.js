let GAME_ROOM_EVENTS = {
    REQUESTS: {
        LEAVE_GAME_ROOM: "leave-game-room",
        JOIN_GAME_ROOM: "join-game-room",
        UPDATE_STATE: "update-state",
        SELECT_COLOR_OPTION: "select-color-option",
        SEND_MESSAGE: "send-message",
        READY_UP: "ready-up",
        REDIRECT_ALL_CLIENTS_TO_GAME: "redirect-all-clients-to-game"
    },

    RESPONSES: {
        PLAYER_JOINED: "player-joined",
        COLOR_OPTION_SELECTED: "color-option-selected",
        COLOR_OPTION_SELECTION_REJECTED: "color-option-selection-rejected",
        DISPLAY_MESSAGE: "display-message",
        READY_UP_CONFIRMED: "ready-up-confirmed",
        UPDATE_READY_COUNT: "increment-ready-count",
        SET_CLIENT_HAS_SELECTED_COLOR: "set-client-has-selected-color",
        PLAYER_LEFT: "player-left",
        PROCESS_CLIENT_REDIRECTION_TO_GAME: "process-client-redirection-to-game"
    },
}

module.exports = GAME_ROOM_EVENTS;