# Solis

Game developed using react js and Socket.IO

## Development Notes

### React

This application makes use of the react library for javascript to build the user interface of the application. To run the application, use the **npm start** command.

### React Router

React router is also used in the application to simulate navigation between different pages of the application, without actually creating those pages. Those pages are instead represented by react components, and the react router API makes it easier to manage the navigation between these components (see the Solis component for an example).

To install react router: **npm install react-router-dom** in the root directory of the project.

### Socket.IO

This application makes use of Socket.IO to serve as a platform for client-server communication. To set this up correctly, the following commands should be executed:

- npm i --save socket.io
- npm i --save socket.io-client

These commands will install the Socket.IO library for use in the development of the application.

### Naming Convention

- Files Names - Files should be named using the **camel case** naming convention.
- Folder Names - Folder names should be **all lower case**. Hyphens can be used to separate words.
- Source Code Identifiers - Use the **camel case** naming convention. Use **pascal case** for class identifiers.
- 'to' property for Link elements in react router - Use the **same convention as folder naming**.
- 'path' property for Route elements in react router - Use the **same convention as folder naming** (should match names with the 'to' property of the corresponding Link element).
