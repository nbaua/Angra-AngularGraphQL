import { Component, OnInit } from '@angular/core';
import { Apollo, QueryRef } from 'apollo-angular';
import gql from 'graphql-tag';

const QUERY = gql`
  query flights($offset: Int) {
    flights(offset: $offset, limit: 10) {
      id
      flight_code
      origin
      destination
      air_time
      distance
      airport
      flight_date
    }
  }
`;

@Component({
  selector: 'app-flight',
  templateUrl: './flight.component.html',
  styleUrls: ['./flight.component.css'],
})
// tslint:disable: typedef
export class FlightComponent implements OnInit {
  page = 0;
  flights: any[] = [];

  private query: QueryRef<any>;

  constructor(private apollo: Apollo) {}

  ngOnInit() {
    this.query = this.apollo.watchQuery({
      query: QUERY,
      variables: { offset: 10 * this.page },
    });

    this.query.valueChanges.subscribe((result) => {
      this.flights = result.data && result.data.flights;
    });
  }

  update() {
    this.query.refetch({ offset: 10 * this.page });
  }

  nextPage() {
    this.page++;
    this.update();
  }

  prevPage() {
    if (this.page > 0) { this.page--; }
    this.update();
  }
}
