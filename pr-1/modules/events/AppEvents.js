/**
 * Shared application-wide EventEmitter instance.
 * Used to emit and listen to domain events (students, backup, etc.).
 */

const EventEmitter = require("events");
class AppEvents extends EventEmitter {}
module.exports = new AppEvents();
