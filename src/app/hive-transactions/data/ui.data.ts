import { Rarity } from "./dcrops.data";

export interface AutoCompSeed {
    name: string;
    number: number;
    img: string;
  }

export interface LandCount{
    rarity: Rarity;
    amount: number;
}