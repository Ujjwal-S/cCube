const socket = io();
import {Char} from './lib/char.js';
import {Identifier} from './lib/identifier.js';
import {CRDT} from './lib/crdt.js';
import {Version} from './lib/version.js';
import {VersionVector} from './lib/versionVector.js';

const Range = ace.require('ace/range').Range


function newLine(){
	return editor.session.doc.getNewLineCharacter()
}

function randomSiteId(){
    return Math.floor(Math.random()*100000).toString()
}
let siteID = randomSiteId()
let crdt = new CRDT(siteID)
let versionVec = new VersionVector(siteID)

console.log(versionVec)

// Editor
const editor = ace.edit("editor");

editor.setOptions({
    fontSize: "16px",
    theme: "ace/theme/dracula",
    cursorStyle: "smooth",
    showPrintMargin: false,
    mode: "ace/mode/javascript"
});
// editor.setTheme("ace/theme/eclipse");
let ignoreChanges = false;

editor.session.on('change', function(e) {
    if (!ignoreChanges){
        let lines = e.lines
        let curr_text = lines.join(newLine())
        let start_index = editor.session.doc.positionToIndex(e.start)
        if(e.action === "insert"){
            let end_index = editor.session.doc.positionToIndex(e.end)
    
                    for (let i=start_index, j=0; i<end_index; ++i, ++j){
                        let char = curr_text[j];
                        let saaman = crdt.localInsert(char, i)
                        socket.emit("sendInsert", saaman)
                    }
            
        }
        else if(e.action === "remove"){
                
                for(let i=start_index; i<curr_text.length + start_index; ++i){
                    let saaman = crdt.struct[start_index]
                    crdt.localDelete(start_index)
                    socket.emit("sendDelete", saaman, crdt.counter)
                }
    
        }
    }
    ignoreChanges = false;

});


socket.on("receiveInsert", (saaman) => {
    let identifiers = saaman.position.map((e) => new Identifier(e.digit, e.siteId))

    let char = new Char(saaman.value, saaman.counter, identifiers)
    let ins = crdt.remoteInsert(char);
    let customPosition = editor.session.doc.indexToPosition(ins.index)
    ignoreChanges = true;
    editor.session.insert(customPosition , ins.char);
})


socket.on("receiveDelete", (recievedObj) => {
    const {Counter, saaman} = recievedObj
    let alreadyExists = false;
    versionVec.versions.forEach((e) =>{
        if(saaman.position[0].siteID === e.siteID) alreadyExists = true;
    })
    if (!alreadyExists){
        let newVersion = new Version(saaman.position[0].siteID)
        versionVec.versions.push(newVersion);
    }
    else{
        versionVec.versions.forEach((e) =>{
            if(saaman.position[0].siteID === e.siteID) {
                e.Counter += 1;
            }
        })
    }

    
    // after cheking
    let char = new Char(saaman.value, saaman.counter, saaman.position)
    let del = crdt.remoteDelete(char)
    let Srange = editor.session.doc.indexToPosition(del)
    let Erange = editor.session.doc.indexToPosition(del+1)
    let rangeObj = new Range(Srange.row, Srange.column, Erange.row, Erange.column)
    ignoreChanges = true;
    editor.session.remove(rangeObj)
})
