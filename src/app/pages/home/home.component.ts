import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Folders } from 'src/app/models/folder';
// import { folders } from 'db';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit{
  blockStyle = {}
  folderNames: string = "Home"
  folders: Folders[] = []
  path: string = "";
  data: Folders[] = []
  deleteIndex: number = 0


  @ViewChild('contextDelete') contextDelete!: ElementRef
  @ViewChild('span') span!:ElementRef
  @ViewChild('input') valueInput!:ElementRef
  
  constructor(){}

  ngOnInit(): void {
    let item = localStorage.getItem('folders')
    if(item){
      this.data = JSON.parse(item)
      this.folders = this.data
    }
  }
  //context menu & PopUp
  contextMenu(e: MouseEvent){
    e.preventDefault()
    this.closeContext()
    this.span.nativeElement.style.top = e.pageY + "px"
    this.span.nativeElement.style.left = e.pageX + "px"
    this.span.nativeElement.style.display = "block"
  }

  closeContext(){
    this.span.nativeElement.style.display = "none"
    this.contextDelete.nativeElement.style.display = "none"
  }
  dblClick(item:Folders){
    this.path = item.path
    this.folderNames += ` / ${item.name}`
    this.data = this.getFolder()
  }
  openPopup(){
    this.blockStyle = {
      visibility: "visible",
      transform: "scale(1)",
      top: "0"
    }
  }
  closePopup(){
    this.blockStyle = {
      visibility: "hidden",
      transform: "scale(0.1)",
      top: "-100%"
    }
  }


  //Folders
  saveFolder(){          
        const obj: Folders = {
          id: this.data.length + 1,
          name: this.valueInput.nativeElement.value ? this.valueInput.nativeElement.value : "New Folder",
          path: this.path + `/${this.data.length + 1}`,
          icon: "../assets/images/folder2.png",
          subFolder: []
        }
        
        let currentLevel = this.getFolder()
        currentLevel.push(obj)   

        localStorage.setItem('folders', JSON.stringify(this.folders))  
        this.data = this.getFolder() 
        this.closePopup()
        this.valueInput.nativeElement.value = ""
  }
 
  getFolder(): Folders[]{
    const path = this.path.split('/')
    path.shift()
    let currentLevel = this.folders
        for (const i of path) { 
        let found = currentLevel.find(item => item.id == i);
          if (found) {
            currentLevel = found.subFolder;
          }
    }
    return currentLevel
  }

  locationPrew(e: MouseEvent){
    e.preventDefault()
    if(this.path){
      let lastInd = this.folderNames.lastIndexOf('/')
      this.folderNames  = this.folderNames.substring(0, lastInd)

      let lastIndex = this.path.lastIndexOf("/");
      this.path = this.path.substring(0, lastIndex) 
      this.data = this.getFolder()
    }
    
  }

  deleteMenu(e: MouseEvent,  i: number){
    e.preventDefault()
    e.stopPropagation()
    this.closeContext()
    this.contextDelete.nativeElement.style.top = e.pageY + "px"
    this.contextDelete.nativeElement.style.left = e.pageX + "px"
    this.contextDelete.nativeElement.style.display = "block"
    this.deleteIndex = i
  }

  deleteFolder(){
    let currentLevel = this.getFolder()
    currentLevel.splice(this.deleteIndex, 1)
    localStorage.setItem('folders', JSON.stringify(this.folders))   

  }

  
}


