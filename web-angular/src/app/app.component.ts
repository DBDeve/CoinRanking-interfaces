import { Component,Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { map, timestamp } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatCardModule} from '@angular/material/card';

import { AgCharts } from 'ag-charts-angular';
import { AgChartOptions } from 'ag-charts-community';


@Component({
  selector: 'app-root',
  imports: [CommonModule,MatGridListModule,MatCardModule,AgCharts],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})

export class AppComponent {
  title = 'web-angular';

  startIndex = 1;
  endIndex = 13;

  IncreaseIndex(){
    this.startIndex += 1;
    this.endIndex += 1;
    console.log(this.startIndex,this.endIndex);
  }

  DecreaseIndex(){
    this.startIndex -= 1;
    this.endIndex -= 1;
    console.log(this.startIndex,this.endIndex);
  }

  chartOptions: AgChartOptions = {}

  constructor (private http: HttpClient,  ) {

  }

  coinlist:Array<any> = [];

  selectedCoin: { [key: string]: any } = {};

  chartData:[{[key: string]: any}] = [{}]

  headers = new HttpHeaders(
    {
      'Content-Type': 'application/json',
      'x-access-token': 'coinrankingee224b7b7075079f4747a5ba3b93cb3884bdcfe0c213d28d',
    }
  )

  options = { headers: this.headers };

  uuid = 'Qwsogvtv82FCd';

  timeset='24h';

  

  selectCoin(uuid:any,timeset:any){
    console.log('selected coin', uuid);
    this.http.get(`https://api.coinranking.com/v2/coin/${uuid}`,this.options)
    .pipe(
      map((data:any) => {
        console.log(data);
        return data.data.coin;}),
      map((coin:any) => {
        return {
          name: coin.name,
          symbol: coin.symbol,
          color: coin.color,
          icon: coin.iconUrl,
          liks: coin.links,
          change: coin.change,
          price: coin.price,
          '24hVolume': coin['24hVolume'],
          mostHingPrice:coin.allTimeHigh.price,
          marketcap:coin.marketCap,
          circulatingOffer:coin.supply.circulating,
          totalOffer:coin.supply.total,
          maxOffer:coin.supply.max
        };
      })
    )
    .subscribe((data) => {
      console.log('unique data',data);
      this.selectedCoin = data;
      console.log('select coin',this.selectedCoin);
    });

    this.http.get(`https://api.coinranking.com/v2/coin/${uuid}/history?timePeriod=${timeset}`,this.options)
    .subscribe((data:any)=>{
      console.log('dataaaa ',data.data.history)
      this.chartData=data.data.history
      this.chartOptions = {
        data: data.data.history,
        width: 800,
        height: 400,
        series: [{ 
          type: 'line',
          xKey: 'price', 
          yKey: 'timestamp' 
        }] 
      };
      console.log('timestamp data=',data)
      console.log('chartdata= ', this.chartData)
      console.log('chart: ',this.chartOptions.data)
    }
  )
  }

  ngOnInit() {
    this.http.get('https://api.coinranking.com/v2/coins',this.options)
    .pipe(
      map((data:any) => {
        console.log(data);
        return data.data.coins;}),
      map((coins:any) => {
        return coins.map((coin:any) => {
          return {
            uuid: coin.uuid,
            name: coin.name,
            symbol: coin.symbol,
            color: coin.color,
            sparkline: coin.sparkline,
            icon: coin.iconUrl,
          };
        });
      })
    )
    .subscribe((data) => {
      console.log('list data',data);
      this.coinlist = data;
    });

    this.selectCoin(this.uuid,this.timeset);
  }

  
}
