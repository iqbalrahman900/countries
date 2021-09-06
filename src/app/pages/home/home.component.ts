import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { Country } from 'src/app/types/api';
import { Chart, registerables } from 'chart.js';
import { map } from 'rxjs/operators'
import { connectableObservableDescriptor } from 'rxjs/internal/observable/ConnectableObservable';
import { Subject } from 'rxjs';


const REGION_OPTIONS = ['Africa', 'Americas', 'Asia', 'Europe', 'Oceania'];

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  chart:any;
  private source!: Country[];
  searchFilter?: string;
  regionFilter?: string;
  regionOptions = REGION_OPTIONS;
  iqbalchart : any;
  stored_data: any;

  map:any;
 
  
  exampleArray: Array<{name: string, population: number}> = [];
  
  update$: Subject<any> = new Subject();
  // var exampleArray: {  name: string, population : number }[] = [];
   
  constructor(private api: ApiService) {}
  
  
  onChangeCountry($event: any){
    const name = $event.target.value;
    const isChecked = $event.target.checked;
    // console.log(  name , isChecked);
    // console.log (this.countries);
    this.countries.map((d) =>
    {
      // console.log(name);
      // console.log(d.name);
      if (d.name===name){
 
        if(isChecked){
          console.log("masuk");
         
          this.exampleArray = [ 
            ...this.exampleArray,
            ...[ { name: d.name,  population: d.population }] ];
            console.log(this.exampleArray);

            localStorage["this.exampleArray"] = JSON.stringify(this.exampleArray);
            this.stored_data = JSON.parse(localStorage["this.exampleArray"]);
        } 
        else{
          console.log("delete");
           this.exampleArray = [...this.exampleArray.filter(d =>d.name !== name )];
           console.log(this.exampleArray);
        }
        
        // console.log("x lalu ke ?");
        //  console.log(d);
        //  console.log(c);
        //  c.push(d);
        // console.log(this.exampleArray);
        //  localStorage["this.exampleArray"] = JSON.stringify(this.exampleArray);
        //  var stored_datas = JSON.parse(localStorage["this.exampleArray"]);
          
      }

      // console.log("iqbal");
     
      // this.loadchart();
    });
    this.loadchart();
      // conthis.loadchart();sole.log(this.country2);
  }
  iqbal(){
    this.stored_data = JSON.parse(localStorage["this.exampleArray"]);
  }
  

  ngOnInit(): void {
    this.api.getAllCountries().subscribe((countries) => {
      this.source = countries;
    });
    this.chart = document.getElementById('my_first_chart');
    Chart.register(...registerables);
 
    this.iqbal();
    this.loadchart();
  }

  
  loadchart(){
    console.log(this.chart);
    if(this.iqbalchart){
       this.iqbalchart.destroy();
      // this.updateChart();
    }
    // console.log(this.exampleArray);
    // console.log("parween");
    // console.log(this.exampleArray.map(d=> d.population));
    const arrChart = [...this.stored_data]
    
   this.iqbalchart = new Chart (this.chart, {
      type:'bar',
      data:{
        
        datasets: [{
          // data:[30,40,50,80,60],
          barPercentage: 0.5,
          minBarLength: 2,
          data:arrChart.map(d => d.population) ,

          label: 'Population of Country' ,
          backgroundColor: [
            'red',
            'blue',
            'orange',
            'rgba(75, 192, 192, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(201, 203, 207, 0.2)'
          ],
          
        
          borderColor: '#007bff'
         
        },
      ],
      labels:arrChart.map(d => d.name) ,
      },

      options: {
        indexAxis: "y",
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
    });
    
  }

  

  get countries() {
    return this.source
      ? this.source
          .filter((country) =>
            this.searchFilter
              ? country.name
                  .toLowerCase()
                  .includes(this.searchFilter.toLowerCase())
              : country
              // tambah background
          )
          .filter((country) =>
            this.regionFilter
              ? country.region.includes(this.regionFilter)
              : country
          )
      : this.source;
  }
  
  updateChart(){
    this.update$.next(true);
}

}


