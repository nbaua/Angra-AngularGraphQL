const express = require("express");
const cors = require("cors");

const sqlite3 = require("sqlite3");
const db = new sqlite3.Database("database/data.sqlite");

const { graphqlHTTP } = require("express-graphql");
const { buildSchema } = require("graphql");
const port = 1000;
const app = express().use(cors());

const schema = buildSchema(`
  type Query {

    carriers(offset:Int = 0, limit:Int = 10): [Carrier]
    carrier(id:ID!): Carrier
    
    flights(offset:Int = 0, limit:Int = 10): [Flight]
    flight(id:ID!): Flight

    carrier_flights(flight_code:String): [Flight]
  }

  type Carrier {
    id: ID
    flight_code: String
    tailnum: String
    airline: String
    flight_ref: String
  }

  type Flight {
    id: ID
    flight_code: String
    origin: String
    destination: String
    air_time: String
    distance: String
    airport: String
    flight_date : String
  }
 
  extend type Flight{
    carrier: Carrier
  }

`);

const root = {
  carriers: (args) => {
    return queryHelper(
      `SELECT * FROM carrier LIMIT ${args.offset}, ${args.limit}`,
      false
    );
  },
 
  carrier: (args) => {
    return queryHelper(`SELECT * FROM carrier WHERE id='${args.id}'`, true);
  },

  flights: (args) => {
    return queryHelper(
      `SELECT * FROM flight LIMIT ${args.offset}, ${args.limit}`,
      false
    );
  },

  flight: (args) => {
    return queryHelper(`SELECT * FROM flight WHERE id='${args.id}'`, true);
  },

  carrier_flights: (args) => {
    return queryHelper(
      `SELECT f.airport, f.flight_code, f.origin, f.destination, f.air_time, f.distance, f.flight_date, 
                c.flight_code, c.tailnum, c.airline, c.flight_ref
                FROM flight AS f 
                INNER JOIN carrier AS c 
                ON f.flight_code = c.flight_code  WHERE
         c.flight_code='${args.flight_code}'`,
      false
    ).then((rows) =>
      rows.map((result) => {
        return {
          flight_code: result.flight_code,
          origin: result.origin,
          destination: result.destination,
          air_time: result.air_time,
          distance: result.distance,
          airport: result.airport,
          flight_date : result.flight_date,
          carrier: {
            flight_ref : result.flight_ref,
            tailnum: result.tailnum,
            airline: result.airline,
          },
        };
      })
    );
  },
};

app.use(
  "/graphql",
  graphqlHTTP({
    schema,
    rootValue: root,
    graphiql: true,
  })
);

app.listen(port, (err) => {
  if (err) {
    return console.log(err);
  }
  return console.log(
    "The Express App listening on port http://localhost:" + port + "/graphql"
  );
});

function queryHelper(sql, single) {
  return new Promise((resolve, reject) => {
    var callback = (err, result) => {
      if (err) {
        return reject(err);
      }
      resolve(result);
    };

    if (single) db.get(sql, callback);
    else db.all(sql, callback);
  });
}
