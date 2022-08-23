# Node.js WOPI Server

This is a sample implementation of the [WOPI Protocol](https://docs.microsoft.com/en-us/openspecs/office_protocols/ms-wopi/6a8bb410-68ad-47e4-9dc3-6cf29c6b046b) written with in [TypeScript](https://www.typescriptlang.org/) with [Node.js](https://nodejs.org/en/).This is not a complete implementation, but is meant to be a example for implementers to use to get started or for reference.

This server can be validated with the [WOPI Validator Core](https://github.com/microsoft/wopi-validator-core) or will work as a live WOPI Server if the computer running the WOPI Server is part of an active directory domain with a server running [Office Online Server](https://docs.microsoft.com/en-us/officeonlineserver/deploy-office-online-server).

## Requirements

- [NodeJS 14+](https://nodejs.org/en/)
- Computer running WOPI Server must be part of an Active Directory domain
- [Office Online Server](https://docs.microsoft.com/en-us/officeonlineserver/deploy-office-online-server) running on the same domain as the WOPI Server

## Setting Up

- Clone the repo
- Run `npm install` from the root of the project
- In the root of the project create a file called `.env` and copy the`example.env` file contents to it, then edit it

  - `OFFICE_ONLINE_SERVER` the url with protocol
  - For Example, if you get hosting/discovery from `http://my-oos/hosting/discovery` then use:

    - `OFFICE_ONLINE_SERVER=http://my-oos`

  - `WOPI_IMPLEMENTED` a comma separated list of WOPI Methods. The server currently is capable of view, open, and edit. With those methods use:

    - `WOPI_IMPLEMENTED=view,open,edit`

  - `WOPI_SERVER` the url with protocol of your WOPI Server. It must be reachable from your Office Online Server. _localhost will only work [WOPI Validator Core](https://github.com/microsoft/wopi-validator-core) not with actual files._

    - So if you view the WOPI Client from http://my-wopi-server:3000 then use:

      - `WOPI_SERVER=http://my-wopi-server:3000`

## Running the Server

To run the server enter `npm start` from the root of the project. Or if you use VS Code, press f5 to use the debugger.

