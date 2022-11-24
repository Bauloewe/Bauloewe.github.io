import { seed_nfts } from "./Constants";
import { Properties, Result } from "./requests.data";
import { HiveTrxPlant, LandPlot, LandToPlant } from "./transactions.data";

export interface Season{
    nft: string;
    name: string;
    index: number;
    start_ts: string;
}


export interface Seed{
    id: number;
    name: string;
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


    public addNft(nft: Result, filter: boolean){
        const props: Properties = nft.properties;

        const id = nft._id;
        const nft_obj = JSON.parse(props.nft);
        const primary = JSON.parse(props.primary);
        const secondary = JSON.parse(props.secondary);

        const isSeed: boolean = seed_nfts.has(props.name);

        if(isSeed){
            const seed = <Seed>{};

            seed.id = id;
            seed.name = props.name;
            seed.cooldown = (1209600 + secondary.cd) > Date.now() / 1000;
            seed.season = new Set(primary.s);
            seed.rarity = <Rarity> nft_obj.rarity;
            seed.primary = primary;
            seed.secondary = secondary;
            
            let seed_list:Seed[] = [];
            seed_list = this.seed_nft.has(props.name) ? this.seed_nft.get(props.name)! : [];
            seed_list.push(seed);

            if(filter && seed.cooldown) return;

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

            if(filter && land.full) return;

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
        const output : any = this.ploughFields(seeds, amount, lands);

        this.updateCollection(seed, seeds, output.map, collection);

        return output.request;


    }

    private updateCollection(seed: string, seeds: Seed[], lands: Map<Number,Land>, collection: AccountNftCollection){
        collection.seed_nft.set(seed,seeds);
        
        for (const land of collection.land_nft){
            if(lands.has(land.id)){
                const mod_land = lands.get(land.id)!;
                land.filledPlots = mod_land.filledPlots;
                land.full = mod_land.secondary.p.length == mod_land.filledPlots;
                land.secondary = mod_land.secondary;
            }
        }

    }
    private compare(a: Land, b: Land){
        let comp: number = 0;
        const a_max = a.secondary.p.length
        const b_max = b.secondary.p.length

        let a_empty = a_max - a.filledPlots;
        let b_empty = b_max - b.filledPlots;

        a_empty += a_empty > 1 && a_empty < a_max ? Number(a.rarity)+1:0;
        b_empty += b_empty > 1 && b_empty < b_max ? Number(b.rarity)+1:0;

        comp =  a_empty > b_empty ? -1 : 1;

        return comp;
    }
    private ploughFields(seeds: Seed[], amount: Number, lands: Land[]){
    
        const hive_trx: HiveTrxPlant = new HiveTrxPlant();

        const lands_sorted: Land[] = lands.sort((a, b) => (this.compare(a,b)));
        console.log(lands_sorted);
        const land_map:Map<Number,Land> = new Map<Number,Land>();

        let nft_count:number = 0;
        let seeds_planted = 0;

        for(let land of lands_sorted){
            
            const landPlot: LandToPlant = <LandToPlant>{};
            landPlot.landID = land.id;
            landPlot.plant = [];
            let index: number = 0;
            nft_count += 1;
            for(let plot of land.secondary.p){

                if (plot.length == 0) {
                    if(seeds.length == 0 || nft_count >=50 || seeds_planted >= amount) break;

                    let seed: Seed = seeds.pop()!;

                    nft_count+=1;
                    seeds_planted+= 1;

                    const planterPlot =  <LandPlot>{};
                    planterPlot.seedID = seed.id;
                    planterPlot.plotNo = index;
                    landPlot.plant.push(planterPlot);

                    land.secondary.p[index] = seed.name;
                    land.filledPlots += 1;
                }
                land_map.set(land.id,land);
                index++;
                
            }

            hive_trx.payload.push(landPlot);

            if (seeds.length == 0 || nft_count >=50 || seeds_planted >= amount) 
                break;


          }
          return {"request": hive_trx,"map":land_map};
        
    }

    private filterSeeds(seeds: Seed[],season: Season){
        let seeds_filtered: Seed[] = [];
        seeds.forEach((seed)=>{
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