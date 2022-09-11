import {Version} from './version.js';


export class VersionVector{
    constructor(siteId){
        this.versions = [];
        this.localVersion = new Version(siteId);
        this.versions.push(this.localVersion);
    }
}