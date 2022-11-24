export interface HiveKeychainResponse<Type>{
    success: boolean,
    error?: string,
    result?: Type,
    message: string,
    request_id: number
}


export interface HiveKeychainRequestData{
    type: string;
}