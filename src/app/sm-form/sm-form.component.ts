import { Component, OnInit } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

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
    MatTableModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './sm-form.component.html',
  styleUrl: './sm-form.component.scss'
})
export class SmFormComponent implements OnInit {
  public studentForm!: FormGroup;
  public editingIndex: number = -1;
  public courses: string[] = ['Science', 'Commerce', 'Arts'];
  public hobbies: string[] = ['Reading', 'Sports', 'Music'];
  public cities: string[] = ['Kochi', 'Delhi', 'Mumbai'];
  public gridColumns: string[] = [];
  public filteredOptions!: Observable<string[]>;
  public gridData!: MatTableDataSource<GridData>;

  constructor(private _fb: FormBuilder) { }

  ngOnInit(): void {
    if (localStorage.getItem('gridData')) {
      this.gridData = new MatTableDataSource(JSON.parse(localStorage.getItem('gridData')!));
    } else {
      this.gridData = new MatTableDataSource([
        { name: 'Arun', gender: 'Male', course: 'Commerce', city: 'Kochi', hobbies: ['Sports'] },
        { name: 'Bharathi', gender: 'Female', course: 'Arts', city: 'Mumbai', hobbies: ['Reading', 'Music'] }
      ]);
    }
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
    this.gridColumns = [...Object.keys(this.studentForm.controls), 'actions'];
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

  private setGridData() {
    localStorage.setItem('gridData', JSON.stringify(this.gridData.data));
    this.editingIndex = -1;
    this.studentForm.reset();
  }

  submitForm() {
    if (this.studentForm.valid) {
      const formValue = {
        name: this.studentForm.get('name')?.value,
        gender: this.studentForm.get('gender')?.value,
        course: this.studentForm.get('course')?.value,
        hobbies: [...(this.studentForm.get('hobbies')?.value || [])],
        city: this.studentForm.get('city')?.value
      };

      if (this.editingIndex >= 0) {
        this.gridData.data[this.editingIndex] = formValue;
        this.gridData.data = [...this.gridData.data];
      } else {
        this.gridData.data = [...this.gridData.data, formValue];
      }
      this.setGridData();
    }
  }

  editStudent(index: number) {
    const student = this.gridData.data[index];
    this.studentForm.patchValue({
      name: student.name,
      gender: student.gender,
      course: student.course,
      hobbies: [...student.hobbies],
      city: student.city
    });
    this.editingIndex = index;
  }

  deleteStudent(index: number) {
    this.gridData.data = this.gridData.data.filter((_, i) => i !== index);
    this.setGridData();
  }

  onCitySelected(event: MatAutocompleteSelectedEvent) {
    this.studentForm.patchValue({ city: event.option.value });
  }
}


interface GridData {
  name: string;
  gender: string;
  course: string;
  city: string;
  hobbies: string[];
}
