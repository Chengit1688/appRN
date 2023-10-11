import {PortalProvider} from '@gorhom/portal';
import {EnvProvider} from './utils/env';
import MqttProvider from './utils/IMSDK/Provider';
import {I18nProvider} from './utils/i18n';
import RnuilibProvider from './utils/rnuilib/Provider';
import {AntdProvider} from './utils/antd';
import StoreProvider from './store/StoreProvider';

export default function Provider({children}: any) {
  return (
    <StoreProvider>
      <EnvProvider>
        <I18nProvider>
          <MqttProvider>
            <RnuilibProvider>
              <AntdProvider>
                <PortalProvider>{children}</PortalProvider>
              </AntdProvider>
            </RnuilibProvider>
          </MqttProvider>
        </I18nProvider>
      </EnvProvider>
    </StoreProvider>
  );
}
