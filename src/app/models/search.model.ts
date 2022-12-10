import {SortColumn, SortDirection} from '../directives/sorteable.directive';

export interface SearchResult {
    data: any;
    total: number;
    searchType?: string;
    searchTerm?: string;
    searchPath?: string;
    searchLocation?: any | number;
    from?: Date | string | any;
    to?: Date | string | any;
    originalData? : any;
    
  }
  export interface State {
    page?: number;
    pageSize?: number;
    searchTerm: string;
    sortColumn?: SortColumn;
    sortDirection?: SortDirection;
  }

  export interface SearchReport {
    searchTerm: string;
    searchPath: string | string[] | any;
    searchType: string;
    searchLocation: any | number;
    alertStatus?: string;
    alertType?: string;
    from?: Date | string | any;
    to?: Date | string | any;
  }