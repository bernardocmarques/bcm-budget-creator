import { Injectable } from '@angular/core';

declare let $;

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  public showAlert(title: string, message: string, type: string, duration?: number): void {
    $('#' + type + 'Alert' + ' .alert-title').text(title);
    $('#' + type + 'Alert' + ' .alert-text').text(message);
    const alert = $('#' + type + 'Alert');
    alert.addClass('hidden');
    alert.removeClass('hidden');
    window.setTimeout(() => alert.addClass('hidden'), duration ? duration : 5000);
  }

}
