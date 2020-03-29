import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, PermissionsAndroid } from "react-native";
import Geolocation from "react-native-get-location";
import socketIO from "socket.io-client";

const socket = socketIO("http://10.0.2.2:3500"); // base url when using localhost in react native ie. apart for the port :3500


export default function(){

    const [allow, toggle] = useState(false);

    async function sendToServer(data){
        console.log(data.longitude)
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
        if(allow){
            // occur after every 60 seconds
            const interval = setInterval(accessible, 30000);
            return () => clearInterval(interval)
        }
    }, [allow])

    return(
        <>
            <View style={styles.body}>
                <View style={styles.wrapper}>
                    <View>
                        <Text style={styles.stayConnect}>Stay connected to the office</Text>
                    </View>
                    <View style={{height:30}}></View>
                    <View>
                        <TouchableOpacity onPress={() => toggle(!allow)}>
                            <View style={styles.btn}>
                                <Text style={{color:"#83B799",fontSize:24,fontFamily:"Poppins",}}>
                                    {
                                        allow ? "Disconnect" : "Connect"
                                    }
                                </Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View style={{height:72}}></View>
                </View>
            </View>
        </>
    )
}

const styles = StyleSheet.create({
    body:{
        flex:1,
        backgroundColor:"#272324",
        padding:10,
        borderRadius:5,
        justifyContent:"flex-end"
    },
    wrapper:{
        padding:20
    },
    stayConnect:{
        fontSize:36,
        fontFamily:"Poppins",
        color:"#f2f2f2"
    },
    btn:{
        backgroundColor:"transparent",
        paddingBottom:10,
        paddingTop:10,
        paddingRight:20
    }
})
