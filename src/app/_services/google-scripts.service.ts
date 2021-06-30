import { Injectable } from '@angular/core';
import {Budget} from "../_domain/budget";
import {AlertService} from "./alert.service";

@Injectable({
  providedIn: 'root'
})
export class GoogleScriptsService {

  constructor(
    private alertService: AlertService
  ) { }

  // private url = 'https://script.google.com/macros/s/AKfycbwaf7eLNY2tQ5Fuwl0Tu0RxqkGc-2XC-mR1GkEuMumxLTk9uaDLgcVCdA/exec';


  private static httpPost(url: string, data:any) {

    return fetch(url, {
      method: "POST",
      body: JSON.stringify(data)
    });
  }

  generatePDF(templateUrl: string, budget: Budget): Promise<{link: string}> {
    return GoogleScriptsService.httpPost(templateUrl, budget.toBudgetInfoGScripts()).then(res => res.json())
      .then(res => {
        if (res.error)
          this.alertService.showAlert('Error', 'Internal Error - ' + res.error, 'danger');
        return res;
      });
  }
}
