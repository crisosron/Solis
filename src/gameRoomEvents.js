let GAME_ROOM_EVENTS = {
    REQUESTS: {
        LEAVE_GAME_ROOM: {
            eventMessage: "leave-game-room"
        },

        JOIN_GAME_ROOM: {
            eventMessage: "join-game-room"
        },
    },

    RESPONSES: {
        PLAYER_JOINED: {
            eventMessage: "player-joined"
        },

        PLAYER_CHANGED_USER_NAME: {
            eventMessage: "player-changed-user-name"
        },

        PLAYER_CHANGED_COLOR: {
            eventMessage: "player-changed-color"
        }
    }
}

module.exports = GAME_ROOM_EVENTS;