import React from 'react'
import TextInput from '../TextInput/TextInput'
import Button from '../Button/Button'
import styles from './Dabba.module.css'

const Dabba = (props) => {
    return (
        <div className={styles.dabba}>
            <div className={styles.dabba_heading}>
                <img src={props.imageSource} alt="pic" />
                &nbsp;
                <span>{props.heading}</span>
            </div>
            
            <TextInput placeholder={props.inputPlaceholder}/>
            <p className={styles.bottom_text}>
                {props.bottomText}
            </p>
            <Button buttonText={props.buttonText} loading={false} />
        </div>
    )
}

export default Dabba
