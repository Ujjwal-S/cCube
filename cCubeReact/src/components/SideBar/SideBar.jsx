import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import Peer from "simple-peer";
import styled from "styled-components";
import styles from './SideBar.module.css'

const StyledVideo = styled.video`
    height: 100%;
    width: 100%;
    `;

const Video = (props) => {
        const ref = useRef();
    
        useEffect(() => {
            props.peer.on("stream", stream => {
                ref.current.srcObject = stream;
            })
        }, []);
    
        return (
            <StyledVideo playsInline autoPlay ref={ref} />
        );
}


const SideBar = (props) => {
    const [peers, setPeers] = useState([]);
    const socketRef = useRef();
    const userVideo = useRef();
    const peersRef = useRef([]);
    const roomID = "Room-1";
    useEffect(() => {
        socketRef.current = props.socket;
        navigator.mediaDevices.getUserMedia({ video: {height: 100, width: 100}, audio: true }).then(stream => {
            userVideo.current.srcObject = stream;
            socketRef.current.emit("join room", roomID);
            socketRef.current.on("all users", users => {
                const peers = [];
                users.forEach(userID => {
                    const peer = createPeer(userID, socketRef.current.id, stream);
                    peersRef.current.push({
                        peerID: userID,
                        peer,
                    })
                    peers.push(peer);
                })
                setPeers(peers);
            })

            socketRef.current.on("user joined", payload => {
                const peer = addPeer(payload.signal, payload.callerID, stream);
                peersRef.current.push({
                    peerID: payload.callerID,
                    peer,
                })

                setPeers(users => [...users, peer]);
            });

            socketRef.current.on("receiving returned signal", payload => {
                const item = peersRef.current.find(p => p.peerID === payload.id);
                item.peer.signal(payload.signal);
            });
        })
    }, []);
    function createPeer(userToSignal, callerID, stream) {
        const peer = new Peer({
            initiator: true,
            trickle: false,
            stream,
        });

        peer.on("signal", signal => {
            socketRef.current.emit("sending signal", { userToSignal, callerID, signal })
        })

        return peer;
    }

    function addPeer(incomingSignal, callerID, stream) {
        const peer = new Peer({
            initiator: false,
            trickle: false,
            stream,
        })

        peer.on("signal", signal => {
            socketRef.current.emit("returning signal", { signal, callerID })
        })

        peer.signal(incomingSignal);

        return peer;
    }
    return (
        <div className={styles.sideBar}>
            <div className={styles.meraInfo}>
                <div style={{height: "150px", margin: "5px 0"}} className={styles.video_stream}>
                    <StyledVideo muted ref={userVideo} autoPlay playsInline />
                </div>
            </div>

            {peers.map((peer, index) => {
                return (
                    <div className={styles.meraInfo}>
                        <div style={{height: "150px", margin: "5px 0"}} className={styles.video_stream}>
                            <Video key={index} peer={peer} />
                        </div>
                    </div>
                );
            })}

        </div>

    )
}

export default SideBar
