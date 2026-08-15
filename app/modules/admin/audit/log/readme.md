# Log

## Overview

The Log module, allow developers to register every domain events changes that happen into a module, following a stabilished data structure to be send, with a well organized interface to visualize registered logs.

## Implementation of the module

The Log module uses Outbox/Inbox implementation abstraction that the application already have.

The Log is created using broadcast message implementation in the application, with 'core.admin.audit.log' as routing key, which creates a new message in the outbox service.

For the message to be assigned to inbox, was created a consumer for the log using 'core.admin.audit.log' routing key CORE_SHARED responsible.

Finally, we need to execute something when a log message is founded in inbox, in our case, we need to register it in mongo, so, we create a service that make create this record in mongo and add this service as contract in inbox processor job, so, when this inbox job runs and found a message with our routing key, will execute the service to register the payload of the message in mongo.

## How to Use

- **Record a Log**
  To Record a log, the developer only need to use the usecase Contract and its implementation, following the stabilished structure to register the log.

Register logs can be visualized in backoffice.
