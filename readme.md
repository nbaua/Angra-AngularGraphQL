# AnGra - An Angular GraphQL Demo Application

---

    This project is working prototype showing the use of GraphQL in an Angular Application.
    (Server uses the simple JS version - Angular project is TS version)

> ### JavaScript + GraphQL + Angular + Express + SqlLite

## How to use

Simply clone this repository and run following command on terminal to update the required packages

    > npm install

### Quick Check on GraphQL Server

Run the following query on localhost:1000/graphql

    {
    flights(flight_code: "9E-3422") {
        flight_code
        origin
        destination
        carrier {
        tailnum
        flight_ref
        airline
        }
    }
    }

---

### Quick check on Angular App

Run the following command after starting the server in another terminal by switching to client directory

> ng serve


---

Disclaimer:
For simplicity and to make things easy to understand, the queries and resolvers are included in the index.js files itself. Please follow the best coding practices at your end, do NOT replicate this structure for your actual project.