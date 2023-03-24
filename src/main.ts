import 'zone.js/dist/zone';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { bootstrapApplication } from '@angular/platform-browser';
import { locale } from './data';

type JsonValue = string | number | boolean | null | JsonObject | JsonArray;
interface JsonObject {
  [key: string]: JsonValue;
}
interface JsonArray extends Array<JsonValue> {}

@Component({
  selector: 'my-app',
  standalone: true,
  imports: [CommonModule],
  template: `
    <h1>Hello from {{name}}!</h1>
    <a target="_blank" href="https://angular.io/start">
      Learn more about Angular 
    </a>
  `,
})
export class App implements OnInit {
  
  ngOnInit(): void {
    const x = this.extractValues(locale.data)
    console.log(x)
  }
  name = 'Angular';

  extractValues(
    jsonData: JsonObject,
    parentPath: string = ''
  ): { [key: string]: JsonValue } {
    let values: { [key: string]: JsonValue } = {};
    for (let key in jsonData) {
      let value = jsonData[key];
      let path = parentPath ? parentPath + '.' + key : key;
      if (typeof value === 'object') {
        Object.assign(values, this.extractValues(value as JsonObject, path));
      } else {
        values[path] = value;
      }
    }
    return values;
  }

  createNestedJson(values: { [key: string]: JsonValue }): JsonObject {
    let newObj: JsonObject = {};
    for (let key in values) {
      let path = key.split('.');
      let obj = newObj;
      for (let j = 0; j < path.length - 1; j++) {
        let subKey = path[j];
        if (!obj.hasOwnProperty(subKey)) {
          obj[subKey] = {};
        }
        obj = obj[subKey] as JsonObject;
      }
      obj[path[path.length - 1]] = values[key];
    }
    return newObj;
  }
}

bootstrapApplication(App);
