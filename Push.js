import React from 'react';
import { Alert, Clipboard, View, Text } from 'react-native'
import PubNubReact from 'pubnub-react';
import PushNotification from 'react-native-push-notification';
import { publishKey, subscribeKey, senderID } from './pubnubKeys.json'

export default class Push extends React.Component {
    constructor(props) {
        console.log('Push constructor')
        super(props);
        this.pubnub = new PubNubReact({
            publishKey,
            subscribeKey,
            logVerbosity: true
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
                        channels: ['notifications'],
                        device: token.token,
                        pushGateway: 'apns'
                    });
                } else if (token.os == "android") 
                {
                    this.pubnub.push.addChannels(
                    {
                        channels: ['notifications'],
                        device: token.token,
                        pushGateway: 'gcm' // apns, gcm, mpns
                    });
                } 
            },
            onNotification: (notification) => {
                Alert.alert('Push received', JSON.stringify(notification), [{text: 'OK', onPress: () => console.log('OK Pressed')}]);
                const { route, id } = notification.data;
                this.setState({ recieved: { route, id }});
                // Do something with the notification.
                // Required on iOS only (see fetchCompletionHandler docs: https://facebook.github.io/react-native/docs/pushnotificationios.html)
                // notification.finish(PushNotificationIOS.FetchResult.NoData);
            },
            senderID
        });
    }

    render() {
        if (this.state.recieved === undefined) return null;
        const { id, route } = this.state.recieved;
        return <View><Text>Route: {route} {id}</Text></View>
    }
}