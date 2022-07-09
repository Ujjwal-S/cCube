import React, {useState, useEffect, useContext} from 'react'
import styles from './CodePage.module.css'
import CodeEditorTop from '../../components/CodeEditorTop/CodeEditorTop'
import AceEditorComponent from '../../components/AceEditor/AceEditorComponent'
import SideBar from '../../components/SideBar/SideBar'
import { useSelector } from 'react-redux'
import {SocketContext} from '../../context/socket'


const CodePage = () => {
    const [editorOptionChange, setEditorOptionChange] = useState(1);

    useEffect(() => {
    }, [editorOptionChange])

    const {fontSize, theme, sideBar} = useSelector((state) => state.editor)

    const socket = useContext(SocketContext);
    // poke server
    socket.emit("hello")

    function codeEditorTopChange(){
        setEditorOptionChange(editorOptionChange + 1)
    }
    return (
        <div className={styles.body}>
            <CodeEditorTop someChange={codeEditorTopChange} />
            <div className={styles.editorSpace}>
                <AceEditorComponent fontSize={fontSize} theme={theme} sideBarOn={sideBar} socket={socket} />
                <SideBar socket={socket} />
            </div>
        </div>
    )
}

export default CodePage
