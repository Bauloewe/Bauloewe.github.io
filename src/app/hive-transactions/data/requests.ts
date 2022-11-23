export interface Query {
    _id?: number;
    account?: string;
    "properties.name"?: PropertiesName;
}



export interface HiveEngineContractRequest {
    jsonrpc: string;
    id: number;
    method: string;
    params: Params;
}



export interface LockedTokens {
    CROP?: string;
}

export interface Properties {
    name: string;
    nft: string;
    primary: string;
    secondary: string;
    tertiary: string;
    boosters: string;
}
export interface Result {
    _id: number;
    account: string;
    ownedBy: string;
    lockedTokens: LockedTokens;
    properties: Properties;
    previousAccount?: string;
    previousOwnedBy?: string;
}

export interface HiveEngineContractResponse {
    jsonrpc: string;
    id: number;
    result: Result[];
}

export interface PropertiesName {
    "$in": string[];
}

export interface Params {
    contract: string;
    table: string;
    query: Query;
    limit: number;
    offset: number;
    indexes: any[];
}


