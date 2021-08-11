const repository = require('./repository');

exports.logError = function (correlationId, message, error) {
    let log = {
        correlationId: correlationId,
        createdOn: new Date().toUTCString(),
        correlationId: correlationId,
        logType: "ERROR",
        message: message,
        trace: error
    }
    repository.createDbLog(log);
}

exports.logAudit = function (correlationId, audit) {
    let log = {
        correlationId: correlationId,
        createdOn: new Date().toUTCString(),
        correlationId: correlationId,
        logType: "INFO",
        message: audit,
    }
    repository.createDbLog(log);

}
