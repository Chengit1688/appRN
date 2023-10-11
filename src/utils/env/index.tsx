import {useState, useEffect, createContext} from 'react';
import Config from 'react-native-config';
import {domainConfig} from '@/api/login';

const EnvContext = createContext({env: {}, domains: {}, servers: {}});

function EnvProvider({children}: any) {
  const [domains, setDomains] = useState({});
  const [servers, setServers] = useState({});

  useEffect(() => {
    async function init() {
      const res = await domainConfig({});

      const data = res.list.reduce((pre, cur) => {
        pre[cur.site] = cur.domain;
        return pre;
      }, {});

      global.minio = data.minio;

      setDomains(res);
      setServers(data);
    }
    init();
  }, []);

  return (
    <EnvContext.Provider
      value={{
        env: Config,
        domains,
        servers,
      }}>
      {children}
    </EnvContext.Provider>
  );
}

export {EnvProvider, EnvContext};
