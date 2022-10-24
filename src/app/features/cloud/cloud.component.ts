import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MessageService, SelectItem } from 'primeng/api';
import { FileUpload } from 'primeng/fileupload';
import { Product, S3File } from '../../core/models/products';
import { FileService } from '../../core/services/file.service';
import { ProductService } from '../../core/services/product.service';
import * as FileSaver from 'file-saver';

@Component({
  selector: 'app-cloud',
  templateUrl: './cloud.component.html',
  styleUrls: ['./cloud.component.scss']
})
export class CloudComponent implements OnInit {
  constructor(
    private productService: ProductService,
    private http: HttpClient,
    private fileService: FileService,
    private messageService: MessageService,
  ) { }

  files: S3File[] = [];
  rawFiles: S3File[] = [];
  fileSkeleton: S3File[] = [];
  selectedFile: string = '';
  layout: string = 'grid';
  @ViewChild("dataview") private dataview!: DataView;
  @ViewChild("uploadFile") private uploadFile!: FileUpload;
  loading: boolean = true;
  rows: number = 12;
  fileCache = new Map();
  loadingUpload: boolean = false;
  uploadIcon: string = "pi pi-cloud-upload";
  loadingDelete: boolean = false;
  loadingDownload: boolean = false;

  ngOnInit(): void {
    this.layout = sessionStorage.getItem('dataview-layout') || 'grid';
    this.loadingIndicator();
    this.getData();
  }

  loadingIndicator() {
    this.loading = true;
    let fileSkeleton: S3File[] = [];
    for (let index = 0; index < this.rows; index++) {
      let file: S3File = {
        Key: '',
        LastModified: new Date(),
        Size: 0
      };
      fileSkeleton.push(file);
    }
    this.fileSkeleton = [...fileSkeleton];
  }

  getData() {
    this.http.get<any>(`https://dm89jr0mw4.execute-api.ap-southeast-1.amazonaws.com/dev/data`).subscribe(res => {
      this.rawFiles = JSON.parse(JSON.stringify(res.data));
      this.files = JSON.parse(JSON.stringify(res.data));
      this.loading = false;
    });
  }

  onChangeLayout(event: any) {
    sessionStorage.setItem('dataview-layout', event.layout);
  }

  onSearch(event: any) {
    let searchKey = event.target.value;
    if(searchKey) {
      this.files = JSON.parse(JSON.stringify(this.rawFiles.filter(f => f.Key?.includes(searchKey))));
    } else {
      this.files = JSON.parse(JSON.stringify(this.rawFiles));
    }
  }

  onUploadHandler(event: any) {
    this.loadingUpload = true;
    this.uploadIcon = "pi pi-spin pi-spinner";
    let file: File = event.files[0];

    if(this.fileService.allowImageMimeType.indexOf(file.type) === -1) {
      // validate file type
      this.messageService.add({severity:'warn', summary: 'Invalid file!', detail: `Allow only type: ${this.fileService.allowImageMimeType.join(', ')}.`, life: 15000});
      this.uploadFile.clear();
      this.loadingUpload = false;
      this.uploadIcon = "pi pi-cloud-upload";
      return;
    }

    this.fileService.uploadFile(event.files[0]).subscribe(upload => {
      upload.subscribe((res: any) => {
        if(res.statusCode >= 400) {
          this.messageService.add({severity:'error', summary: 'Error!', detail: res.message, life: 15000});
        } else {
          this.messageService.add({severity:'success', summary: 'Success!', detail: `Upload success.`, life: 15000});
          this.rawFiles = [...this.rawFiles, res.data];
          this.files = [...this.files, res.data];
        }
        this.uploadFile.clear();
        this.loadingUpload = false;
        this.uploadIcon = "pi pi-cloud-upload";
      }, (err: any) => {
        this.uploadFile.clear();
        this.loadingUpload = false;
        this.uploadIcon = "pi pi-cloud-upload";
      });
    });
  }

  onDelete(event: any) {
    this.loadingDelete = true;
    this.selectedFile = event.Key;
    let key = event.Key.replace('/', '+');
    this.http.delete<any>(`https://dm89jr0mw4.execute-api.ap-southeast-1.amazonaws.com/dev/data/${key}`).subscribe(res => {
      if(res.statusCode >= 400) {
        this.messageService.add({severity:'error', summary: 'Error!', detail: res.message, life: 15000});
      } else {
        this.messageService.add({severity:'success', summary: 'Success!', detail: `Delete success.`, life: 15000});
        this.rawFiles = JSON.parse(JSON.stringify(this.rawFiles.filter(f => f.Key !== res.key)));
        this.files = JSON.parse(JSON.stringify(this.files.filter(f => f.Key !== res.key)));
      }
      this.loadingDelete = false;
    });
  }

  onDownload(event: any) {
    this.loadingDownload = true;
    this.selectedFile = event.Key;
    let key = event.Key.replace('/', '+');
    this.http.get<any>(`https://dm89jr0mw4.execute-api.ap-southeast-1.amazonaws.com/dev/data/${key}`).subscribe(res => {
      if(res.statusCode >= 400) {
        this.messageService.add({severity:'error', summary: 'Error!', detail: res.message, life: 15000});
      } else {
        let content: string = atob(res.content);
        let blob = new Blob([`${content}`], {type: `${res.contentType};charset=utf-8`});
        FileSaver.saveAs(blob, res.filename);
      }
      this.loadingDownload = false;
    });
  }
}
