import React, {useState} from 'react'
import styles from './CodeEditorTop.module.css'
import { useDispatch } from 'react-redux'
import {setTheme, setFont, setSideBar} from '../../store/editorSlice'

const CodeEditorTop = (props) => {
    const [fontSize, setFontSize] = useState(16);
    const [themeIcon, setThemeIcon] = useState("sun");
    const [sideBar, setSidebar] = useState(false);
    const dispatch = useDispatch()
    
    function openCloseSidebar(){
        dispatch(setSideBar(!sideBar))
        setSidebar(!sideBar)
    }

    function increaseFontSize(){
        dispatch(setFont(fontSize + 1))
        setFontSize(fontSize+1)
        props.someChange();
    }
    function decreaseFontSize(){
        if(fontSize > 0){
            dispatch(setFont(fontSize - 1))
            setFontSize(fontSize-1)
            props.someChange();
        }
    }
    function changeThemeIcon(){
        if (themeIcon === "sun"){
            dispatch(setTheme(1))
            setThemeIcon("moon")
        }
        else{
            setThemeIcon("sun")
            dispatch(setTheme(0))
        }
        props.someChange();
    }
    return (
        <nav className={styles.code_nav}>
            <input className={styles.fileName} type="text" placeholder="Untitled.js"/>
            <div className={styles.buttons}>
                <button style={{backgroundColor: "#6c757d"}}>
                    <span onClick={decreaseFontSize}>-</span>
                    &nbsp;
                    &nbsp;
                    <span>{fontSize}</span>
                    &nbsp;
                    &nbsp;
                    <span onClick={increaseFontSize}>+</span>
                </button>
                <button onClick={changeThemeIcon} style={{backgroundColor: "#6c757d"}}>
                    <img src={`images/CodeNavBar/${themeIcon}.svg`} alt="theme" />
                </button>
                <button style={{backgroundColor: "#0d6efd"}}>
                    <img src="images/CodeNavBar/compass.svg" alt="share" />
                    &nbsp;
                    Share
                </button>
                <button style={{backgroundColor: "#198754"}}>
                    <img src="images/CodeNavBar/file-earmark-arrow-down.svg" alt="download" />
                    &nbsp;
                    Download
                </button>
                <button onClick={openCloseSidebar} style={{backgroundColor: "#6c757d"}}>
                    <img src="images/CodeNavBar/arrow-left-right.svg" alt="open sidebar" />
                </button>
            </div>
        </nav>
    )
}

export default CodeEditorTop
