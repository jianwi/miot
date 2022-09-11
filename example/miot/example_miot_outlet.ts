import { BlinkerDevice } from '../../lib/blinker';
import { Miot, VA_TYPE } from '../../lib/voice-assistant';
import axios from "axios";

let device = new BlinkerDevice('01CB2612H3YZ');

let miot = device.addVoiceAssistant(new Miot(VA_TYPE.OUTLET));

device.ready().then(() => {
    // 电源状态改变
    miot.powerChange.subscribe(message => {
        // console.log(message.data);
        switch (message.data.set.pState) {
            case 'true':
                axios.get("http://h5.saygift.cc/oder?Qd=0onGLO5640F5CHYa&sw=1&od=op")
                message.power('on').update();
                break;
            case 'false':
                axios.get("http://h5.saygift.cc/oder?Qd=0onGLO5640F5CHYa&sw=1&od=cs")
                message.power('off').update();
                break;
            default:
                break;
        }
    })
    
    device.dataRead.subscribe(message => {
        console.log('otherData:', message);
    })

    device.builtinSwitch.change.subscribe(message => {
        console.log('builtinSwitch:', message);
        device.builtinSwitch.setState(turnSwitch()).update();
    })

})


/*
以下为测试用函数
*/

function rgb2int(r: number, g: number, b: number) {
    return ((0xFF << 24) | (r << 16) | (g << 8) | b)
}

function int2rgb(value: number) {
    let r = (value & 0xff0000) >> 16;
    let g = (value & 0xff00) >> 8;
    let b = (value & 0xff);
    return [r, g, b]
}

let switchState = false
function turnSwitch() {
    switchState = !switchState
    device.log("切换设备状态为" + (switchState ? 'on' : 'off'))
    return switchState ? 'on' : 'off'
}
