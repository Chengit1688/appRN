import RtmEngine from 'agora-react-native-rtm';

class RTMEngine {
  engine!: RtmEngine;
  private localUID: string = '';
  private channelId: string = '';

  private static _instance: RTMEngine | null = null;

  public static getInstance(appId: string) {
    if (!RTMEngine._instance) {
      return new RTMEngine(appId);
    }
    return RTMEngine._instance;
  }

  private async createClientInstance(appId: string) {
    await this.engine.createInstance(appId);
  }

  private async destroyClientInstance() {
    try {
      await this.engine?.logout();
    } catch (error) {
    }
    try {
      await this.engine?.release();
    } catch (error) {
    }
  }

  private constructor(appId: string) {
    if (RTMEngine._instance) {
      return RTMEngine._instance;
    }
    RTMEngine._instance = this;
    this.engine = new RtmEngine();
    this.localUID = '';
    this.channelId = '';
    this.createClientInstance(appId);

    return RTMEngine._instance;
  }

  setLoginInfo(localUID: string, channelID: string) {
    this.localUID = localUID;
    this.channelId = channelID;
  }
  get localUid() {
    return this.localUID;
  }
  get channelUid() {
    return this.channelId;
  }
  destroy() {
    try {
      if (RTMEngine._instance) {
        this.destroyClientInstance();
        RTMEngine._instance = null;
      } else {
      }
    } catch (error) {
    }
  }
}

export default RTMEngine;
