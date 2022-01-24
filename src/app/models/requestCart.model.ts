import { Resource } from ".";

export  interface Request{
 
    id: number,
    userID: number,
    request:[{
      resource: Resource,
      quantity: number
    }],
    state: boolean,
    createDate: number,
    
  }