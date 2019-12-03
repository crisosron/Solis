let GAME_ROOM_EVENTS = {
    REQUESTS: {
        LEAVE_GAME_ROOM: "leave-game-room",
        JOIN_GAME_ROOM: "join-game-room",
        UPDATE_STATE: "update-state"
    },

    RESPONSES: {
        PLAYER_JOINED: "player-joined",
        PLAYER_CHANGED_USER_NAME: "player-changed-user-name",
        PLAYER_CHANGED_COLOR: "player-changed-color",
        RENDER_WITH_NEW_STATE: "render-with-new-state"
    },

}

module.exports = GAME_ROOM_EVENTS;