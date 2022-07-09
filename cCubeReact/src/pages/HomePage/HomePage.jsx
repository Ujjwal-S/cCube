import React from 'react'
import styles from './HomePage.module.css'
import Navbar from '../../components/Navbar/Navbar'
import Dabba from '../../components/Box/Dabba'

const HomePage = () => {
    return (
        <>
        <Navbar />
        <main>
            <div className={styles.dabba_container}>
                <Dabba 
                    imageSource="images/Home/house.png"
                    heading = "Create your room here !"
                    inputPlaceholder = "Enter room name"
                    bottomText = "To start collaborating, create a room and share the room id with your friends :)"
                    buttonText = "Proceed"
                />
            </div>
        </main>
        </>
    )
}

export default HomePage
