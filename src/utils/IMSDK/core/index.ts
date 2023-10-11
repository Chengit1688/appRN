import { IMActionlet } from '../actionlet';
import { CreateSdkOptions } from './SdkBase';

export class IMSDK extends IMActionlet {
    static instance: IMSDK;

    protected constructor(options: CreateSdkOptions) {
        super(options);
    }
    
    static create(options: CreateSdkOptions) {
        if (!this.instance) {
            this.instance = new this(options);
        }

        return this.instance;
    }


    async logout() {
        this.mqtt_client?.end();
        this.mqtt_client = null
    }
}
