
export interface Input {
    value: number;
    viewValue: string;
    date?: Date;
  }
  
  export  interface Group {
    id?: number;
    disabled?: boolean;
    name: string;
    data: Input[];
  }
  