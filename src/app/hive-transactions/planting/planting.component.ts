import { Component, OnInit } from '@angular/core';
import { HiveKeychainService } from '../service/hive-keychain.service';
import {MatButtonModule} from "@angular/material/button";
import { HiveEngineService } from '../service/hive-engine.service';
import { AccountNftCollection, HiveTrxBuilderPlanter, Rarity, Season } from '../data/dcrops.data';
import { ActivatedRoute } from '@angular/router';
import { map, Observable, startWith, Subject, takeUntil } from 'rxjs';
import { FormControl } from '@angular/forms';
import { AutoCompSeed, LandCount } from '../data/ui.data';

@Component({
  selector: 'app-planting',
  templateUrl: './planting.component.html',
  styleUrls: ['./planting.component.scss']
})
export class PlantingComponent implements OnInit {

  seedCtrl = new FormControl('');
  auto_comp! : AutoCompSeed[];
  filteredSeeds!: Observable<AutoCompSeed[]>;

  public plotCount: LandCount[] = [];
  public PlotRarity = Rarity;
  public selctLand: boolean[] = [false, false, false, false];

  public season!: Season;
  public seasonImagePath!: string;
  public plantableSeeds: number = 0;
  public collection!: AccountNftCollection;

  private destroy$: Subject<void> = new Subject();

  public user!: string;
  public cropName!: string;
  public cropNumber!: number;
  private plotRarity: Set<Rarity> = new Set<Rarity>();
  private rarityEnums = [Rarity.COMMON,Rarity.RARE,Rarity.EPIC, Rarity.LEGENDARY];

  constructor(private route: ActivatedRoute, private keychain: HiveKeychainService, private hiveEngine: HiveEngineService){}

  ngOnInit(): void {
    
    this.route.queryParamMap.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      this.user = params.get('user') ? <string>params.get('user') : "";
      this.cropName = params.get('crop') ? <string>params.get('crop') : "";
      this.cropNumber = params.get('cropNum') ? Number(params.get('cropNum')) : 0;

      const raritiesCs = params.get('plotRarities') ? <string>params.get('plotRarities') : "";

      raritiesCs.split(",").forEach((rarity)=>{
        this.selctLand[Number(rarity)] = true;
        this.plotRarity.add(this.rarityEnums[Number(rarity)]);
      });

    });

    (async () =>{
      this.season = await this.hiveEngine.getSeason();
      this.seasonImagePath = "/assets/images/" + this.season.name.toLowerCase() +".png";
      await this.loadCollection(this.user, true);
      this.calculatePlantableCrops();
      this.filteredSeeds = this.seedCtrl.valueChanges.pipe(
        startWith(''),
        map(seed => (seed ? this._filterStates(seed) : this.auto_comp.slice())),
      );

    })();
  }

  private _filterStates(value: string): AutoCompSeed[] {
    const filterValue = value.toLowerCase();

    return this.auto_comp.filter(seed => seed.name.toLowerCase().includes(filterValue));
  }

  private async loadCollection(user: string, filter: boolean){
    this.collection = await this.hiveEngine.getSeedsAndLand(user, filter);
    this.calculatePlantableCrops();
    this.countLandTypes();
  }

  private countLandTypes(){
    const map = new Map<Rarity,number>();
    map.set(Rarity.COMMON,0);
    map.set(Rarity.RARE,0);
    map.set(Rarity.EPIC,0);
    map.set(Rarity.LEGENDARY,0);

    this.collection.land_nft.forEach((land)=>{
      let count = map.get(land.rarity)!;
      if(!land.full){
        count += land.secondary.p.length - land.filledPlots;
        map.set(land.rarity,count);
      }
    });

    this.plotCount.push({rarity: Rarity.COMMON,amount: map.get(Rarity.COMMON)!});
    this.plotCount.push({rarity: Rarity.RARE,amount: map.get(Rarity.RARE)!});
    this.plotCount.push({rarity: Rarity.EPIC,amount: map.get(Rarity.EPIC)!});
    this.plotCount.push({rarity: Rarity.LEGENDARY,amount: map.get(Rarity.LEGENDARY)!});

  }

  private async calculatePlantableCrops(update_input: boolean=true){
    if(this.collection.seed_nft.has(this.cropName)){
      this.plantableSeeds = 0;
      
      this.collection.seed_nft.get(this.cropName)?.forEach(element => {
          this.plantableSeeds += !element.cooldown && element.season.has(this.season.index) ? 1 : 0;
      });
    }
    if(update_input){
      this.auto_comp = [];

      this.collection.seed_nft.forEach((value,key) => {
        if(value[0].season.has(this.season.index)){
          let seed = <AutoCompSeed>{};
          seed.name = key;
          seed.number = value.length;
          seed.img = "/assets/images/" + key + ".png"
          this.auto_comp.push(seed);
        }
      });
    }
  }

  public async testButton(){

    const a = new HiveTrxBuilderPlanter();
    const request = a.plant(this.cropName,this.cropNumber,this.plotRarity,this.collection,this.season);

    const response = await this.keychain.requestCustomJson(window, this.user,"dcrops","Active",request,"Plants stuff");

    if(!response.success){
      await this.loadCollection(this.user,true);
    }
    
    this.calculatePlantableCrops();

  }
  
  public updateCropName(event: string){

    if(this.collection.seed_nft.has(event)){
      this.cropName = event;
      this.calculatePlantableCrops(false);
    }
  }

  public toggleRarity(rarity: number){
      const selectedLand: boolean = this.selctLand[rarity];
      this.selctLand[rarity] = !selectedLand;
      if(!selectedLand){
        this.plotRarity.add(this.rarityEnums[Number(rarity)]);
      }else{
        this.plotRarity.delete(this.rarityEnums[Number(rarity)]);
      }
      console.log(this.plotRarity)
  }

}


