import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { HiveEngineContractRequest, HiveEngineContractResponse, Result } from '../data/requests';
import { lastValueFrom } from 'rxjs';
import { AccountNftCollection, Season } from '../data/dcrops';
import { seedAndLand } from '../data/Constants';
@Injectable({
  providedIn: 'root'
})
export class HiveEngineService {
  base_url = "https://ha.herpc.dtools.dev/contracts"
  
  
  constructor(private http: HttpClient) {}


  public async getSeason(){
    let request: HiveEngineContractRequest = {	
      "jsonrpc":"2.0",
      "id":1,
      "method":"find",
      "params":
      {
        "contract":"nft",
        "table":"DCROPSinstances",
        "query":{"_id":1},
        "limit":1000,
        "offset":0,
        "indexes":[]
      }
    };
    const response: HiveEngineContractResponse = await this.postContract(request);
    const props = response.result[0].properties

    let season = <Season>{};
    season.index = Number(props.primary);
    season.nft = props.nft;
    season.name = props.secondary;
    season.start_ts = props.tertiary

    return season;
  }

  public async getSeedsAndLand(user: string){

    let limit = 1000;
    let offset = 0

    let val: HiveEngineContractResponse = <HiveEngineContractResponse>{};
    let paging: boolean = false;
    const result: AccountNftCollection = new AccountNftCollection();
    do{
      const request = this.buildSeedAndLandRequest(user,limit, offset);
      const val = await this.postContract(request);

      val.result.forEach((element: Result) => {
        result.addNft(element);
      });
      
      offset += limit;
      
      paging = Array.isArray(val?.result) && val?.result.length > 0;
    }while(paging);

    return result;

  }

  private buildSeedAndLandRequest(user: string, limit: number, offset: number){
    const request: HiveEngineContractRequest = {
      "id":0,
      "jsonrpc":"2.0",
      "method":"find",
      "params":{
         "contract":"nft",
         "table":"DCROPSinstances",
         "query":{
            "account": user,
            "properties.name":{
               "$in": seedAndLand
            }
         },
         "limit":limit,
         "offset":offset,
         "indexes":[
            
         ]
      }
   }

   return request;
  }

  private async postContract(request: HiveEngineContractRequest){
    return lastValueFrom(this.http.post<HiveEngineContractResponse>(this.base_url,request))
  }



}
