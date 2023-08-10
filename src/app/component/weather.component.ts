import { Weather } from './../models/weather';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { WeatherService } from '../services/weather.service';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-weather',
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.css']
})
export class WeatherComponent implements OnInit, OnDestroy {

  form!: FormGroup;
  city!: string;
  subscription$!: Subscription;

  model = new Weather("Singappore", 0,0,0,"",0,0);
  OPEN_WEATHER_API_KEY = "476e23fe1116f4e69d2a3e68672604e1"

  constructor(private fb: FormBuilder, private weatherSvc : WeatherService){

  }

  searchWeather() {
    console.log("search weather");

    // sets form value of city in city attribute
    this.city = this.form.value['city']
    console.log(this.city);
    // this.weatherSvc.getWeather(this.city, this.OPEN_WEATHER_API_KEY)
    //   .then((result)=>
    //   {this.model = new Weather(
    //     this.city, result.main.temp,
    //     result.main.pressure,
    //     result.main.humidity,
    //     result.weather[0].description,
    //     result.wind.deg,
    //     result.wind.speed
    //   )})
    //   .catch((error) => {
    //     console.error(error)
    //   });
    this.subscription$ = this.weatherSvc
      .getWeatherUsingObservable(this.city, this.OPEN_WEATHER_API_KEY)
      .subscribe((result)=> {
        this.model = new Weather(
          this.city, result.main.temp,
          result.main.pressure,
          result.main.humidity,
          result.weather[0].description,
          result.wind.speed,
          result.wind.deg
        )
      })


  }

  ngOnDestroy(): void {
    this.subscription$.unsubscribe();
  }

  ngOnInit(): void {
    // initialises form on initialisation
    this.form = this.createForm();
  }

  private createForm(): FormGroup {
    return this.fb.group({city: this.fb.control<string>('', [Validators.required])})
  }

  resetForm() {
    // resets the form with empty
    this.form = this.createForm();
  }

}
