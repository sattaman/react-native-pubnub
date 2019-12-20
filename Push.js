import React from 'react';
import { Alert, Clipboard, View, Text, Button, Platform } from 'react-native';
import PushNotificationIOS from "@react-native-community/push-notification-ios";
import PubNubReact from 'pubnub-react';
import PushNotification from 'react-native-push-notification';
import { publishKey, subscribeKey, senderID } from './pubnubKeys.json'

export default class Push extends React.Component {
    constructor(props) {
        console.log('Push constructor')
        super(props);

        this.userId = `myuser-${Platform.OS}`;
        this.channelId = `myuser-${Platform.OS}-channel`;

        this.pubnub = new PubNubReact({
            publishKey,
            subscribeKey,
            logVerbosity: true,
            uuid: this.userId
        });
        this.pubnub.init(this);
        PushNotification.configure({
            onRegister: (token) => {
                console.log( 'TOKEN:', token );
                Clipboard.setString(token.token)
                Alert.alert('Registered', JSON.stringify(token), [{text: 'OK', onPress: () => console.log('OK Pressed')}]);
                if (token.os == "ios")
                {
                    this.pubnub.push.addChannels(
                    {
                        channels: [this.channelId],
                        device: token.token,
                        pushGateway: 'apns'
                    });
                } else if (token.os == "android") 
                {
                    this.pubnub.push.addChannels(
                    {
                        channels: [this.channelId],
                        device: token.token,
                        pushGateway: 'gcm'
                    });
                } 
            },
            onNotification: (notification) => {
                Alert.alert('Push received', JSON.stringify(notification), [{text: 'OK', onPress: () => console.log('OK Pressed')}]);
                this.setState({ recievedData: notification.data });
                if (Platform.OS === 'ios') {
                    notification.finish(PushNotificationIOS.FetchResult.NoData);
                }
            },
            senderID
        });
    }

    render() {
        const { recievedData } = this.state; 

        return (
            <View>
                <Text>User ID: {this.userId}</Text>
                <Text>Channel ID: {this.channelId}</Text>
                {recievedData !== undefined && <Text>Route: {recievedData.route} {recievedData.id}</Text>}
                <Button
                    title="Reset badge count"
                    onPress={() => { 
                        PushNotification.setApplicationIconBadgeNumber(0);
                        Alert.alert('Badge count reset');
                    }}
                />
            </View>
        );
    }
}