import { Component, OnInit, Input } from '@angular/core';


@Component({
  selector: 'app-charts',
  templateUrl: './charts.component.html',
  styleUrls: ['./charts.component.css']
})
export class ChartsComponent implements OnInit {
  @Input() info?: any;
  @Input() exercise?: string;

  public options: any;

  data = [
      {
          quarter: 'Q1',
          spending: 700,
      },
      {
        quarter: 'Q1',
        spending: 800,
     },
      {
          quarter: 'Q2',
          spending: 600,
      },
      {
          quarter: 'Q3',
          spending: 560,
      },
      {
          quarter: 'Q4',
          spending: 450,
      },
  ];

  constructor() {
      this.options = {
        data: this.data,
        series: [{
            type: 'scatter', //I cannot believe this is it 
            marker: {
              shape: 'circle',
              size: 6,
              maxSize: 30,
              fill: '#FFC0CB',
              stroke: '#9f4e4a',
            },
            xKey: 'quarter',
            yKey: 'spending',
        }],
        legend:{
          enabled: false
        }
      };
  }
  ngOnInit(): void {

  }


}
