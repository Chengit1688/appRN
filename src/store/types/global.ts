import type {DiscoverListItem} from '@/utils/IMSDK';

export interface GlobalState {
  [x: string]: any;
  connectDelay: number;
  disCoverList: DiscoverListItem[];
  systemConfig: any;
  userObj: object;
  sendLimit: boolean;
  remindCiircle: any;
  shieldList: any[];
  domains: any;
  servers: any;
}
