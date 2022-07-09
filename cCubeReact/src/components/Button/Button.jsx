import React from 'react'
import styles from './Button.module.css'

const Button = (props) => {
    return (
        <button className={styles.button}>
            {props.buttonText}
            &nbsp;
            {
                props.loading
                    ?    
                    <span>L</span>
                    :
                    <img src="images/Home/arrow-forward.png" alt="arrow-forward" />
            }
        </button>
    )
}

export default Button
