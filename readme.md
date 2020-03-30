# Send Location App
The purpose of this app, as of now, is to send the location of the device where it is installed to a server through a socket.

### Debug build
    yarn react-native bundle --platform android --dev false --entry-file index.js --bundle-output android/app/src/main/assets/index.android.bundle --assets-dest android/app/src/main/res/

then

    cd android && ./gradlew assembleDebug