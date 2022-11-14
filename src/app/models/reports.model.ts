export interface ReportData  {

    name: string;
    value: number;
  
}

export class Reports{
    type: {data: ReportData[], selected: boolean};
    city: {data: ReportData[], selected: boolean};
    state:{data: ReportData[], selected: boolean};
    degree: {data: ReportData[], selected: boolean};

    constructor(data: ReportData[], selected){
    this.type = {
        data : data, selected: selected
    }|| null;
    this.city=  {
        data : data, selected :selected
    } || null;
    this.state= {data :  data, selected: selected}|| null;
    this.degree= {data: data, selected:selected}|| null;
    }
}