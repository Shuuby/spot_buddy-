import { Component, OnInit } from '@angular/core';
import { DaysService } from '../days.service';

@Component({
  selector: 'app-day',
  templateUrl: './day.component.html',
  styleUrls: ['./day.component.css']
})
export class DayComponent implements OnInit {

  constructor(private daysService: DaysService) { }

  count = 0;
  data = {};
  days = [];

  weekday = {
    1 : "Monday",
    2 : "Tuesday",
    3 : "Wednesday",
    4 : "Thursday",
    5 : "Friday", 
    6 : "Saturday",
    7 : "Sunday"
  }

  starting = {
    "Squats" : [135, 5], 
    "Incline Dumbbell Press" : [25, 5],
    "Deadlift" : [135, 5],
  }

  increase = {
    "Squats": 20,
    "Deadlift": 20
  }

  selectedDay? : string;
  selectedExercises = null;
  selectedSets = {};
  selectedSet = null;
  selectedSetDay? : string;
  addExercise? : boolean;
  prevExercise? : string;
  prevDay? : string;

  ngOnInit(): void {
    this.getDays();
  }

  getDays(): void {
    //this.heroes = this.heroService.getHeroes();
    this.daysService.getDays().subscribe(data => 
      {
        this.data = data; 
        this.days = [];
        for (let key in data) {
          this.days.push(key);
        }
        this.sortDates();
        this.getChoices();
      }
    );
  }

  getChoices(): void {
    this.daysService.getChoices().subscribe(data => {
      this.count = data.count;
      this.selectedSetDay = data.setDay;
      this.selectedDay = data.day;
      this.selectedExercise = data.exercise; 
      this.prevExercise = data.exercise;
      if(this.selectedDay){
        this.OnSelect(this.selectedDay);
        if(this.selectedExercise){
          this.OnSelectExercise(this.selectedExercise, true);
        }
      }
    })
  }

  OnSelect(day: string): void {
    this.selectedDay = day;
    for(var i = 0; i < this.days.length; i++){
      if(this.days[i] == this.selectedDay){
        this.selectedExercises = [];
        this.selectedSets = [];
        for(var exercise in this.data[this.selectedDay].Exercises){
          this.selectedExercises.push(exercise);
          this.selectedSets[exercise] = this.data[this.selectedDay].Exercises[exercise]
        }
        break;
      }
    }
    this.prevDay = this.selectedDay;
    this.updateChoices();
  }

  selectedExercise? : string; 
  OnSelectExercise(exercise: string, refresh: boolean): void { 
    this.selectedExercise = exercise; 
    this.selectedSet = this.data[this.selectedDay].Exercises[exercise]
    if(!refresh){
      this.selectedSetDay = this.selectedDay;
      this.selectedSet = this.data[this.selectedDay].Exercises[exercise]
    }
    else{
      this.selectedSet = this.data[this.selectedSetDay].Exercises[exercise]
    }
    this.prevExercise = exercise;
    this.updateChoices();
  }
  
  OnSetChange(): void{
    this.data[this.selectedDay].Exercises[this.selectedExercise] = this.selectedSet;
    console.log("hello");
  }

  OnDayChange(): void{
    let temp = this.data[this.selectedDay].Day
    this.data[this.selectedDay].Day = temp;
  }

  AddSet(): void{
    if(this.selectedSet.length == 0){
      var set = this.selectedExercise in this.increase ? this.starting[this.selectedExercise] : [0,0];
      this.selectedSet = [set];
    }
    else{
      var length = this.selectedSet.length;
      var increase = this.selectedExercise in this.increase ? this.increase[this.selectedExercise] : 0;
      this.selectedSet.push([parseInt(this.selectedSet[length - 1][0]) + increase, parseInt(this.selectedSet[length - 1][1])]);
    }
    this.selectedSets[this.selectedExercise] = this.selectedSet;
    this.data[this.selectedDay].Exercises[this.selectedExercise] = this.selectedSet;
  }

  DeleteSet(index : number): void{
    this.selectedSet.splice(index, 1);
    this.selectedSets[this.selectedExercise] = this.selectedSet;
    this.data[this.selectedDay].Exercises[this.selectedExercise] = this.selectedSet;
  }

  DeleteDay(): void{
    let temp = this.selectedDay;
    this.selectedDay = null;
    this.selectedSet = null;
    this.selectedSetDay = null;
    this.selectedExercises = null;
    delete this.data[temp];
    for(var i = 0; i < this.days.length; i++){
      if(this.days[i] == temp){
        this.days.splice(i, 1);
        break;
      }
    }
    if(this.selectedSetDay == temp){
      this.selectedExercise = null;
    }
  }

  AddExercise(): void{
    var name = "Undefined" + this.count.toString();
    this.count++;
    this.selectedExercises.push(name);
    this.selectedSets[name] = [];
    this.selectedSet = [];
    this.data[this.selectedDay].Exercises[name] = [];
    this.OnSelectExercise(name, false);
  }

  DeleteExercise(): void{
    let temp = this.selectedExercise;
    this.selectedExercise = null;
    delete this.data[this.selectedSetDay].Exercises[temp];
    this.selectedSet = null
    delete this.selectedSets[temp];
    if(this.selectedDay == this.selectedSetDay){
      for(var i = 0; i < this.selectedExercises.length; i++){
        if(temp == this.selectedExercises[i]){
          this.selectedExercises.splice(i, 1);
          break;
        }
      }
    }
    this.selectedSetDay = this.selectedDay;
  }

  OnExerciseChange(): void{
    if(this.selectedDay != this.selectedSetDay){
      this.data[this.selectedSetDay].Exercises[this.selectedExercise] = this.data[this.selectedSetDay].Exercises[this.prevExercise];
      delete this.data[this.selectedSetDay].Exercises[this.prevExercise];
    }
    else{
      for(var i = 0; i < this.selectedExercises.length; i++){
        let exercise = this.selectedExercises[i];
        if(exercise == this.prevExercise){
          this.selectedExercises[i] = this.selectedExercise; 
          this.selectedSets[this.selectedExercise] = this.selectedSets[exercise];
          delete this.selectedSets[exercise];
          this.data[this.selectedDay].Exercises[this.selectedExercise] = this.data[this.selectedDay].Exercises[exercise]
          delete this.data[this.selectedDay].Exercises[exercise];
          break;
        }
      }
    }
    this.prevExercise = this.selectedExercise;
  }

  update(){
    this.sortDates();
    this.daysService.updateData(this.data);
  }

  updateChoices():void {
    if(!this.selectedDay){
      this.selectedDay = "";
    }
    if(!this.selectedExercise){
      this.selectedExercise = "";
    }
    this.daysService.updateChoices(this.count,this.selectedSetDay, this.selectedDay, this.selectedExercise);
  }

  OnDateChange(){
    for(var i = 0; i < this.days.length; i++){
      if(this.days[i] == this.prevDay){
        this.days[i] = this.selectedDay;
        this.data[this.selectedDay] = this.data[this.prevDay];
        delete this.data[this.prevDay];
        this.prevDay = this.selectedDay;
        let date = new Date(this.selectedDay);
        if(!isNaN(date.getTime())){
          this.data[this.selectedDay].Day = this.weekday[date.getDay()];
        }
        else{
          this.data[this.selectedDay].Day = "Not real idiot";
        }
        break;
      }
    }
  }

  AddDay(): void{
    let date = new Date();
    const newDate = (date.getMonth() + 1).toString() + "/" + date.getDate().toString() + "/" + date.getFullYear().toString();
    let dow = this.weekday[date.getDay()];
    this.count++;
    const day = {
      "Day": dow,
      "Exercises": {}
    } 
    this.data[newDate] = day;
    this.days.push(newDate);
    this.OnSelect(newDate);
  }

  sortDates(){
    const sortedAsc = this.days.sort(
      (objA, objB) => new Date(objA).getTime() - new Date(objB).getTime());
    return sortedAsc;
  }

  Save(){
    this.update();
    this.updateChoices();
    console.log("saved");
  }
}
