
const repository = require('./repository');
const logger = require('./logger');
const mailer = require('./mailer');



exports.dispatchIncident = function (correlationId, incident) {

    repository.getProgramCustomers(incident.program_id, (prog) => {
        let customers = prog.programCustomers;
        for (let x = 0; x < customers.length; x++) {

            let customer = customers[x];
            let sent = 0;
            let msg = 'Dear Voltan,\
            You have been dispatched as part of the Program "' + prog.name + ' "\
            Please have your full curtailment plan in effect between the hours\
            of ' + incident.start_time + " and " + incident.end_time;

            let dispItems = [];

            let dispatch = {

                incidentId: incident._id,
                programId: incident.program_id,
                programName: prog.name,
                customerId: customer._id,
                customerName: customer.name,
                message: msg,
                hasBeenSent: false,
                hasBeenAcknowledged: false,
                dispatchMeans: "",
                moreInfo: "",
                createdOn: new Date().toUTCString(),
            }


            if (customer.dispatchTypes) {


                for (let d = 0; d < customer.dispatchTypes.length; d++) {
                    dispType = customer.dispatchTypes[d];
                    if (dispType == 1) { // email

                        let dispatchOptions = {
                            to: customer.email,
                            subject: 'Dispatch from ' + dispatch.programName,
                            message: dispatch.message
                        };

                        mailer.sendEmail(dispatchOptions, (err, success) => {

                            if (err) {
                                // dispItems.push('ERROR : Could not send email to ' + customer.name + " on email address: " + customer.email);
                                // dispatch.dispatchMeans += "email - Failed,";
                                // dispatchOptions.error = 'ERROR : Could not send email to ' + customer.name + " on email address: " + customer.email;
                                // dispatchOptions.stack = err;
                                err.info = 'ERROR : Could not send email to ' + customer.name + " on email address: " + customer.email;
                                logger.logError(correlationId, err);

                            } else {
                                success.info = 'EMAIL DISPATCH SENT TO :' + customer.name + " on email: " + customer.email;
                                logger.logAudit(correlationId, success);

                            }

                        });

                        dispItems.push('EMAIL DISPATCH SENT TO :' + customer.name + " on email: " + customer.email);
                        sent++;

                    }

                    if (dispType == 2) { // Text
                        dispItems.push('TEXT MESSAGE: sent to :' + customer.name + " on phone number: " + customer.phone);
                        sent++;
                        dispatch.dispatchMeans += "Text, ";
                    }

                    if (dispType == 3) { // Broadcast
                        dispItems.push('Socket Broadcast Sent to : ' + customer.name);
                        dispatch.dispatchMeans += "Web Socket Broadcast, ";
                        sent++;
                    }

                }
            }
            let moreInfo = sent >= 0
                ? "Customer " + customer.name + ' has been informed about ' + prog.name
                : "NO WAY TO SEND DISPATCH TO CUSTOMER " + customer.name;

            dispatch.moreInfo = moreInfo;
            dispatch.dispatchItems = dispItems;
            dispatch.hasBeenSent = sent > 0;

            repository.createDispatch(correlationId, dispatch);

            let log = {
                datalogType: "dispatch",
                id: incident._id,
                data: moreInfo,
                dispatchItems: dispItems
            }

            logger.logAudit(correlationId, log);
        }
    });

}

