
//hellperfor GUID
exports.createUUID = function () {
   return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
   });
}

exports.createResponse = function (statusCode, message) {
   return {
      statusCode: status,
      message: message
   }
}

exports.createDbError = function (err) {

   const dbErr = {
      dbCode: err.code,
      codeName: err.codeName,
      message: err.message,
      stack: err.stack
   };

   let ErrStatus = {
      statusCode: 500,
      message: dbErr

   };

   return ErrStatus;

}


