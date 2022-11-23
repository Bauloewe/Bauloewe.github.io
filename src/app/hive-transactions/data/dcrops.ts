import { seed_nfts } from "./Constants";
import { Properties, Result } from "./requests";
import { HiveTrxPlant, LandPlot, LandToPlant } from "./transactions";

export interface Season{
    nft: string;
    name: string;
    index: number;
    start_ts: string;
}


export interface Seed{
    id: number;
    cooldown: boolean;
    rarity: Rarity;
    season: Set<number>;
    primary: any;
    secondary: any;
}

export interface Land{
    id: number;
    rarity: Rarity;
    full: boolean;
    filledPlots: number;
    primary: any;
    secondary: any;
    tertiary: any;
    boosters: any;
}

export class AccountNftCollection{
    seed_nft: Map<string, Array<Seed>>;
    land_nft: Array<Land>;

    constructor(){
        this.seed_nft = new Map<string, Array<Seed>>();
        this.land_nft = new Array<Land>();
    }


    public addNft(nft: Result){
        const props: Properties = nft.properties;

        const id = nft._id;
        const nft_obj = JSON.parse(props.nft);
        const primary = JSON.parse(props.primary);
        const secondary = JSON.parse(props.secondary);

        const isSeed: boolean = seed_nfts.has(props.name);

        if(isSeed){
            const seed = <Seed>{};

            seed.id = id;
            seed.cooldown = secondary.cd > Date.now() / 1000;
            seed.season = new Set(primary.s);
            seed.rarity = <Rarity> nft_obj.rarity;
            seed.primary = primary;
            seed.secondary = secondary;
            
            let seed_list:Seed[] = [];
            seed_list = this.seed_nft.has(props.name) ? this.seed_nft.get(props.name)! : [];
            seed_list.push(seed);
            
            this.seed_nft.set(props.name, seed_list);

        }else{

            const land = <Land>{};

            land.id = id;
            land.rarity = <Rarity> nft_obj.rarity;
            land.primary = primary;
            land.secondary = secondary;
            land.tertiary = JSON.parse(props.tertiary);
            if(props.boosters) land.boosters = JSON.parse(props.boosters);
            let filledPlots = 0;
            secondary.p.forEach((element: string) => {
                filledPlots += element.length > 0 ? 1 : 0;
            });
            land.filledPlots = filledPlots;
            land.full = filledPlots == secondary.p.length;

            this.land_nft.push(land);

        }

    }

}

export enum Rarity{
    COMMON = "Common",
    RARE = "Rare",
    EPIC = "Epic",
    LEGENDARY = "Legendary"
}
export class HiveTrxBuilderPlanter{

    plant(seed: string, amount: number, mode:Set<Rarity>, collection: AccountNftCollection, season: Season){

        
        const lands = this.filterLand(collection.land_nft,mode);
        const seeds = this.filterSeeds(collection.seed_nft.get(seed)!,season);

        return this.ploughFields(seeds, lands);

    }


    private ploughFields(seeds: Seed[], lands: Land[]){
    
        const hive_trx: HiveTrxPlant = new HiveTrxPlant();
        const lands_sorted: Land[] = lands.sort((a, b) => (a.filledPlots > b.filledPlots ? -1 : 1));

        for(let land of lands_sorted){
            
            const landPlot: LandToPlant = <LandToPlant>{};
            landPlot.landID = land.id;
            landPlot.plant = [];
            let index: number = 0;
            for(let plot of land.secondary.p){

                if (plot.length == 0) {
                    let seed: Seed|undefined = seeds.pop();
                    if(!seed) break;

                    const planterPlot =  <LandPlot>{};
                    planterPlot.seedID = seed.id;
                    planterPlot.plotNo = index;
                    landPlot.plant.push(planterPlot);
                }
                index++;
            }
            hive_trx.payload.push(landPlot);

            if (seeds.length == 0) break;


          }

          return hive_trx;
        
    }

    private filterSeeds(seeds: Seed[],season: Season){
        let seeds_filtered: Seed[] = [];
        seeds.forEach((seed)=>{
            console.log(seed);
            if(!seed.cooldown && seed.season.has(season.index)){
                seeds_filtered.push(seed);
            }
        });

        return seeds_filtered;
    }

    private filterLand(lands:Array<Land>, mode:Set<Rarity>){
        let filtered_land: Array<Land> = new Array();

        lands.forEach(function (land: Land) {
            if(!land.full &&  mode.has(land.rarity)){
                filtered_land.push(land);
            }
        });

        return filtered_land;
    }
}