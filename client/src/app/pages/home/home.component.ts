import { Component, OnInit } from '@angular/core';
import { Apollo, QueryRef } from 'apollo-angular';
import gql from 'graphql-tag';

import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { strict } from 'assert';

const CODES_QUERY = gql`
  query all_flight_codes {
    carriers(offset: 0, limit: 1000) {
      flight_code
    }
  }
`;

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
  allFlightCodes = [];

  private query: QueryRef<any>;
  model: any;

  constructor(private apollo: Apollo) {}

  search = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map((term) =>
        term.length < 2
          ? []
          : this.allFlightCodes
              .filter((v) => v.toLowerCase().indexOf(term.toLowerCase()) > -1)
              .slice(0, 10)
      )
      // tslint:disable-next-line: semicolon
    );

  onNgbFocusOrClick(e) {
    this.flightCode = e.item;
    this.query.refetch({ code: this.flightCode });
  }

  ngOnInit() {
    this.apollo
      .query({
        query: CODES_QUERY,
      })
      .subscribe((codes: any) => {
        for (const [key, value] of Object.entries(codes.data.carriers)) {
          const c: any = value;
          this.allFlightCodes.push(c.flight_code);
        }
      });

    this.query = this.apollo.watchQuery({
      query: QUERY,
      variables: { code: this.flightCode },
    });

    this.query.valueChanges.subscribe((result) => {
      this.flights = result.data && result.data.carrier_flights;
    });
  }

}
