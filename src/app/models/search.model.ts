import {SortColumn, SortDirection} from '../directives/sorteable.directive';

export interface SearchResult {
    data: any;
    total: number;
  }
  export interface State {
    page: number;
    pageSize: number;
    searchTerm: string;
    sortColumn: SortColumn;
    sortDirection: SortDirection;
  }