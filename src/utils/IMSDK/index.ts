import Config from 'react-native-config'
import { IMSDK } from './core';

export * from './types';

export default IMSDK.create({
    station: Config.VITE_APP_SITEID,
    connect_url: Config.VITE_APP_IMURL,
});
