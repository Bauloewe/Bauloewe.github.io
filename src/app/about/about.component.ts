import { DOCUMENT } from '@angular/common';
import { AfterContentInit, Component, Inject, OnInit } from '@angular/core';
import { async } from '@angular/core/testing';
import { HiveKeychainResponse } from '../hive-transactions/data/keychain.data';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})


export class AboutComponent{

  public testString : string= "";


  constructor(window: Window) {
     
  }



  async buttonFunction(){
    // @ts-ignore

    
    this.testString = JSON.stringify((<any>window).hive_keychain);
    const keychain = (<any>window).hive_keychain;
    keychain.requestHandshake();

    //keychain.requestCustomJson(null, 'sm_market_rent', 'Active', JSON.stringify({items:["9292cd44ccaef8b73a607949cc787f1679ede10b-93"],currency:"DEC",days:1}), 'Rent 1 card on Splinterlands',
    keychain.requestEncodeMessage("aicu", "bauloewe", "#aicu123", 'Posting', (response: HiveKeychainResponse<any>) => {
      console.log(JSON.stringify(response));
      if (response.success) {
        const encodedMessage = response.result;
        
      }
    });




    }
 
    

  }
