import React from 'react';
import {useTranslation} from 'react-i18next';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createStackNavigator} from '@react-navigation/stack';
import {useApp} from '@/hooks';

import {darkTheme, defaultTheme} from './theme';

import HeaderLeft from '@/components/HeaderLeft';
import RootTab from '@/components/Tab/RootTab';

import Chat from '@/pages/Chat';
import RedPacket from '@/pages/RedPacket';
import RedPacketDetail from '@/pages/RedPacketDetail';
import ForwardChat from '@/pages/ForwardChat';

import GroupChat from '@/pages/GroupChat/Chat';
import GroupChatStart from '@/pages/GroupChat/Start';
import GroupChatCreate from '@/pages/GroupChat/Create';
import GroupChatCreateByCode from '@/pages/GroupChat/CreateByCode';
import GroupChatJoin from '@/pages/GroupChat/Join';
import GroupChatSetting from '@/pages/GroupChat/Setting';
import GroupChatInfo from '@/pages/GroupChat/Info';
import GroupChatMember from '@/pages/GroupChat/Member';
import GroupChatQRcode from '@/pages/GroupChat/QRcode';
import GroupChatNotice from '@/pages/GroupChat/Notice';
import GroupChatManage from '@/pages/GroupChat/Manage';
import GroupChatRecords from '@/pages/GroupChat/ChatRecords';
import GroupChatMuteMember from '@/pages/GroupChat/MuteMember';

import InviteContact from '@/pages/InviteContact';
import SelectContact from '@/pages/SelectContact';
import ContactAdd from '@/pages/Contact/Add';
import ContactSelect from '@/pages/Contact/Select';
import ContactInfo from '@/pages/Contact/Info';
import ContactSetting from '@/pages/Contact/Setting';
import ContactTag from '@/pages/Contact/Tag';

import UserProfile from '@/pages/UserProfile';
import UserCollect from '@/pages/UserCollect';
import UserPay from '@/pages/UserPay';
import UserPrivacy from '@/pages/UserPrivacy';
import UserWallet from '@/pages/UserWallet';
import UserWithdrawal from '@/pages/UserWithdrawal';
import UserRecharge from '@/pages/UserRecharge';
import Security from '@/pages/Security';
import Setting from '@/pages/Setting';
import ModifyPhone from '@/pages/ModifyPhone';
import ModifyPassword from '@/pages/ModifyPassword';
import AboutUs from '@/pages/AboutUs';
import ChatFont from '@/pages/ChatFont';

import CircleFriends from '@/pages/CircleFriends';
import UserIndex from '@/pages/CircleFriends/userIndex';
import MyPublished from '@/pages/CircleFriends/myPublished';
import Detail from '@/pages/CircleFriends/detail';
import Publish from '@/pages/CircleFriends/publish';
import WhoWatch from '@/pages/CircleFriends/whoWatch';
import Location from '@/pages/CircleFriends/location';
import LocationSearch from '@/pages/CircleFriends/locationSearch';
import CircleContacts from '@/pages/CircleFriends/contacts';
import Label from '@/pages/CircleFriends/label';
import CreateLabel from '@/pages/CircleFriends/createLabel';
import LabelContacts from '@/pages/CircleFriends/labelContacts';
import PictureDetails from '@/pages/CircleFriends/pictureDetails';
import Blacklist from '@/pages/Blacklist';
import GroupChatList from '@/pages/GroupChatList';
import AddFriends from '@/pages/AddFriends';
import MessageList from '@/pages/CircleFriends/messageList';

import PartyIndex from '@/pages/Party';
import News from '@/pages/News';
import NewsDetail from '@/pages/News/detail';
import FrandchiseeIndex from '@/pages/Franchisee';
import FranchiseeDetail from '@/pages/Franchisee/detail';
import UploadData from '@/pages/Franchisee/uploadData';
import Examine from '@/pages/Franchisee/examine';
import EditInfo from '@/pages/Franchisee/editInfo';
import TeamMembers from '@/pages/Franchisee/teamMembers';

import OperatorIndex from '@/pages/Operator';
import OperatorDetail from '@/pages/Operator/detail';
import OperatorUploadData from '@/pages/Operator/uploadData';
import OperatorExamine from '@/pages/Operator/examine';
import OperatorEditInfo from '@/pages/Operator/editInfo';
import OperatorTeamMembers from '@/pages/Operator/teamMembers';

import ScanQRcode from '@/pages/ScanQRcode';
import NewFriend from '@/pages/NewFriend';
import GroupVerify from '@/pages/GroupVerify';
import ContactBusiness from '@/pages/ContactBusiness';
import FilesIndex from '@/pages/Files';
import InviteGroup from '@/pages/GroupChat/Invite';

import SetPayPassword from '@/pages/SetPayPassword';
import GroupRedPacket from '@/pages/GroupChat/GroupRedPacket';
import CashIndex from '@/pages/UserWallet/Cash';

import {StackRouter, TabRouter} from './router';
import Login from '@/pages/Login';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

import {useSelector, shallowEqual} from 'react-redux';
import SignIn from '@/pages/SignIn';
import Record from '@/pages/SignIn/record';
import FilePreview from '@/pages/FilePreview';
import PrivacyPolicy from '@/pages/Login/PrivacyPolicy';
import UserAgreement from '@/pages/Login/UserAgreement';
import ForgotPassword from '@/pages/Login/ForgotPassword';
import RealName from '@/pages/RealName';

export default function Navigation() {
  const {t} = useTranslation();
  const loginToken = useSelector(
    (state: any) => state.user.token,
    shallowEqual,
  );
  return (
    <NavigationContainer
      theme={useApp().darkMode ? defaultTheme : defaultTheme}>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          headerTitleAlign: 'center', // android默认'left', ios始终是'center'
          headerShadowVisible: false,
          // animationEnabled: false,
          freezeOnBlur: true,
          headerLeft: () => <HeaderLeft />,
        }}>
        {!loginToken ? (
          <>
            <Stack.Screen name="login" component={Login} />

            <Stack.Screen name="forgotPassword" component={ForgotPassword} />
          </>
        ) : (
          <>
            {/* 单聊 */}
            <Stack.Screen
              name="RootTab"
              component={RootTab}
              options={{headerShown: false}}
            />
            <Stack.Group>
              <Stack.Screen
                options={{
                  gestureEnabled: false, // 禁用手势返回
                }}
                name="Chat"
                component={Chat}
              />
              <Stack.Screen
                name="RedPacket"
                component={RedPacket}
                options={{
                  title: t('发红包'),
                }}
              />
              <Stack.Screen
                name="GroupRedPacket"
                component={GroupRedPacket}
                options={{
                  title: t('发红包'),
                }}
              />
              <Stack.Screen
                name="RedPacketDetail"
                component={RedPacketDetail}
                options={{
                  title: '',
                }}
              />
              <Stack.Screen
                name="contactBusiness"
                component={ContactBusiness}
                options={{
                  title: t('名片'),
                }}
              />
              <Stack.Screen
                name="filesIndex"
                component={FilesIndex}
                options={{
                  title: t('文件'),
                }}
              />
              <Stack.Screen
                name="filePreview"
                component={FilePreview}
                options={{
                  title: t('文件预览'),
                }}
              />
            </Stack.Group>

            {/* 群聊 */}
            <Stack.Group>
              <Stack.Screen
                name="GroupChat"
                component={GroupChat}
                options={({route}) => ({
                  title: route.params?.name,
                })}
              />
              <Stack.Screen
                name="GroupChatStart"
                component={GroupChatStart}
                options={{
                  title: t('发起群聊'),
                }}
              />
              <Stack.Screen
                name="GroupChatCreate"
                component={GroupChatCreate}
                options={{
                  title: t('创建群组'),
                }}
              />
              <Stack.Screen
                name="GroupChatCreateByCode"
                component={GroupChatCreateByCode}
                options={{
                  title: t('面对面发起群'),
                }}
              />
              <Stack.Screen
                name="GroupChatJoin"
                component={GroupChatJoin}
                options={{
                  title: t('加入群聊'),
                }}
              />
              <Stack.Screen
                name="GroupChatSetting"
                component={GroupChatSetting}
                options={{
                  title: t('群聊设置'),
                }}
              />
              <Stack.Screen
                name="GroupChatInfo"
                component={GroupChatInfo}
                options={{
                  title: t('群聊设置'),
                }}
              />
              <Stack.Screen
                name="GroupChatMember"
                component={GroupChatMember}
                options={{
                  title: t('群聊成员'),
                }}
              />
              <Stack.Screen
                name="GroupChatQRcode"
                component={GroupChatQRcode}
                options={{
                  title: t(''),
                  headerShown: false,
                }}
              />
              <Stack.Screen
                name="GroupChatNotice"
                component={GroupChatNotice}
                options={{
                  title: t('群公告'),
                }}
              />
              <Stack.Screen
                name="GroupChatManage"
                component={GroupChatManage}
                options={{
                  title: t('群管理'),
                }}
              />
              <Stack.Screen
                name="inviteGroup"
                component={InviteGroup}
                options={{
                  title: t('群邀请'),
                }}
              />
              <Stack.Screen
                name="AddFriends"
                component={AddFriends}
                options={{
                  title: t('添加朋友'),
                  headerShown: false,
                }}
              />
              <Stack.Screen
                name="GroupChatRecords"
                component={GroupChatRecords}
                options={{
                  title: t('查找聊天记录'),
                  headerShown: false,
                }}
              />
              <Stack.Screen
                name="GroupChatMuteMember"
                component={GroupChatMuteMember}
                options={{
                  title: t('禁言列表'),
                  headerShown: false,
                }}
              />
              <Stack.Screen
                name="ForwardChat"
                component={ForwardChat}
                options={{
                  title: t('消息转发'),
                  headerShown: false,
                }}
              />
            </Stack.Group>

            {/* 联系人 */}
            <Stack.Group>
              <Stack.Screen name="InviteContact" component={InviteContact} />
              <Stack.Screen name="SelectContact" component={SelectContact} />
              <Stack.Screen
                name="ContactAdd"
                component={ContactAdd}
                options={{
                  title: t('添加联系人'),
                  headerShown: false,
                }}
              />
              <Stack.Screen name="ContactSelect" component={ContactSelect} />
              <Stack.Screen name="ContactInfo" component={ContactInfo} />
              <Stack.Screen name="ContactSetting" component={ContactSetting} />
              <Stack.Screen name="ContactTag" component={ContactTag} />
              <Stack.Screen name="Blacklist" component={Blacklist} />
              <Stack.Screen name="GroupChatList" component={GroupChatList} />
              <Stack.Screen name="NewFriend" component={NewFriend} />
              <Stack.Screen name="GroupVerify" component={GroupVerify} />
            </Stack.Group>

            {/* 发现 */}
            <Stack.Group>
              <Stack.Screen
                options={{
                  headerShown: false,
                }}
                name="circleFirends"
                component={CircleFriends}
              />
              <Stack.Screen
                options={{}}
                name="pictureDetails"
                component={PictureDetails}
              />
              <Stack.Screen
                options={{
                  title: t('提醒谁看'),
                }}
                name="circleContacts"
                component={CircleContacts}
              />
              <Stack.Screen
                options={{
                  title: t('谁可以看'),
                }}
                name="whoWatch"
                component={WhoWatch}
              />
              <Stack.Screen
                options={{
                  title: t('标签'),
                }}
                name="label"
                component={Label}
              />

              <Stack.Screen
                options={{
                  title: t('标签联系人'),
                }}
                name="labelContacts"
                component={LabelContacts}
              />

              <Stack.Screen
                options={{
                  title: t('我的'),
                  headerShown: false,
                }}
                name="userFriendIndex"
                component={UserIndex}
              />

              <Stack.Screen
                options={{
                  title: t('所在位置'),
                }}
                name="locationSearch"
                component={LocationSearch}
              />
              <Stack.Screen name="所在位置" component={Location} />

              <Stack.Screen
                options={{
                  title: t('发布'),
                  gestureEnabled: false, // 禁用手势返回
                }}
                name="publishFriends"
                component={Publish}
              />

              <Stack.Screen
                name="MyPublished"
                options={{
                  title: t('我的发表'),
                }}
                component={MyPublished}
              />
              <Stack.Screen
                options={{
                  title: t('详情'),
                }}
                name="circleDetail"
                component={Detail}
              />
              <Stack.Screen
                options={{
                  title: t('新建标签'),
                }}
                name="createLabel"
                component={CreateLabel}
              />
              <Stack.Screen
                options={{
                  title: t('朋友圈消息'),
                }}
                name="circleMessageList"
                component={MessageList}
              />
            </Stack.Group>
            {/* 新闻 */}
            <Stack.Group>
              <Stack.Screen
                options={{
                  title: '新闻',
                  headerShown: true,
                }}
                name="news"
                component={News}
              />

              <Stack.Screen
                options={{
                  title: '详情',
                  headerShown: true,
                }}
                name="newsDetail"
                component={NewsDetail}
              />
            </Stack.Group>
            {/* 签到 */}
            <Stack.Group>
              <Stack.Screen
                options={{
                  headerShown: false,
                }}
                name="signIn"
                component={SignIn}
              />

              <Stack.Screen
                options={{
                  title: '兑换记录',
                }}
                name="exchangeRecord"
                component={Record}
              />
            </Stack.Group>
            {/**吃喝玩乐 */}
            <Stack.Group>
              <Stack.Screen
                options={{title: t('吃喝玩乐')}}
                name="party"
                component={PartyIndex}
              />
            </Stack.Group>
            {/**加盟商 */}
            <Stack.Group>
              <Stack.Screen name="frandchisee" component={FrandchiseeIndex} />

              <Stack.Screen
                options={({route}) => ({})}
                name="applyJoin"
                component={UploadData}
              />
              <Stack.Screen
                options={{
                  title: '审核中',
                }}
                name="examine"
                component={Examine}
              />
              <Stack.Screen
                name="franchiseeDetail"
                component={FranchiseeDetail}
              />
              <Stack.Screen
                options={{
                  title: '修改资料',
                }}
                name="frandEditInfo"
                component={EditInfo}
              />
              <Stack.Screen
                options={{
                  title: '团队成员',
                  headerShown: true,
                }}
                name="teamMembers"
                component={TeamMembers}
              />
            </Stack.Group>

            {/**运营商 */}
            <Stack.Group>
              <Stack.Screen name="operator" component={OperatorIndex} />

              <Stack.Screen
                options={({route}) => ({})}
                name="operatoApplyJoin"
                component={OperatorUploadData}
              />
              <Stack.Screen
                options={{
                  title: '审核中',
                }}
                name="operatorExamine"
                component={OperatorExamine}
              />
              <Stack.Screen name="operatorDetail" component={OperatorDetail} />
              <Stack.Screen
                options={{
                  title: '修改资料',
                }}
                name="operatorEditInfo"
                component={OperatorEditInfo}
              />
              <Stack.Screen
                options={{
                  title: '团队成员',
                  headerShown: true,
                }}
                name="operatorTeamMembers"
                component={OperatorTeamMembers}
              />
            </Stack.Group>
            {/* 扫一扫 */}
            <Stack.Group>
              <Stack.Screen
                options={{
                  title: '扫一扫',
                }}
                name="scanQRcode"
                component={ScanQRcode}
              />
            </Stack.Group>
            {/* 个人中心 */}
            <Stack.Group>
              <Stack.Screen
                name="UserProfile"
                component={UserProfile}
                options={{
                  title: t('用户信息'),
                }}
              />
              <Stack.Screen
                name="setPayPassword"
                component={SetPayPassword}
                options={{
                  title: t('设置支付密码'),
                }}></Stack.Screen>
              <Stack.Screen
                name="UserWallet"
                component={UserWallet}
                options={{
                  headerShown: false,
                }}
              />
              <Stack.Screen
                name="UserWithdrawal"
                component={UserWithdrawal}
                options={{
                  headerShown: false,
                }}
              />
              <Stack.Screen
                name="UserRecharge"
                component={UserRecharge}
                options={{
                  headerShown: false,
                }}
              />
              <Stack.Screen
                name="UserPay"
                component={UserPay}
                options={{
                  headerShown: false,
                }}
              />
              <Stack.Screen
                name="Cash"
                component={CashIndex}
                options={{
                  headerShown: false,
                }}
              />
              <Stack.Screen
                name="UserCollect"
                component={UserCollect}
                options={{title: t('我的收藏')}}
              />
              <Stack.Screen
                name="UserPrivacy"
                component={UserPrivacy}
                options={{title: t('隐私管理')}}
              />
              <Stack.Screen
                name="Security"
                component={Security}
                options={{title: t('安全中心')}}
              />
              <Stack.Screen
                name="Setting"
                component={Setting}
                options={{title: t('设置')}}
              />
              <Stack.Screen
                name="ModifyPhone"
                component={ModifyPhone}
                options={{
                  headerShown: false,
                }}
              />
              <Stack.Screen
                name="ModifyPassword"
                component={ModifyPassword}
                options={{
                  headerShown: false,
                }}
              />
              <Stack.Screen
                name="AboutUs"
                component={AboutUs}
                options={{
                  headerShown: false,
                }}
              />
              <Stack.Screen
                name="ChatFont"
                component={ChatFont}
                options={{
                  headerShown: false,
                }}
              />
              <Stack.Screen
                name="realName"
                component={RealName}
                options={{
                  headerShown: false,
                }}
              />
            </Stack.Group>
          </>
        )}
        <Stack.Screen name="privacyPolicy" component={PrivacyPolicy} />
        <Stack.Screen name="userAgreement" component={UserAgreement} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
