import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, PermissionsAndroid } from "react-native";
import Geolocation from "react-native-get-location";
import socketIO from "socket.io-client";

const socket = socketIO("http://10.0.2.2:3500"); // base url when using localhost in react native ie. apart for the port :3500


export default function(){

    const [allow, toggle] = useState(false);

    async function sendToServer(data){
        socket.emit("myLocation", {
            data,
            name:"Cally",
            device:"mobile"
        })
    }

    async function accessible(){
        let granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION)
        if(granted === PermissionsAndroid.RESULTS.GRANTED){
            //
            Geolocation.getCurrentPosition({
                enableHighAccuracy: true,
                timeout: 150000,
            }).then(function(position){
                sendToServer(position)

            }).catch(function({code, message}){
                console.log(message, code, 'error')
            })

        } else {
            //
            console.log("not granted")
        }
    }

    useEffect(function(){
        // occur after every 60 seconds
        const interval = setInterval(accessible, 60000);
        return () => clearInterval(interval)
    }, [])

    return(
        <>
            <View style={styles.body}>
                <View style={styles.wrapper}>
                    <View></View>
                    <View>
                        <Text style={{textAlign:"center"}}>Stay connected to HQ</Text>
                        <View></View>
                        <Text style={{textAlign:"center",fontWeight:"700",fontSize:18}}></Text>
                    </View>
                    <View style={{display:"flex",flexDirection:"row",justifyContent:"center"}}>
                        <TouchableOpacity onPress={() => toggle(!allow)}>
                            <View style={styles.btn}>
                                <Text style={{color:"white",fontSize:18,textTransform:"uppercase",fontWeight:"700"}}>
                                    {
                                        allow ? "Disconnect" : "Connect"
                                    }
                                </Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </>
    )
}

const styles = StyleSheet.create({
    body:{
        flex:1,
        backgroundColor:"white",
        padding:10,
        borderRadius:5
    },
    wrapper:{
        flex:1,
        backgroundColor:"#f6f6f6",
        justifyContent:"space-around",
        padding:10
    },
    btn:{
        backgroundColor:"green",
        display:"flex",
        flexDirection:"row",
        justifyContent:"center",
        paddingBottom:10,
        paddingTop:10,
        paddingLeft:32,
        paddingRight:32,
        borderRadius:5
    }
})
