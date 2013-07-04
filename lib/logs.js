var extend = require("./extend");
var ClientMethods = require("./client-methods");

module.exports = Logs;

function Logs(client, actor) {
  this.initialize(client, actor);

  this.on("consoleAPICall", this.onConsoleAPI.bind(this));
  this.on("pageError", this.onPageError.bind(this));
}

Logs.prototype = extend(ClientMethods, {
  types: ["PageError", "ConsoleAPI"],

  startLogging: function(callback) {
    this.request('startListeners', { listeners: this.types }, callback);
  },

  stopLogging: function(callback) {
    this.request('stopListeners', { listeners: this.types }, callback);
  },

  onConsoleAPI: function(event) {
    this.emit("console-api-call", event.message);
  },

  onPageError: function(event) {
    this.emit("page-error", event.pageError);
  },

  getCachedLogs: function(callback) {
    var message = {
      messageTypes: this.types
    };
    this.request('getCachedMessages', message, callback, 'messages');
  },

  clearCachedLogs: function(callback) {
    this.request('clearMessagesCache', callback);
  }
})