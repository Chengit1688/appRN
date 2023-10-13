import mqtt from "mqtt/dist/mqtt.min";
import { Emitter } from './Emitter'
import { IMSDK } from '../types';
import { group } from "console";

export class Subscriber extends Emitter {
    mqtt_client?: mqtt.MqttClient;
    station: string;
    user_id: string = '';
  
    public subscribe(topic: string) {
        return new Promise((resolve, reject) => {
            this.mqtt_client?.subscribe(topic, () => {
                resolve('subscribe base topic success!')
                console.debug('subscribe base topic success!');
            });
        })
    }

    subscribeBase() {
        this.mqtt_client?.subscribe([
            `${this.station}/users/${this.user_id}`,
            `${this.station}/system`,
        ], () => {
            this.emit(IMSDK.Event.SDK_READY)
            console.debug('subscribe base topic success!');
        });
    }

    public subscribeSingleChat(users:any) {
        this.mqtt_client?.subscribe([
            `${this.station}/chat/single_${users.user_id_1}_${users.user_id_2}`,
        ], () => {
            // console.debug('subscribe single chat topic success!=======>', `${this.station}/chat/single_${users.user_id_1}_${users.user_id_2}`);
        });
    }

    public unsubscribeSingleChat(users:any) {
        this.mqtt_client?.unsubscribe([
            `${this.station}/chat/single_${users.user_id_1}_${users.user_id_2}`,
        ], () => {
        });
    }

    public subscribeGroupChat(group_id:any, cb) {
        this.mqtt_client?.subscribe([
            `${this.station}/chat/group_${group_id}`,
        ], () => {
            cb && cb()
            // console.log('subscribe group chat topic success!=======>', `${this.station}/chat/group_${group_id}`);
        });
    }

    public unsubscribeGroupChat(group_id:any) {
        this.mqtt_client?.unsubscribe([
            `${this.station}/chat/group_${group_id}`,
        ], () => {
        });
    }
    // todo remove
    subscribeGroup(groupList:IMSDK.Group[]){
        groupList.forEach(group => {
            this.mqtt_client?.subscribe(`${this.station}/groups/${group.group_id}`,(data) => {
                // console.log('subscribeGroup',data)
            })
        })
    }

    public subscribeGroups(group_id:any, cb) {
        this.mqtt_client?.subscribe([
            `${this.station}/groups/${group_id}`,
        ], () => {
            cb && cb()
            // console.log('subscribe groups topic success!=======>', `${this.station}/groups/${group_id}`);
        });
    }

    public unsubscribeGroups(group_id:any) {
        this.mqtt_client?.unsubscribe([
            `${this.station}/groups/${group_id}`,
        ], () => {
        });
    }
}