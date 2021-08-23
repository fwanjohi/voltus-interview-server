# Voltus Dispatcher Interview

## Overview
I created two projects to demonstrate the workings of my solution
Infrastructure:

-	Angular UI.
-	Node.js Server.
-	MongoDB No Sql DB.
-	**DB Connection String:** mongodb+srv://admin:fxiAdmin8522@fxicluster.uh3gu.mongodb.net/.
-	I am using MongoDB Compass as a client
-	**Github Server Code:** https://github.com/fwanjohi/voltus-interview-server.git
-	**Github UI Code:** https://github.com/fwanjohi/voltus-interview-ui.git
-	**Deployed Server code to:** https://fxi-voltus-interview-server.azurewebsites.net
-	Server code can also be ran locally at :http:// localhost:3000
-	Client code has **NOT** been deployed, but can be ran at : http://localhost:4200

## Setup Steps
### Server : (local)
-	Clone the repo: https://github.com/fwanjohi/voltus-interview-server.git to your local machine (eg to c:\festus-voltus-server)
```	
cd c:\festus-voltus-server 
node index.js
```
-	To use the deployed server type open your browser and type :
``` 
https://fxi-voltus-interview-server.azurewebsites.net/ 
```
-  You shou see :  
- ** Fx-Voltus Dispather Server Running OK...at 172.16.1.2:8080 (or something similar) **

### UI (localhost or deployed)
-	The UI was created using Angular. Reason : Quickest way for me to do a POC.
-	Clone the https://github.com/fwanjohi/voltus-interview-ui.git to your local machine (eg to c:\festus-voltus-ui)
-	NOTE: I was not able to deploy the UI Client to the cloud
-	cd c:\festus-voltus- ui and run the following commands (this is an angular program, so make sure you have all thenpre-requisites)
```
npm install
ng build
ng serve
```
-	go to your browser and open http://localhost:4200
-	If you want to connect to the deployed server:
    - Edit the file : environment.ts
    - Change production = true (for deployed) or production = false (localhost)
	```
    export const environment = {
	  production: true,
	  SOCKET_ENDPOINT_PROD: 'https://fxi-voltus-interview-server.azurewebsites.net',
	  SOCKET_ENDPOINT_DEV: 'http://localhost',
	  PORT: 3000
	};
    ```
## Implementation
### Server 
-	The API server is created in Node.js (used this for simplicity + learning), but it is just a CRUD server that can be implemented in any language.
-	Index.js is the main entry point
-	Also, implemented **Socket.io** for realtime updates.

#### Methods (REST API)
```
GET /customer/:id
```
-	Returns a customer by

```
GET /config (This is only for internal use to use with external tools like Post Man)
```
-	Returns the endpoint configuration as a json 
```
	{
	    "Wi-Fi": [
	        "192.168.0.114"
	    ],
	    "vEthernet (WSL)": [
	        "172.31.128.1"
	    ],
	    "ip": "172.31.128.1",
	    "port": "3000"
	}
```
```
GET /program/:id/customers
	// Eg : http://localhost:3000/program/customer?pid=5
```

-   Returns : all customers under a particular Voltus Program as json
```
	http://localhost:3000/program/5/customer
	{
	    "_id": 5,
	    "name": "Funny Games Power Saver",
	    "programCustomers": [
	        {
	            "_id": 8,
	            "name": "Customer - no dipatch",
	            "address": "Highway 71",
	            "phone": "+16173086055",
	            "email": "fwanjohi@gmail.com",
	            "programId": 5,
	            "dispatchTypes": []
	        }
	    ]
	}
```

```
GET /dispatch/customer/:id
	//Eg : http://localhost:3000/dispatch/customer/2
```
-   Returns : all  dispatches for a customer, **whether acknowledged or not**
```
	[
	    {
	        "_id": "8e416ba1-596c-4ea9-b4f8-9bed08429630",
	        "incidentId": "9224ea02-6398-445d-844d-deefa0692993",
	        "programId": 5,
	        "programName": "Funny Games Power Saver",
	        "customerId": 8,
	        "customerName": "Customer - no dipatch",
	        "message": "Dear Voltan,            You have been dispatched as part of the Program \"Funny Games Power Saver \"            Please have your full curtailment plan in effect between the hours            of 08/27/2019 21:00 and 08/27/2019 22:00",
	        "hasBeenSent": false,
	        "hasBeenAcknowledged": true,
	        "dispatchMeans": "",
	        "moreInfo": "NO WAY TO SEND DISPATCH TO CUSTOMER Customer - no dipatch",
	        "createdOn": "Fri, 13 Aug 2021 09:53:45 GMT",
	        "acknowledgeOn": "Fri, 13 Aug 2021 09:54:42 GMT",
	        "acknowledgebBy": "me"
	    },
	    {
	        "_id": "ddb8c35d-b9ac-47a9-9ff9-c8f9407f264a",
	        "incidentId": "2ad9c147-68f0-4d6d-9e2d-eecc9beb0863",
	        "programId": 5,
	        "programName": "Funny Games Power Saver",
	        "customerId": 8,
	        "customerName": "Customer - no dipatch",
	        "message": "Dear Voltan,            You have been dispatched as part of the Program \"Funny Games Power Saver \"            Please have your full curtailment plan in effect between the hours            of 08/27/2019 21:00 and 08/27/2019 22:00",
	        "hasBeenSent": false,
	        "hasBeenAcknowledged": false,
	        "dispatchMeans": "",
	        "moreInfo": "NO WAY TO SEND DISPATCH TO CUSTOMER Customer - no dipatch",
	        "createdOn": "Fri, 13 Aug 2021 09:53:50 GMT",
	        "acknowledgeOn": "Fri, 13 Aug 2021 09:54:30 GMT",
	        "acknowledgebBy": "me"
	    }
	]
```


```
GET /dispatch/customer/:id/:ack
	//Eg : http://localhost:3000/dispatch/customer/2/true
```
-   Returns : all  dispatches for a customer **where acknowledge = ack (true|false)**
- if parameter for ask is in valid, 400 (BAD REQUEST) is returned
```
	[
	    {
	        "_id": "8e416ba1-596c-4ea9-b4f8-9bed08429630",
	        "incidentId": "9224ea02-6398-445d-844d-deefa0692993",
	        "programId": 5,
	        "programName": "Funny Games Power Saver",
	        "customerId": 8,
	        "customerName": "Customer - no dipatch",
	        "message": "Dear Voltan,            You have been dispatched as part of the Program \"Funny Games Power Saver \"            Please have your full curtailment plan in effect between the hours            of 08/27/2019 21:00 and 08/27/2019 22:00",
	        "hasBeenSent": false,
	        "hasBeenAcknowledged": true,
	        "dispatchMeans": "",
	        "moreInfo": "NO WAY TO SEND DISPATCH TO CUSTOMER Customer - no dipatch",
	        "createdOn": "Fri, 13 Aug 2021 09:53:45 GMT",
	        "acknowledgeOn": "Fri, 13 Aug 2021 09:54:42 GMT",
	        "acknowledgebBy": "me"
	    },
	    {
	        "_id": "ddb8c35d-b9ac-47a9-9ff9-c8f9407f264a",
	        "incidentId": "2ad9c147-68f0-4d6d-9e2d-eecc9beb0863",
	        "programId": 5,
	        "programName": "Funny Games Power Saver",
	        "customerId": 8,
	        "customerName": "Customer - no dipatch",
	        "message": "Dear Voltan,            You have been dispatched as part of the Program \"Funny Games Power Saver \"            Please have your full curtailment plan in effect between the hours            of 08/27/2019 21:00 and 08/27/2019 22:00",
	        "hasBeenSent": false,
	        "hasBeenAcknowledged": false,
	        "dispatchMeans": "",
	        "moreInfo": "NO WAY TO SEND DISPATCH TO CUSTOMER Customer - no dipatch",
	        "createdOn": "Fri, 13 Aug 2021 09:53:50 GMT",
	        "acknowledgeOn": "Fri, 13 Aug 2021 09:54:30 GMT",
	        "acknowledgebBy": "me"
	    }
	]
```

```
POST /incident
```
- With Body :
```
	{
	    "start_time": "08/27/2019 21:00",
	    "end_time": "08/27/2019 22:00",
	    "program_id": 8,
	    "event_type": "market_dispatch"
	}
```
-   **Creates** an incident (like a power outage incident) for a particular program.
-	Invokes dispatches for :
	- All clients registered up for the program_id = 8 
	    - Invokes dispatches for  registered dispatch methods __(Email, Phone, Web Socket, for connected clients)__

```
DELETE /purge?all =1 
```
- **For my own internal use demo : to purge the DB of records**

### Methods (SOCKET IO)
-	I Implemented this to demonstrate REAL-TIME Updates
```
Io.onconnect()
```
-	Registers that real-time client has connected

```
I0.on(‘handshake’)
```
- Registers that a client has establishe a handshake with the server

```
Io.on(‘acknowledge’)
```
-   Registers that a REAL-TIME client has acknowledge that they received  a dispatch
-   Client gets an io.(‘acknowledge-update’) message, which in turn updates the UI an dhides the Acknowledge buttonethods to 
	

## Architecture
### Foders Structure and Files
```
./services/dispatcher.js
```
- Contains methods to manage dispatches
    - Creates documents in the Incidents Collection
    - Creates documents in the Dispatches collection (a record per customer, per dispatch method)
	
```
./services.logger.js
```
- Contains methods to create logs
    - Inserts a document in the logs collection
	- Logs can be for errors or for Audit purpose
	- **correlationId:** field  - a unique GUID to identify a transaction
	- **logType:** field - type of log
	- **message:** field additional Info
- Different kinds of loggers can be implemented here or in individual modules **(Event Logs, Txt File Logs, Splunk Logs etc)**

```
./repository.js
```
## Database
- Used to manage all DB transactions
	The database is hosted in the cloud at
    - connectUrl : **"mongodb+srv://admin:fxiAdmin8522@fxicluster.uh3gu.mongodb.net/";**
    - database name : **voltus**
	- Can be switched for any DBEngine 

### Collections
#### Programs 
- List of (power saving) programs offered by a (power/grid company)
- Sample Document:
```
{
    "_id": 2,
    "name": "PG&E Easy Nights"
}
```

#### Customers 
- List of Voltus Customers (power consumers, and the program they are involved in
    - **Dispatchtypes Field:** a list of How the customer has registered to be informed about an incident [email, phone, web-socket broadcast, etc) 
    - As of writing this README, the different dispatcher types have **not** been implemented
- Sample Document :
```
{
    "_id": 1,
    "name": "Keroche Wine",
    "address": "Highway 71",
    "phone": "+16173086055",
    "email": "fwangohi@gmail.com",
    "programId": 1,
    "dispatchTypes": [1, 2, 3]
}
```

#### Incidents
- A list of power consumption alerts from the grid (power companies)
- Sample Document:
```
{
    "_id": "9224ea02-6398-445d-844d-deefa0692993",
    "start_time": "08/27/2019 21:00",
    "end_time": "08/27/2019 22:00",
    "program_id": 5,
    "event_type": "market_dispatch",
    "createdOn": "Fri, 13 Aug 2021 09:53:43 GMT"
}
```


#### Dispatches:
- A List of all the dispatches created per customer (Alert messages by Dispatch Type [email, phone, websocket]
- Sample Document
```
	{
	        "_id": "8e416ba1-596c-4ea9-b4f8-9bed08429630",
	        "incidentId": "9224ea02-6398-445d-844d-deefa0692993",
	        "programId": 5,
	        "programName": "Funny Games Power Saver",
	        "customerId": 8,
	        "customerName": "Customer - no dipatch",
	        "message": "Dear Voltan,            You have been dispatched as part of the Program \"Funny Games Power Saver \"            Please have your full curtailment plan in effect between the hours            of 08/27/2019 21:00 and 08/27/2019 22:00",
	        "hasBeenSent": false,
	        "hasBeenAcknowledged": true,
	        "dispatchMeans": "",
	        "moreInfo": "NO WAY TO SEND DISPATCH TO CUSTOMER Customer - no dipatch",
	        "createdOn": "Fri, 13 Aug 2021 09:53:45 GMT",
	        "acknowledgeOn": "Fri, 13 Aug 2021 09:54:42 GMT",
	        "acknowledgebBy": "me"
	    }
```

## NOTES:
-	Did not implement Authentication/Authorization – Assumption that any system will have that
-	Did the UI just to show **REAL-TIME Updates for acknowledgment** 
-	Created only CRUD endpoints necessary for the Take home (Some methods were added for convinience using postman)
-	Did not manage to get CI/CD working (bummer)
-	Could not deploy UI to the cloud (another bummer)

## Summary:
-	Looking forwards to Demo the app on my local machine in case setup on YOUR local machine from Github Repos does not work





