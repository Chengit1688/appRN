import {Assets} from 'react-native-ui-lib';

export const loadAssets = () => {
  Assets.loadAssetsGroup('icons.app', {
    add: require('@/assets/icons/add.png'),
    add_btn: require('@/assets/icons/add-btn.png'),
    add_active: require('@/assets/icons/add-active.png'),
    next: require('@/assets/icons/next.png'),
    next_smail: require('@/assets/icons/next_smail.png'),
    boy: require('@/assets/icons/boy.png'),
    girl: require('@/assets/icons/girl.png'),
    location: require('@/assets/icons/location.png'),
    edit: require('@/assets/icons/edit.png'),
    qrcode_half: require('@/assets/icons/qrcode_half.png'),
    wallet: require('@/assets/icons/wallet.png'),
    receive_payment: require('@/assets/icons/receive_payment.png'),
    copy: require('@/assets/icons/copy.png'),
    maps_search: require('@/assets/icons/maps-search.png'),
    maps_location: require('@/assets/icons/maps-location.png'),
    maps_position: require('@/assets/icons/maps-position.png'),
    file: require('@/assets/icons/file.png'),
    // tip: require('@/assets/icons/tip.png'),

    back: require('@/assets/icons/back.png'),

    red_packet_next: require('@/assets/icons/red_packet_next.png'),
    red_packet_best: require('@/assets/icons/red_packet_best.png'),

    upload_add: require('@/assets/icons/upload-add.png'),

    voice_1: require('@/assets/icons/voice-1.png'),
    voice_2: require('@/assets/icons/voice-2.png'),
    voice_3: require('@/assets/icons/voice-3.png'),
    voice_w_1: require('@/assets/icons/voice_w-1.png'),
    voice_w_2: require('@/assets/icons/voice_w-2.png'),
    voice_w_3: require('@/assets/icons/voice_w-3.png'),

    hbjl: require('@/assets/icons//my/hbjl.png'),
    more: require('@/assets/icons//my/more.png'),
    lszd: require('@/assets/icons//my/lszd.png'),
    zfb: require('@/assets/icons//my/zfb.png'),
  });

  Assets.loadAssetsGroup('icons.compontent', {
    search: require('@/assets/icons/search.png'),
  });

  Assets.loadAssetsGroup('imgs.app', {
    empty: require('@/assets/imgs/empty.png'),
    red_packet_headerbg: require('@/assets/imgs/redpacketdetail_headerbg.png'),
  });

  Assets.loadAssetsGroup('imgs.avatar', {
    body: require('@/assets/imgs/boy_avatar.png'),
    gril: require('@/assets/imgs/girl_avatar.png'),
    defalut: require('@/assets/imgs/defalut_avatar.png'),
    group: require('@/assets/imgs/group.png'),
  });

  Assets.loadAssetsGroup('icons.tab', {
    message: require('@/assets/icons/tab/message.png'),
    message_active: require('@/assets/icons/tab/message-active.png'),
    contacts: require('@/assets/icons/tab/contacts.png'),
    contacts_active: require('@/assets/icons/tab/contacts-active.png'),
    discover: require('@/assets/icons/tab/discover.png'),
    discover_active: require('@/assets/icons/tab/discover-active.png'),
    my: require('@/assets/icons/tab/my.png'),
    my_active: require('@/assets/icons/tab/my-active.png'),
  });

  Assets.loadAssetsGroup('page.message', {
    add: require('@/assets/icons/message/add.png'),
    scan: require('@/assets/icons/message/scan.png'),
    addfriend: require('@/assets/icons/message/addfriend.png'),
    groupchat: require('@/assets/icons/message/groupchat.png'),

    notice: require('@/assets/icons/message/notice.png'),
    kf: require('@/assets/icons/message/kf.png'),
    mdm: require('@/assets/icons/message/mdm.png'),
    sys: require('@/assets/icons/message/sys.png'),
  });

  Assets.loadAssetsGroup('page.contact', {
    newfriend: require('@/assets/icons/contact/newfriend.png'),
    tag: require('@/assets/icons/contact/tag.png'),
    blacklist: require('@/assets/icons/contact/blacklist.png'),
    groupchat: require('@/assets/icons/contact/groupchat.png'),
    video: require('@/assets/icons/contact/video.png'),
    message: require('@/assets/icons/contact/message.png'),
    addFriend: require('@/assets/icons/contact/add-friend.png'),
  });

  Assets.loadAssetsGroup('page.my', {
    collect: require('@/assets/icons/my/collect.png'),
    colorscheme: require('@/assets/icons/my/colorscheme.png'),
    privacy: require('@/assets/icons/my/privacy.png'),
    security: require('@/assets/icons/my/security.png'),
    setting: require('@/assets/icons/my/setting.png'),
  });

  Assets.loadAssetsGroup('page.discover', {
    eatplay: require('@/assets/icons/discover/eatplay.png'),
    franchisee: require('@/assets/icons/discover/franchisee.png'),
    friends: require('@/assets/icons/discover/friends.png'),
    news: require('@/assets/icons/discover/news.png'),
    operator: require('@/assets/icons/discover/operator.png'),
    signin: require('@/assets/icons/discover/signin.png'),
    scan: require('@/assets/icons/discover/scan.png'),
  });

  Assets.loadAssetsGroup('page.friends', {
    more: require('@/assets/icons/friends/more.png'),
    like: require('@/assets/icons/friends/like.png'),
    like_select: require('@/assets/icons/friends/like-select.png'),
    stand: require('@/assets/icons/friends/stand.png'),
    msg: require('@/assets/icons/friends/msg.png'),
    see: require('@/assets/icons/friends/see.png'),
    seeAct: require('@/assets/icons/friends/seeAct.png'),
    del: require('@/assets/icons/friends/del.png'),
    photograph: require('@/assets/icons/friends/photograph.png'),
    photo_active: require('@/assets/icons/friends/photo.png'),
    add: require('@/assets/icons/friends/add.png'),
    location: require('@/assets/icons/friends/location.png'),
    whoSee: require('@/assets/icons/friends/whoSee.png'),
    remind: require('@/assets/icons/friends/remind.png'),
    del_red: require('@/assets/icons/friends/del_red.png'),
    link_next: require('@/assets/icons/friends/link_next.png'),
    emo: require('@/assets/icons/friends/emo.png'),
    comment: require('@/assets/icons/friends/comment.png'),
    shop: require('@/assets/icons/friends/shop.png'),
    addfriend: require('@/assets/icons/friends/addfriend.png'),
  });
  Assets.loadAssetsGroup('page.news', {
    play: require('@/assets/icons/news/play.png'),
    auth: require('@/assets/icons/news/auth.png'),
  }),
    Assets.loadAssetsGroup('page.signIn', {
      coupon: require('@/assets/icons/signIn/coupon.png'),
      giftBag: require('@/assets/icons/signIn/giftBag.png'),
      moneyBg: require('@/assets/icons/signIn/moneyBg.png'),
      species: require('@/assets/icons/signIn/species.png'),
    }),
    Assets.loadAssetsGroup('page.chat', {
      // 红包
      red_packet: require('@/assets/icons/chat/red_packet.png'),
      // 转账
      transfer: require('@/assets/icons/chat/transfer.png'),

      // 长按
      forward: require('@/assets/icons/chat/forward.png'),
      quote: require('@/assets/icons/chat/quote.png'),
      select: require('@/assets/icons/chat/select.png'),
      del: require('@/assets/icons/chat/del.png'),
      revoke: require('@/assets/icons/chat/revoke.png'),
      copy: require('@/assets/icons/chat/copy.png'),
      collect: require('@/assets/icons/chat/collect.png'),
      save: require('@/assets/icons/chat/save.png'),
      speaker: require('@/assets/icons/chat/speaker.png'),
      receiver: require('@/assets/icons/chat/receiver.png'),
      // 引用
      close: require('@/assets/icons/chat/close.png'),
    });

  Assets.loadAssetsGroup('page.chat.toolbar', {
    // toolbar
    voice: require('@/assets/icons/chat/toolbar/voice.png'),
    voice_active: require('@/assets/icons/chat/toolbar/voice-active.png'),
    photo: require('@/assets/icons/chat/toolbar/photo.png'),
    photo_active: require('@/assets/icons/chat/toolbar/photo-active.png'),
    camera: require('@/assets/icons/chat/toolbar/camera.png'),
    camera_active: require('@/assets/icons/chat/toolbar/camera-active.png'),
    red_packet: require('@/assets/icons/chat/toolbar/red_packet.png'),
    red_packet_active: require('@/assets/icons/chat/toolbar/red_packet-active.png'),
    emoji: require('@/assets/icons/chat/toolbar/emoji.png'),
    emoji_active: require('@/assets/icons/chat/toolbar/emoji-active.png'),
    more: require('@/assets/icons/chat/toolbar/more.png'),
    more_active: require('@/assets/icons/chat/toolbar/more-active.png'),

    // voice
    mic: require('@/assets/icons/chat/voice/mic.png'),

    // more
    more_photo: require('@/assets/icons/chat/more/photo.png'),
    more_transfer: require('@/assets/icons/chat/more/transfer.png'),
    more_video: require('@/assets/icons/chat/more/video.png'),
    more_collect: require('@/assets/icons/chat/more/collect.png'),
    more_red_packet: require('@/assets/icons/chat/more/red_packet.png'),
    more_card: require('@/assets/icons/chat/more/card.png'),
    more_phone: require('@/assets/icons/chat/more/phone.png'),
    more_contact: require('@/assets/icons/chat/more/contact.png'),
    more_file: require('@/assets/icons/chat/more/file.png'),
  });

  Assets.loadAssetsGroup('page.groupchat', {
    groupcreate: require('@/assets/icons/groupchat/groupcreate.png'),

    // 群设置
    plus: require('@/assets/icons/groupchat/plus.png'),
    minus: require('@/assets/icons/groupchat/minus.png'),

    // 群公告
    file: require('@/assets/icons/groupchat/file.png'),
    location: require('@/assets/icons/groupchat/location.png'),
    photo: require('@/assets/icons/groupchat/photo.png'),
  });
};
