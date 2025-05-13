import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
// import { MatTableDataSource } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { GridData } from '../common-interface';

@Component({
  selector: 'app-sm-form',
  standalone: true,
  imports: [
    AsyncPipe,
    ReactiveFormsModule,
    MatInputModule,
    MatSelectModule,
    MatRadioModule,
    MatCheckboxModule,
    MatAutocompleteModule,
    MatButtonModule
  ],
  templateUrl: './sm-form.component.html',
  styleUrl: './sm-form.component.scss'
})
export class SmFormComponent implements OnInit {
  @Output() formUpdated: EventEmitter<GridData> = new EventEmitter<GridData>();

  @Input() editingIndex: number = -1;
  @Input() studentData!: GridData;

  public studentForm!: FormGroup;
  public filteredOptions!: Observable<string[]>;
  public courses: string[] = ['Science', 'Commerce', 'Arts'];
  public hobbies: string[] = ['Reading', 'Sports', 'Music'];
  public cities: string[] = ['Kochi', 'Delhi', 'Mumbai'];

  constructor(private _fb: FormBuilder) { }

  ngOnInit(): void {
    console.log(this.studentData);
    console.log(this.editingIndex);

    this.setForm();
    this.handleAutoComplete();
  }

  private setForm() {
    this.studentForm = this._fb.group({
      name: ['', Validators.required],
      gender: ['', Validators.required],
      course: ['', Validators.required],
      hobbies: [[]],
      city: ['']
    });
    if (this.editingIndex >= 0) {
      console.log(this.studentData);
      this.studentForm.patchValue({
        name: this.studentData.name,
        gender: this.studentData.gender,
        course: this.studentData.course,
        hobbies: [...this.studentData.hobbies],
        city: this.studentData.city
      });
    }
  }

  private handleAutoComplete() {
    this.filteredOptions = this.studentForm.get('city')!.valueChanges.pipe(
      startWith(''),
      map((value: string) => {
        const filterValue = value ? value.toLowerCase() : '';
        return this.cities.filter((option: string) => option.toLowerCase().includes(filterValue));
      })
    );
  }

  hobbyCheckboxSelection(checkedStatus: boolean, hobby: string) {
    const currentHobbies = [...(this.studentForm.get('hobbies')?.value || [])];
    if (checkedStatus) {
      if (!currentHobbies.includes(hobby)) {
        currentHobbies.push(hobby);
      }
    } else {
      const index = currentHobbies.indexOf(hobby);
      if (index > -1) {
        currentHobbies.splice(index, 1);
      }
    }
    this.studentForm.patchValue({ hobbies: currentHobbies });
  }

  onCitySelected(event: MatAutocompleteSelectedEvent) {
    this.studentForm.patchValue({ city: event.option.value });
  }

  submitForm() {
    if (this.studentForm.valid) {
      this.formUpdated.emit({
        name: this.studentForm.get('name')?.value,
        gender: this.studentForm.get('gender')?.value,
        course: this.studentForm.get('course')?.value,
        hobbies: [...(this.studentForm.get('hobbies')?.value || [])],
        city: this.studentForm.get('city')?.value
      });
    }
  }
}
