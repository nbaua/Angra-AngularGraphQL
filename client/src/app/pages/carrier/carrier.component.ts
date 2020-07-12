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
      flight_ref
    }
  }
`;
@Component({
  selector: 'app-carrier',
  templateUrl: './carrier.component.html',
  styleUrls: ['./carrier.component.css']
})

// tslint:disable: typedef
export class CarrierComponent implements OnInit {
  page = 0;
  carriers: any[] = [];

  private query: QueryRef<any>;

  constructor(private apollo: Apollo) {}

  ngOnInit() {
    this.query = this.apollo.watchQuery({
      query: QUERY,
      variables: { offset: 10 * this.page },
    });

    this.query.valueChanges.subscribe((result) => {
      this.carriers = result.data && result.data.carriers;
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
