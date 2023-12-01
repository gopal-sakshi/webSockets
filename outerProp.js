var laisChat = {
    socketInstance: {val: 'old23'},
    checkSession: function (details, aOptions) {
        this.socketInstance = connectWs(aOptions);
    },
    orgId: '',
    custDetails: {},
    custChat: function (message) {

    }
}

function connectWs(blah) {
    return { jing:'JC' };
}
laisChat.checkSession({}, {});
console.log(laisChat.socketInstance);