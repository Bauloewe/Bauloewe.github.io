import { Component, OnInit } from '@angular/core';
import { HiveKeychainService } from '../service/hive-keychain.service';
import {MatButtonModule} from "@angular/material/button";
import { HiveEngineService } from '../service/hive-engine.service';
import { AccountNftCollection, HiveTrxBuilderPlanter, Rarity, Season } from '../data/dcrops';
import { ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-planting',
  templateUrl: './planting.component.html',
  styleUrls: ['./planting.component.scss']
})
export class PlantingComponent implements OnInit {

  public season!: Season;
  public seasonImagePath!: string;
  public plantableSeeds: number = 0;
  public collection!: AccountNftCollection;

  private destroy$: Subject<void> = new Subject();

  private user!: string;
  public cropName!: string;
  private cropNumber!: number;
  private plotRarity: Rarity[] = [];
  private rarityEnums = [Rarity.COMMON,Rarity.RARE,Rarity.EPIC, Rarity.LEGENDARY];

  constructor(private route: ActivatedRoute, private keychain: HiveKeychainService, private hiveEngine: HiveEngineService){}

  ngOnInit(): void {
    
    this.route.queryParamMap.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      this.user = params.get('user') ? <string>params.get('user') : "";
      this.cropName = params.get('crop') ? <string>params.get('crop') : "";
      this.cropNumber = params.get('cropNum') ? Number(params.get('cropNum')) : 0;

      const raritiesCs = params.get('plotRarities') ? <string>params.get('plotRarities') : "";

      raritiesCs.split(",").forEach((rarity)=>{
        this.plotRarity.push(this.rarityEnums[Number(rarity)]);
      });



    });



    (async () =>{
      this.season = await this.hiveEngine.getSeason();
      this.seasonImagePath = "/assets/images/" + this.season.name.toLowerCase() +".png";
      await this.loadCollection(this.user);
      this.calculatePlantableCrops();
    })();
  }

  private async loadCollection(user: string){
    this.collection = await this.hiveEngine.getSeedsAndLand(user);
  }

  private async calculatePlantableCrops(){
    this.plantableSeeds = 0;
    this.collection.seed_nft.get(this.cropName)?.forEach(element => {
        this.plantableSeeds += !element.cooldown && element.season.has(this.season.index) ? 1 : 0;
    });
  }

  public async testButton(){

    const a = new HiveTrxBuilderPlanter();
    const resp = a.plant(this.cropName,this.cropNumber,new Set(this.plotRarity),this.collection,this.season);

    this.keychain.requestCustomJson(window, this.user,"dcrops","Active",resp,"Plants stuff");

    this.loadCollection(this.user);
    this.calculatePlantableCrops();

  }
}
