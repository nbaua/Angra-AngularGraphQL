import { Component, OnInit } from '@angular/core';
import { Apollo, QueryRef } from 'apollo-angular';
import gql from 'graphql-tag';

const QUERY = gql`
  query carriers($offset: Int) {
    carriers(offset: $offset, limit: 10) {
      id
      flight_code
      tailnum
      airline
    }
  }
`;

@Component({
  selector: 'app-flight',
  templateUrl: './flight.component.html',
  styleUrls: ['./flight.component.css'],
})
export class FlightComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
