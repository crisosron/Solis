let GAME_ROOM_EVENTS = {
    REQUESTS: {
        LEAVE_GAME_ROOM: 1,
        JOIN_GAME_ROOM: 2
    },

    RESPONSES: {
        PLAYER_JOINED: 3,
        PLAYER_CHANGED_USER_NAME: 4,
        PLAYER_CHANGED_COLOR: 5
    }
}

module.exports = GAME_ROOM_EVENTS;