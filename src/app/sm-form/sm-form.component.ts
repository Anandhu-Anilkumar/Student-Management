import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sm-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatSelectModule,
    MatRadioModule,
    MatCheckboxModule,
    MatAutocompleteModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule,],
  templateUrl: './sm-form.component.html',
  styleUrl: './sm-form.component.scss'
})
export class SmFormComponent implements OnInit {
  public studentForm!: FormGroup;
  public students: any[] = [
    {
        "name": "433",
        "gender": "Male",
        "course": "Arts",
        "hobbies": [
            "Reading"
        ],
        "city": "Kochi"
    },
    {
        "name": "ewtew",
        "gender": "Female",
        "course": "Arts",
        "hobbies": [
            "Sports",
            "Music"
        ],
        "city": "Mumbai"
    }
  ];
  public editingIndex!: number;
  public courses: string[] = ['Science', 'Commerce', 'Arts'];
  public hobbies: string[] = ['Reading', 'Sports', 'Music'];
  public filteredOptions: string[] = ['Kochi', 'Delhi', 'Mumbai'];

  constructor(private _fb: FormBuilder) { }

  ngOnInit(): void {
    this.studentForm = this._fb.group({
      name: ['', Validators.required],
      gender: ['', Validators.required],
      course: ['', Validators.required],
      hobbies: [[]],
      city: [''],
    });
  }

  hobbyCheckboxSelection(checkedStatus: boolean, hobby: string) {
    if (checkedStatus) {
      this.studentForm.value.hobbies.push(hobby);
    } else {
      const existingHobbies: string[] = this.studentForm.value.hobbies.filter((item: string) => item !== hobby);
      this.studentForm.get('hobbies')?.setValue(existingHobbies);
    }
  }

  submitForm() {
    if (this.editingIndex >= 0) {
      this.students[this.editingIndex] = this.studentForm.value;
    } else {
      this.students.push(this.studentForm.value);
      console.log(this.students);

    }
    this.studentForm.reset();
  }

  editStudent(index: number) {
    this.studentForm.setValue(this.students[index]);
    this.editingIndex = index;
  }

  deleteStudent(index: number) {
    this.students.splice(index, 1);
    if (this.editingIndex === index) {
      this.studentForm.reset();
    }
  }
}
