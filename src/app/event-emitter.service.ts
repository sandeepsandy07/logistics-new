import { Injectable, EventEmitter } from '@angular/core';    
import { Subscription } from 'rxjs/internal/Subscription'; 

@Injectable({
  providedIn: 'root'
})
export class EventEmitterService {


  //invokeFirstComponentFunction is eventEmitter Variable, subsvar is subscription variable.
  //“invokeFirstComponentFunction” variable will be used in another method “onFirstComponentButtonClick” to emit the event 
  //and “subsVar” will be used later in event subscription.
  //We can go to “second.component.ts” component and create an event emitter service variable in the constructor. We will also create a function to invoke the EventEmitter method in service.

  invokeFirstComponentFunction = new EventEmitter();    
  subsVar!: Subscription; 
  invokeNonBillComponentFunction = new EventEmitter();
  nonBillVar !: Subscription;
  constructor() { }

  onFirstComponentButtonClick() {    
    this.invokeFirstComponentFunction.emit();    
  } 

  onNonBillFormButtonClick()
  {
    this.invokeNonBillComponentFunction.emit();
  }
}
