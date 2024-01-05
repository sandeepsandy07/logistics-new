import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, FormControl, Validators, UntypedFormArray } from '@angular/forms';

@Component({
  selector: 'app-bill',
  templateUrl: './bill.component.html',
  styleUrls: ['./bill.component.css']
})
export class BillComponent implements OnInit {

  public usersForm!: UntypedFormGroup;

  constructor(private fb: UntypedFormBuilder) { }

  ngOnInit() :void {
    this.usersForm = this.fb.group({
      users: this.fb.array([
        this.fb.group({
          gHService: [''],
          quantity: [''],
          startTime: [''],
          endTime: [''],
          remarks: ['']         
        })
      ])
    })
  }

  get userFormGroups () {
    return this.usersForm.get('users') as UntypedFormArray
  }
  
  removeFormControl(i: number) {
    let usersArray = this.usersForm.get('users') as UntypedFormArray;
    usersArray.removeAt(i);
  }

  addFormControl() {
    let usersArray = this.usersForm.get('users') as UntypedFormArray;
    let arraylen = usersArray.length;

    let newUsergroup: UntypedFormGroup = this.fb.group({
          gHService: [''],
          quantity: [''],
          startTime: [''],
          endTime: [''],
          remarks: [''] 
    })

    usersArray.insert(arraylen, newUsergroup);
  }
  onSubmit(){
    console.log(this.usersForm.value);
  }




  

}
