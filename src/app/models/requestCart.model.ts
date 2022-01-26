import { Resource } from ".";

export  interface Request{
 
    id: any,
    userID: number,
    request:[{
      resource: Resource,
      quantity: number
    }],
    state: boolean,
    createDate: number,
    
  }