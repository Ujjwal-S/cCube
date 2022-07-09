import React from 'react'
import styles from './TextInput.module.css'

const TextInput = (props) => {
    return (
        <div className={styles.dabba_input}>
            <input type="text" placeholder={props.placeholder} />
        </div>
    )
}

export default TextInput
