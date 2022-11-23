
export interface LandPlot {
    seedID: number;
    plotNo: number;
}

export interface LandToPlant {
    landID: number;
    plant: LandPlot[];
}

export class HiveTrxPlant {
    operation: string;
    payload: LandToPlant[];

    constructor(){
        this.operation = "plantMultiple";
        this.payload = [];
    }
}



