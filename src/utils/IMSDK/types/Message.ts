interface ImageMessage{
  image_info : {
    uuid : string
    image_url : string
    image_width : number
    thumb_url : string
    image_height : number
  }  
}

interface FileMessage{
  file_info : {
    file_url : string
    uuid : string
    file_name : string
    file_size : number
    new_name:string
  } 
}

export interface Message {
  be_operator_list: any[];
  /**
         * 文件名 搜索用
         * **/ 
  file_name: string;
  /**
   * 本地生成的uuid 主键
   * **/ 
  client_msg_id: string; //
  /**
   * 后端返回的消息id
   * **/ 
  msg_id: string;// 
  /**
   * 会话id
   * **/ 
  conversation_id: string;
  /**
   * 发送人id
   * **/ 
  send_id: string;
  /**
   * 发送人的昵称
   * **/ 
  send_nickname: string;
  /**
   * 发送人的头像
   * **/ 
  send_face_url: string;
  /**
   * 发送时间
   * **/ 
  send_time: number;
  /**
   * 会话类型 同会话
   * **/ 
  conversation_type: string;
  /**
   * 业务ID, 跟CKMessage conversation_id相同概念, 群消息是群ID, 私聊是用户ID
   * **/ 
  bus_id: string;
  /**
   * 类型
   * **/ 
  type: number;
  /**
   * 状态 未读 0 已读 1 撤回 2 删除 3 发送失败 -97 未知-99 发送中 -1
   * **/ 
  status: number;
  /**
   * 接收对象ID, 群消息是群ID, 私聊是用户ID
   * **/ 
   recv_id: string;
  /**
   * 同步标记
   * **/ 
   seq: number;
  /**
   * 消息内容
   * **/ 
  content: (Record<string,unknown> & FileMessage & ImageMessage);
  /**
   * 是否收藏:0=未收藏,1=已收藏
   * 前端定义
   */
  is_collect: number;
}