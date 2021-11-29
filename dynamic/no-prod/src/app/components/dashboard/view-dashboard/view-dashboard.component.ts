import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  TemplateRef,
} from "@angular/core";
import { BackendService } from "src/app/backend.service";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { FormBuilder } from "@angular/forms";
import * as XLSX from "xlsx";
import * as $ from "jquery";
import { BsModalService, BsModalRef } from "ngx-bootstrap/modal";
import { FormControl } from "@angular/forms";
import swal from 'sweetalert2';


@Component({
  selector: "app-view-dashboard",
  templateUrl: "./view-dashboard.component.html",
  styleUrls: ["./view-dashboard.component.css"],
})
export class ViewDashboardComponent implements OnInit {
  Dated: any;
  userModel = this.fb.group({
    result: [""],
    projectID: [""],
    projectID1: [""],


  });
  userid = this.fb.group({
    SelectedDate: "",
    SelectedDate1: "",
    EndDate2:""

  });
  selectedDate;
  selectedDate1;
  EndDate2;
  users = [];
  allKeys = [];
  displayedColumns1 = ["projectID", "audioname", "audiolink", "Date"];
  ID;
  isSlideChecked = false;
  loading: any = true;
  displayedColumns = [];
  dataSource: any;
  dataSource1: any;
  modalRef?: BsModalRef;
  playing:any;
  duratime:any;
  timer:any;
  ID1;
  @ViewChild("TABLE") table: ElementRef;
  audioElement:any;
  currentTIme:any;
  audiotitle:any;
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  @ViewChild("paginator2") paginator2: MatPaginator | undefined;
  // @ViewChild(MatSort, { static: false }) sort1!: MatSort;
  @ViewChild("sortCol2") sortCol2: MatSort | undefined;
  constructor(
    private fb: FormBuilder,
    private service: BackendService,
    private modalService: BsModalService
  ) {}
  Audio = this.fb.group({
    audio: '',
  });
  durationfb = this.fb.group({
    duration: '',
    poistion1: '',
  });
  formatSecondsAsTime(secs:any) {
    var hr  = Math.floor(secs / 3600);
    var min :any = Math.floor((secs - (hr * 3600))/60);
    var sec :any= Math.floor(secs - (hr * 3600) -  (min * 60));

    if (min < 10){
      min = "0" + min;
    }
    if (sec < 10){
      sec  = "0" + sec;
    }

    return min + ':' + sec;
  }
  changepoistion() {
    this.currentTIme = this.formatSecondsAsTime(this.audioElement.currentTime)
    let poistion = 0;
     poistion = this.audioElement.currentTime * (100 / this.audioElement.duration);
     this.durationfb.patchValue({
      poistion1:poistion
    })
  }
  changeduration() {
    this.durationfb.value.poistion1 = this.audioElement.duration * (this.durationfb.value.poistion1 / 100);
    this.audioElement.currentTime = this.durationfb.value.poistion1;
    this.changepoistion();
    console.log(this.durationfb.value.poistion1,);

  }
  audiochange() {
    console.log(this.Audio.value);
    this.audioElement.volume = this.Audio.value.audio / 100;
  }
  ngOnInit() {
    this.userid.patchValue({
      SelectedDate: new Date(),
      SelectedDate1: new Date(),
      EndDate2: new Date()
    });
    var y = this.userid.value.SelectedDate;
    y.setHours(0, 0, 0, 0);
    var x =this.userid.value.EndDate2
    x.setDate(y.getDate() + 1)
    this.selectedDate = y.toISOString();
    this.selectedDate1 = y.toISOString()
    this.EndDate2 =x.toISOString()
    this.service.getprojectID().subscribe(
      (success) => {
        this.ID = success.data.projectID;
      },
      (error) => {
        console.log(error);
      }
    );
    this.service.getprojectID1().subscribe(
      (success) => {
        this.ID1 = success.data.projectID;
      },
      (error) => {
        console.log(error);
      }
    );
    this.audioElement = document.createElement('audio');
    this.Audio.patchValue({
      audio:50
    })
  }
  cop(A) {
    console.log(A);
  }
  closeForm() {
    this.justplay();
    clearInterval(this.timer);

    }
  hideForm() {
    console.log(1);
  }
  confirmBox(a){

    swal.fire({

      title: 'Are you sure want to remove ProjectID?',

      text: `You will not be able to recover this ${a} !`,

      icon: 'warning',

      showCancelButton: true,

      confirmButtonText: 'Yes, delete it!',

      cancelButtonText: 'No, keep it'

    }).then((result) => {

      if (result.value) {
        this.service.deleteProjectID(a).subscribe(
          (success) => {
            if(success.success){
              this.service.getprojectID().subscribe(
                (success) => {
                  this.ID = success.data.projectID;
                },
                (error) => {
                  console.log(error);
                }
              );
              swal.fire(

                'Deleted!',

                'Your ProjectID has been deleted.',

                'success'

              )
            }else{
              swal.fire(

                'Error',

                'Try agian :(',

                'error'

              )
            }

          },
          (error) => {
            console.log(error);
          }
        );


      } else if (result.dismiss === swal.DismissReason.cancel) {

        swal.fire(

          'Cancelled',

          'Your Project ID is safe :)',

        )

      }

    })

  }
  openModal(template: TemplateRef<any>,a,b) {
    this.audiotitle=b
    this.modalRef = this.modalService.show(template, {
      class: "modal-dialog-centered",
    });
    this.audioElement.setAttribute('src', a);
    this.audioElement.load();
    this.audioElement.play();
    this.playing=true;
    this.changepoistion()
     this.timer =   setInterval(() => {
      this.changepoistion();
   }, 1000)
  }
  justplay() {
    if (this.playing == true) {
      this.audioElement.pause();
      this.playing = false;

    } else {
      this.audioElement.play();
      this.playing = true;
    }
  }
  ngOnSubmit() {
    this.getdata(this.userModel.value.projectID, this.selectedDate,this.EndDate2);
  }
  ngOnSubmit1() {
    console.log(this.userModel);
    this.getfav(this.userModel.value.projectID1, this.selectedDate1);
  }
  onSelect1() {
    var y = this.userid.value.SelectedDate1;
    y.setHours(0, 0, 0, 0);
    this.selectedDate1 = y.toISOString();
    if (this.userModel.value.projectID != "") {
      this.getfav(this.userModel.value.projectID1, this.selectedDate1);
    }
  }
  onSelect() {
    var y = this.userid.value.SelectedDate;
    var x = this.userid.value.EndDate2;
    y.setHours(0, 0, 0, 0);
    this.selectedDate = y.toISOString();
    this.EndDate2 = x.toISOString();

    if (this.userModel.value.projectID != "") {
      this.getdata(this.userModel.value.projectID, this.selectedDate,this.EndDate2);
    }
  }
  toggleChanges($event) {
    this.isSlideChecked = $event.checked;
  }
  exportToExcel() {
    if (this.isSlideChecked == false) {
      const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.users);
      /* generate workbook and add the worksheet */

      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      var wscols = this.autofitColumns(this.users);

      ws["!cols"] = wscols;
      console.log(wscols);
      XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

      //  fitting auto columns

      /* save to file */
      var file = `ExcelSheet${Date.now()}.xlsx`;
      XLSX.writeFile(wb, file);
    } else {
      const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(
        document.getElementById("dd")
      ); //converts a DOM TABLE element to a worksheet
      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      var wscols = this.autofitColumns(this.users);

      ws["!cols"] = wscols;
      XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

      /* save to file */
      var file = `ExportsortSheet${Date.now()}.xlsx`;

      XLSX.writeFile(wb, file);
    }
  }
  private autofitColumns(json: any[], header?: string[]) {
    const jsonKeys = header ? header : Object.keys(json[0]);

    let objectMaxLength = [];
    for (let i = 0; i < json.length; i++) {
      let value = json[i];
      for (let j = 0; j < jsonKeys.length; j++) {
        if (typeof value[jsonKeys[j]] == "number") {
          objectMaxLength[j] = 10;
        } else {
          const l = value[jsonKeys[j]] ? value[jsonKeys[j]].length : 0;

          objectMaxLength[j] = objectMaxLength[j] >= l ? objectMaxLength[j] : l;
        }
      }

      let key = jsonKeys;
      for (let j = 0; j < key.length; j++) {
        objectMaxLength[j] =
          objectMaxLength[j] >= key[j].length
            ? objectMaxLength[j]
            : key[j].length;
      }
    }

    const wscols = objectMaxLength.map((w) => {
      return { width: w };
    });

    return wscols;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  getdata(a, b,c) {
    this.service.getapidetails(a, b,c).subscribe(
      (success) => {
        this.dataSource = new MatTableDataSource(success["data"]);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.users = success.data;
        console.log(this.users);

        if (this.users.length != 0) {
          this.allKeys = Object.keys(this.users[this.users.length - 1]);
          this.displayedColumns = Object.keys(
            this.users[this.users.length - 1]
          );
          this.loading = false;
        } else {
          this.loading = true;
        }
      },
      (error) => {
        console.log(error);
        this.dataSource = new MatTableDataSource([]);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }
    );
  }

  getfav(a,b) {
    console.log(a,b);

    this.service.getaudio(a,b).subscribe((result) => {
      this.dataSource1 = new MatTableDataSource(result.data);
      this.dataSource1.paginator = this.paginator2;
      this.dataSource1.sort = this.sortCol2;
    });
  }
  ngOnDestroy() {
    this.audioElement.pause();
    this.playing=false;
    console.log(this.playing);

   }
}
