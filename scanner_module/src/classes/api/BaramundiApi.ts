// Endpoint in Baramundi suchen
// $searchResult = Invoke-RestMethod -Uri "$($api)/search?type=endpoint&term=G84-ADM-PC2" -Method Get -Credential $cred
// #Endpoint ID: 589CD721-47D2-44E8-92FD-C697D4A54914
// Endpoint laden
// $endpoint = Invoke-RestMethod -Uri "$($api)/endpoints?id=589CD721-47D2-44E8-92FD-C697D4A54914" -Method Get -Credential $cred
// const endpoint = '/bConnect/v1.1/Applications?orgUnit=E9E642B7-35C4-4F3B-9766-22AC2CC1AC4E'
// const endpoint = '/bConnect/v1.1/Applications?id=B3AFF2C5-2C2F-4DF5-895E-078AA929B972'

import { BaramundiSearch, OrgUnitType, SoftwareType } from '@/types/baramundi'
import { logger } from '@/utils/logger'

import { BaseRequestApi, BaseCurlApiConfig } from '../abstract/BaseRequestApi'

export class BaramundiApi extends BaseRequestApi {
  constructor(config: BaseCurlApiConfig) {
    super(config)
  }

  public async findApplicationByName(term: string): Promise<BaramundiSearch[]> {
    const endpoint = `/bConnect/v1.1/Search?type=software&term=${encodeURIComponent(term)}`
    return await this.sendRequest(endpoint, 'GET')
  }

  public async getApplicationById(id: string): Promise<SoftwareType> {
    const endpoint = `/bConnect/v1.1/Applications?id=${id}`
    return await this.sendRequest(endpoint, 'GET')
  }

  public async getOrgUnitById(id: string): Promise<OrgUnitType> {
    const endpoint = `/bConnect/v1.1/OrgUnits?id=${id}`
    return await this.sendRequest(endpoint, 'GET')
  }
}
