// let apiSwitchService = 
import { environment } from './../../../../environments/environment';
let APISwitch = (PORT_NUMBER) => {
    switch (PORT_NUMBER) {
        case 'api_2':
            return environment.LIVE_API;
        default:
            return environment.API;
    }
}

export let APIBasedServiceProvider = {
    APISwitch
}