import { injectable } from 'inversify';
import { config } from '@/config';
import { IZohoAuthService } from '@/interfaces/IZohoAuthService';
import axios from 'axios';

@injectable()
export class ZohoAuthService implements IZohoAuthService {
  private cachedAccessToken: string | null = null;
  private tokenExpiresAthMs: number = 0;

  public async getAccessToken(): Promise<string> {
    const now = Date.now();
    if (this.cachedAccessToken && now < this.tokenExpiresAthMs - 30_000) {
      return this.cachedAccessToken;
    }
    const token = await this.exchangeRefreshToken();
    return token;
  }

  private async exchangeRefreshToken(): Promise<string> {
    try {
      const params =  { 
        client_id: config.zoho.clientId,
        client_secret: config.zoho.clientSecret,
        grant_type: 'client_credentials',
        soid: config.zoho.soid,
        scope: config.zoho.scopes,
      };
    
    const endpoint = `${config.zoho.endpoints.accountsBase}/oauth/v2/token`;
    const { data } = await axios.post(endpoint, null, { params });
    if (data.access_token && data.expires_in) {
      this.cachedAccessToken = data.access_token as string;
      const expiresInMs = Number(120) * 1000;
      this.tokenExpiresAthMs = Date.now() + expiresInMs;
      return this.cachedAccessToken;
    }
    throw new Error('Failed to obtain access token from Zoho');
    } catch (error) {
      throw new Error('Invalid token response from Zoho')
    }
  }
}


