/* eslint-disable */
import Config from 'react-native-config';
import MQTT from '@openrc/react-native-mqtt';
import uuid from 'react-native-uuid';
import {Subscriber} from './Subscriber';
import {IMSDK} from '../types';
import {StorageFactory} from '../../../utils/storage';
import {decrypt} from '@/utils/aes/native';
import DeviceInfo from 'react-native-device-info';

const state_map = {
  [IMSDK.ConnectState.CONNECTING]: 'connecting',
  [IMSDK.ConnectState.CONNECTED]: 'connected',
  [IMSDK.ConnectState.RECONNECTING]: 'reconnecting',
  [IMSDK.ConnectState.CLOSED]: 'closed',
  [IMSDK.ConnectState.LOSTCONNECT]: 'lost-connect',
  [IMSDK.ConnectState.CONNECTERROR]: 'connect error',
  [IMSDK.ConnectState.NETWORKERROR]: 'network error',
};

export interface CreateSdkOptions {
  station: string;
  connect_url: string;
}

export interface LoginParams {
  user_id: string;
  token: string;
}

export abstract class SdkBase extends Subscriber {
  public connect_state: IMSDK.ConnectState = IMSDK.ConnectState.CLOSED;
  // private readonly device_id = encodeURIComponent(navigator.userAgent);
  private device_id: string;
  private connect_url: string;
  protected token: string = '';

  constructor(options: CreateSdkOptions) {
    super();
    this.station = options.station;
    this.connect_url = options.connect_url;
    this.device_id = StorageFactory.getLocal('IM_DEVICED_ID');
  }

  /**
   * 0: not connect
   * 1: open
   * 2: closing
   * 3: closed
   */
  protected get state_label() {
    return state_map[this.connect_state];
  }

  protected get no_connected(): boolean {
    return (
      this.connect_state === IMSDK.ConnectState.CLOSED ||
      this.connect_state === IMSDK.ConnectState.LOSTCONNECT ||
      this.connect_state === IMSDK.ConnectState.NETWORKERROR ||
      this.connect_state === IMSDK.ConnectState.CONNECTERROR
    );
  }

  protected get net_connect_offline() {
    return global.isConnected !== true;
  }

  public setConnectUrl(url: string) {
    this.connect_url = url;
  }

  public login(params: LoginParams) {
    this.user_id = params.user_id;
    this.token = params.token;
    if (this.mqtt_client) return Promise.resolve();
    return this.createClient().then(connect => {
      this.subscribeBase();

      return connect;
    });
  }

  private createClient() {
    return new Promise(async (resolve, reject) => {
      // if(IMSDK.ConnectState.CONNECTED === this.connect_state || IMSDK.ConnectState.CONNECTING === this.connect_state || IMSDK.ConnectState.RECONNECTING === this.connect_state) {
      //     reject(new Error('mqtt connecting'));
      //     return
      // }
      this.changeConnectState(IMSDK.ConnectState.CONNECTING);

      if (this.net_connect_offline) {
        this.changeConnectState(IMSDK.ConnectState.NETWORKERROR);
        reject(new Error('Net work error'));
      }
      //console.log("mqtt",this.connect_url, uuid.v4())
      this.device_id = await DeviceInfo.getUniqueId();

      console.debug('mqtt connect info ---------', this.connect_url, {
        clientId: `${this.station}_${this.user_id}_${this.device_id}`,
        username: `${this.station}_${this.user_id}`,
        password: Config.VITE_APP_MQTT_PASSWORD,
      });

      this.mqtt_client = MQTT.connect(this.connect_url, {
        clientId: `${this.station}_${this.user_id}_${this.device_id}`,
        username: `${this.station}_${this.user_id}`,
        password: Config.VITE_APP_MQTT_PASSWORD,
        keepalive: 65535,
        protocolId: 'MQTT',
        protocolVersion: 5,
        clean: true,
        reconnectPeriod: 1000,
        connectTimeout: 30 * 1000,
        properties: {
          sessionExpiryInterval: 0,
        },
        // will: {
        //     topic: 'WillMsg',
        //     payload: 'Connection Closed abnormally..!',
        //     qos: 0,
        //     retain: false
        // },
        rejectUnauthorized: false,
      });

      this.mqtt_client.on('connect', () => {
        this.changeConnectState(IMSDK.ConnectState.CONNECTED);
      });

      this.mqtt_client.on('reconnect', () => {
        this.changeConnectState(IMSDK.ConnectState.RECONNECTING);
        this.subscribeBase();
      });

      this.mqtt_client.on('disconnect', () => {
        this.changeConnectState(IMSDK.ConnectState.LOSTCONNECT);
      });

      this.mqtt_client.on('offline', () => {
        this.changeConnectState(IMSDK.ConnectState.LOSTCONNECT);
      });

      this.mqtt_client.on('close', () => {
        this.changeConnectState(IMSDK.ConnectState.CLOSED);
      });

      this.mqtt_client.on('error', err => {
        this.changeConnectState(IMSDK.ConnectState.CONNECTERROR);
        throw new Error(err.message);
      });
      this.mqtt_client.on('message', (topic, message) => {
        try {
          const payload = {topic, message: JSON.parse(message.toString())} as {
            topic: string;
            message: IMSDK.BaseMessageBody;
          };
          if (payload.message.type === 400) {
            const data = payload.message.data as IMSDK.Message;
            data.content = decrypt(data.content);
          }
          // console.log(
          //     `%c message payload:${payload.message.type as number}`,
          //     'background: #f00; color: #fff',
          //     payload.message.data
          // )
          // this.emit(IMSDK.Event.MESSAGE_RECEIVED, payload)
          this.emit(payload.message.type, payload.message.data);
        } catch (error) {
          console.error(
            `onmessage error,${topic} ${message.toString()}`,
            error,
          );
        }
      });
      resolve(this.mqtt_client);
    });
  }

  private changeConnectState(state: IMSDK.ConnectState) {
    if (state !== this.connect_state) {
      this.connect_state = state;
      this.emit(IMSDK.Event.NET_STATE_CHANGE, state);

      if (this.no_connected) {
        this.emit(IMSDK.Event.SDK_NOT_READY);
      }
    }
    console.debug('SdkBase current connect state', this.state_label);
  }
}
