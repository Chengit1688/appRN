import { BaseActionlet } from './BaseActionlet';
import { IMSDK,Discover,Announcement } from '../types';

export abstract class FeatureActionlet extends BaseActionlet {
  async discover() {
    const res = await this.get<Discover>('/api/discover')
    if (res.is_open !== 1) res.list = []
    return res.list
  }
  /**
       * 获取公告
       */
  getNotice() {
    return this.get<Announcement>('/api/announcement');
  }
}