import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { RequestService } from 'src/app/service/request.service';
import { CertificateRequest } from 'src/app/domains';

@Component({
  selector: 'app-requests',
  templateUrl: './requests.component.html',
  styleUrls: ['./requests.component.css']
})
export class RequestsComponent implements OnInit {
  selectedRowIndex : number = -1;
  displayedColumns: string[] = ['issuer', 'subject', 'type', 'status'];
  dataSource!: MatTableDataSource<CertificateRequest>;
  valueFromCreateComponent = '';

  all: CertificateRequest[] = [];
  private request = {} as CertificateRequest;

  @ViewChild(MatPaginator) paginator!: any;
  @ViewChild(MatSort) sort!: any;

  constructor(private router: Router, private requestService: RequestService) { }

  ngOnInit(): void {
    this.requestService.getAllRequests().subscribe((res) => {
      for(let i = 0; i<res.totalCount; i++) {
        res.results[i]._id = i+1;
      }
      this.all = res.results;
      this.dataSource = new MatTableDataSource<CertificateRequest>(this.all);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  getRequest(request : CertificateRequest) {
    this.selectedRowIndex=request._id;
    this.request = request;
    const Menu = document.getElementById("menu-container");
    if(Menu != null) Menu.style.display = 'none';
  }

  refuse(){

  }

  accept(){

  }
}
