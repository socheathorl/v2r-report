import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, of } from 'rxjs';
import * as _ from 'underscore';

@Injectable({
  providedIn: 'root'
})
export class MasterDataService {
  constructor(private http: HttpClient) { }

  private tenantOptsCache = new Map();
  private cardOptsCache = new Map();

  getTenants() {
    let resp = this.tenantOptsCache.get('tenant-opts');
    if(resp){
      return Promise.resolve(resp) ;
    }

    return this.http.get<any[]>('assets/data/tenants-data.json').toPromise().then(res => {
      let result = (res || []).map(r => {
        return {
          value: r.TenantId,
          label: r.Tenant
        };
      });

      result = _.sortBy(result, 'label');
      this.tenantOptsCache.set('tenant-opts', result)
      return result;
    });
  }

  getCards() {
    let resp = this.cardOptsCache.get('card-opts');
    if(resp){
      return Promise.resolve(resp);
    }

    return this.http.get<any[]>('assets/data/cards-data.json').toPromise().then(res => {
      let result = (res || []).map(r => {
        return {
          value: r.CardCd,
          label: r.CardNumber,
          text: r.CardName
        };
      });

      result = _.sortBy(result, 'label');
      this.tenantOptsCache.set('card-opts', result)
      return result;
    });
  }
}
