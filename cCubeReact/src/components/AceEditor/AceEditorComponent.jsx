import React, {useState, useContext} from 'react'
import styles from './AceEditorComponent.module.css'
import {Char} from './lib/char.js';
import {Identifier} from './lib/identifier.js';
import {CRDT} from './lib/crdt.js';
import AceEditor from 'react-ace';
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/theme-dracula";
import "ace-builds/src-noconflict/theme-tomorrow";
import {v4 as uuid} from "uuid";
import { Range } from 'ace-builds';

const AceEditorComponent = (props) => {
    const roomId = "Room-1"
    let editor = null;
    console.log("1 : ", editor)
    // const userId = uuid();
    const userId = Math.floor(Math.random() * 100000).toString()
    const socket = props.socket;
    let ignoreChanges = false;

    // poke server
    // socket.emit("hello")

    // https://dev.to/bravemaster619/how-to-use-socket-io-client-correctly-in-react-app-o65

    function newLine(){
        return editor.session.doc.getNewLineCharacter()
    }
    
    let crdt = new CRDT(userId)

    function handelEditorInput(e){
        if (!ignoreChanges){
            if(e.action === "insert"){
                let lines = e.lines
                let curr_text = lines.join(newLine())
                let start_index = editor.session.doc.positionToIndex(e.start)
                let end_index = editor.session.doc.positionToIndex(e.end)
        
                        for (let i=start_index, j=0; i<end_index; ++i, ++j){
                            let char = curr_text[j];
                            let saaman = crdt.localInsert(char, i)
                            socket.emit("sendInsert", {saaman, roomId})
                        }
                
            }
            else if(e.action === "remove"){
                    let lines = e.lines
                    let curr_text = lines.join(newLine())
                    let start_index = editor.session.doc.positionToIndex(e.start)
                    
                    for(let i=start_index; i<curr_text.length + start_index; ++i){
                        let saaman = crdt.struct[start_index]
                        crdt.localDelete(start_index)
                        console.log(crdt.struct)
                        console.log(saaman)
                        socket.emit("sendDelete", {saaman, roomId})
                    }
        
            }
        }
        ignoreChanges = false;
    
    }
    function openForiegnChange(){
        socket.on("receiveInsert", (saaman) => {
            let identifiers = saaman.position.map((e) => new Identifier(e.digit, e.siteId))
        
            let char = new Char(saaman.value, saaman.counter, identifiers)
            let ins = crdt.remoteInsert(char);
            let customPosition = editor.session.doc.indexToPosition(ins.index)
            ignoreChanges = true;
            editor.session.insert(customPosition , ins.char);
        })
        
        
        socket.on("receiveDelete", (saaman) => {
            let char = new Char(saaman.value, saaman.counter, saaman.position)
            let del = crdt.remoteDelete(char)
            let Srange = editor.session.doc.indexToPosition(del)
            let Erange = editor.session.doc.indexToPosition(del+1)
            let rangeObj = new Range(Srange.row, Srange.column, Erange.row, Erange.column)
            console.log(rangeObj)
            ignoreChanges = true;
            editor.session.remove(rangeObj)
        })
    }

    


    return (
        <div style={props.sideBarOn ? {width: "77%"}: {}} className={styles.ace_code_editor}>
            <AceEditor style={{width: `100%`, height:"100%"}}
                mode="javascript"
                theme="dracula"
                name="editor"
                fontSize="16px"
                onLoad={editorInstance => {
                    editor = editorInstance
                    console.log(editor)
                    document.addEventListener("mousedown", ev => (
                      editorInstance.resize()
                    ));
                    editorInstance.session.on("change", (e) => handelEditorInput(e))
                    openForiegnChange();
                }}
            />
        </div>
    )
    
}

export default AceEditorComponent;