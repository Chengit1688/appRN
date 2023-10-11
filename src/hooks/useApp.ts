import {useState, useEffect} from 'react';
import {useColorScheme} from 'react-native';
import DeviceInfo from 'react-native-device-info';

export default function useApp() {
  const [darkMode, setDarkMode] = useState('dark' === useColorScheme());
  const [appName] = useState(DeviceInfo.getApplicationName());

  useEffect(() => {
    //setDarkMode(false);
  }, []);

  return {darkMode, appName};
}
