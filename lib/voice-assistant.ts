export const BLINKER_ALIGENIE_LIGHT = 'light'
export const BLINKER_ALIGENIE_OUTLET = 'outlet'
export const BLINKER_ALIGENIE_MULTI_OUTLET = 'multi_outlet'
export const BLINKER_ALIGENIE_SENSOR = 'sensor'

export const BLINKER_DUEROS_LIGHT = 'LIGHT'
export const BLINKER_DUEROS_OUTLET = 'SOCKET'
export const BLINKER_DUEROS_MULTI_OUTLET = 'MULTI_SOCKET'
export const BLINKER_DUEROS_SENSOR = 'AIR_MONITOR'

export const BLINKER_MIOT_LIGHT = 'light'
export const BLINKER_MIOT_OUTLET = 'outlet'
export const BLINKER_MIOT_MULTI_OUTLET = 'multi_outlet'
export const BLINKER_MIOT_SENSOR = 'sensor'

export enum VA_TYPE {
    LIGHT = 'light',
    OUTLET = 'outlet',
    MULTI_OUTLET = 'multi_outlet',
    SENSOR = 'sensor'
}

export enum MI_LIGHT_MODE {
    DAY,
    NIGHT,
    COLOR,
    WARMTH,
    TV,
    READING,
    COMPUTER,
}

export enum ALI_LIGHT_MODE {
    reading,
    movie,
    sleep,
    holiday,
    music,
    common
}

export enum DUER_LIGHT_MODE {
    READING,
    SLEEP,
    ALARM,
    NIGHT_LIGHT,
    ROMANTIC,
    SUNDOWN,
    SUNRISE,
    RELAX,
    LIGHTING,
    SUN,
    STAR,
    ENERGY_SAVING,
    MOON,
    JUDI,
}

import { Subject } from "rxjs";
import { BlinkerDevice } from "./blinker";
import { API } from './server.config'
import axios from 'axios';
import { u8aToString } from "./fun"

export class VoiceAssistant {

    get subTopic() {
        return `/sys/${this.device.config.productKey}/${this.device.config.deviceName}/rrpc/request/+`
    }

    get pubTopic() {
        return `/sys/${this.device.config.productKey}/${this.device.config.deviceName}/rrpc/response/`
    }

    vaType;

    device: BlinkerDevice;

    change = new Subject();

    targetDevice;

    powerChange = new Subject();
    modeChange = new Subject();
    colorChange = new Subject();
    colorTempChange = new Subject();
    brightnessChange = new Subject();
    stateQuery = new Subject();

    constructor(key) {
        this.vaType = key
    }

    // get message() {
    //     return `{"fromDevice": "${this.device.deviceName}", "toDevice": "${this.vaType}_r", "data": ${} , "deviceType": "vAssistant"}`
    // }

    listen() {
        this.device.mqttClient.on('message', (topic, message) => {

            console.log(topic);
            let messageString = u8aToString(message)
            console.log(messageString);
            let messageId = topic.split('/')[6]
            console.log(messageId);

            if (topic == this.subTopic) {
                let data;
                let fromDevice;

                try {
                    let messageString = u8aToString(message)
                    // console.log(topic);
                    console.log(messageString);
                    let messageObject = JSON.parse(messageString)
                    fromDevice = messageObject.fromDevice
                    data = messageObject.data
                    this.targetDevice = fromDevice
                } catch (error) {
                    console.log(error);
                }
                // 检查
                this.processData(data, fromDevice)
            }
        })
        // return this.change
    }

    unlisten() {
        // this.changeSubscription.unsubscribe();
    }


    processData(data, fromDevice) {

    }

    update(value = '') {
        let message = {}
        // message[this.key] = this.state
        this.device.sendMessage(message)
    }

    power(state: string) {

        return this
    }

    mode(mode: number) {
        return this
    }

    color(color: string) {
        return this
    }

    colorTemp(colorTemp: number) {
        return this
    }

    brightness(brightness: number) {
        return this
    }

    temp(val: number) {
        return this
    }

    humi(val: number) {
        return this
    }

    pm25(val: number) {
        return this
    }

}

export class Miot extends VoiceAssistant {

    constructor(key) {
        super(key)
        this.vaType = { miType: key }
    }

    mode(mode: MI_LIGHT_MODE) {
        return this
    }
}

export class AliGenie extends VoiceAssistant {

    constructor(key) {
        super(key)
        this.vaType = { aliType: key }
    }
}

export class DuerOS extends VoiceAssistant {

    constructor(key) {
        super(key)
        let newkey;
        switch (key) {
            case VA_TYPE.LIGHT:
                newkey = 'LIGHT'
                break;
            case VA_TYPE.OUTLET:
                newkey = 'SOCKET'
                break;
            case VA_TYPE.MULTI_OUTLET:
                newkey = 'MULTI_SOCKET'
                break;
            case VA_TYPE.SENSOR:
                newkey = 'AIR_MONITOR'
                break;
        }
        this.vaType = { duerType: newkey }
    }

}