import { Component, OnInit } from '@angular/core';
import { Apollo, QueryRef } from 'apollo-angular';
import gql from 'graphql-tag';

const QUERY = gql`
  query flights($code: String) {
    carrier_flights(flight_code: $code) {
      flight_code
      origin
      destination
      air_time
      distance
      airport
      flight_date
      carrier {
        tailnum
        airline
        flight_ref
      }
    }
  }
`;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})

// tslint:disable: typedef
export class HomeComponent implements OnInit {
  flightCode: '';
  flights: any[] = [];

  private query: QueryRef<any>;

  constructor(private apollo: Apollo) {}

  ngOnInit() {
    this.query = this.apollo.watchQuery({
      query: QUERY,
      variables: { code: this.flightCode },
    });

    this.query.valueChanges.subscribe((result) => {
      this.flights = result.data && result.data.carrier_flights;
    });
  }

  update(e) {
    this.flightCode = e.target.value;
    this.query.refetch({ code: this.flightCode });
  }
}
