import { Injectable } from '@angular/core';
import { HiveKeychainResponse } from '../data/keychain';

@Injectable({
  providedIn: 'root'
})
export class HiveKeychainService {

  constructor() {}



  public async requestHandshake(window: Window){
    const keychain = (<any>window).hive_keychain;
    keychain.requestHandshake();
  }

  public async requestCustomJson(window: Window,user:string, id:string, auth: string ,custom_json:any, description: string): Promise<HiveKeychainResponse<any>> {
    
    const keychain = (<any>window).hive_keychain;
    let result: Promise<HiveKeychainResponse<any>> = new Promise<HiveKeychainResponse<any>>((resolve, reject) => {
      setTimeout(() => {
        keychain.requestCustomJson(user, id, auth, JSON.stringify(custom_json),description, (response: HiveKeychainResponse<any>) => {
          console.log(JSON.stringify(response));
          if (response.success) {
            resolve(response);
          }else{
            reject(response)
          }
        });
      }, 300);
    });


    return result;
    
  }
}
