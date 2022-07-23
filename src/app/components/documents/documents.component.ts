import { Component, OnInit } from '@angular/core';
import { DocumentsService } from 'src/app/services/documents/documents.service';
import { StudentService } from 'src/app/services/student/student.service';

@Component({
  selector: 'app-documents',
  templateUrl: './documents.component.html',
  styleUrls: ['./documents.component.css']
})
export class DocumentsComponent implements OnInit {

  studentsList: any;
  selectedStudent: any;
  searchText;
  activeTab = 1;
  fileUrl;
  currentUser;
  adminRole = false;
  documentsList;

  constructor(
    private studentService: StudentService,
    private documentsService: DocumentsService
  ) { }

  ngOnInit() {

    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));

    if (this.currentUser.roles == 'ROLE_ADMIN') {
      this.adminRole = true;
      this.getStudentList();
    } else if (this.currentUser.roles == 'ROLE_STUDENT') {
      this.selectedStudent = this.currentUser.id;
    }
    this.getDocumentsList();
  }

  getStudentList() {
    this.studentService.getStudents().subscribe((resp) => {
        this.studentsList = resp.content;
      }
    );
  }

  getDocumentsList() {
    this.documentsService.getDocuments().subscribe((resp) => {
        this.documentsList = resp;
      }
    );
  }

  getDocument(name: any) {
    this.documentsService.getDocument(name);
  }

  changTab(activeTab: any) {
    this.activeTab = activeTab;
  }

  getReports() {
    this.documentsService.getReports(this.selectedStudent);
  }

}
