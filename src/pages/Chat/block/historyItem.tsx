import {useMemo} from 'react';
import {
	View,
	Text,
	Avatar,
	Icon,
	TouchableOpacity,
	RadioButton,
} from 'react-native-ui-lib';
import {shallowEqual, useDispatch, useSelector} from 'react-redux';

import imsdk, {IMSDK} from '@/utils/IMSDK';
import {RootState} from '@/store';

import SysContent from "./sysContent";
import ChatMessage from './chatContent';

export default function HistoryItem({
	source, 
	index, 
	showRadio,
	selecteds,
	setSelecteds,
	setForwardContent,
	setQuoteContent,
	setSelectContent
}:{
	source: IMSDK.Message, 
	index: number, 
	showRadio: boolean,
	selecteds: {[key: string]: boolean;},
	setSelecteds: (data: {[key: string]: boolean;}) => void,
	setForwardContent: (data: any) => void,
	setQuoteContent: (data: any) => void,
	setSelectContent: (data: any) => void,
	
}) {
	const msgItem = source;

	const systemConfig:any = useSelector<RootState>((state) => state.global.systemConfig, shallowEqual);
	const user_id = useSelector((state: RootState) => state.user.selfInfo.user_id, shallowEqual);
	const selfInfo = useSelector((state: RootState) => state.user.selfInfo, shallowEqual);
	const currentMemberList = useSelector((state: RootState) => state.contacts.currentMemberList,shallowEqual);
	
	let msgUserRole = "user", selfRole = "user";
	// console.log('currentMemberList=======>', currentMemberList)
	currentMemberList.forEach((i) => {
	  const id = i.user ? i.user.user_id : i.user_id;
	  if (id === msgItem.send_id) {
		msgUserRole = i.role;
	  }
	  if (id === user_id) {
		selfRole = i.role;
	  }
	});
  
	const key = useMemo(() => {
	  return msgItem.msg_id ?? Date.now() + index;
	}, [msgItem.msg_id]);


	const getContent = () => {
	  switch (msgItem.type) {
		case 1:
		case 2:
		case 3:
		case 4:
		case 5:
		case 6:
		case 7:
		case 9:
		  return (
			<ChatMessage
				{...msgItem}
				domId={key}
				msgUserRole={msgUserRole}
				selfRole={selfRole}
				memberList={currentMemberList}
				isMine={user_id === msgItem.send_id}
				showRadio={showRadio}
				selecteds={selecteds}
				setSelecteds={setSelecteds}
			/>
		  );
		  case 102:
			  return systemConfig.is_show_revoke==1?<SysContent type={msgItem.type} content={msgItem.content} />:null;
		case 400:
		  return (
			<ChatMessage
				{...msgItem}
				domId={key}
				msgUserRole={msgUserRole}
				selfRole={selfRole}
				memberList={currentMemberList}
				isMine={user_id === JSON.parse(msgItem.content).operator_id}
				showRadio={showRadio}
				selecteds={selecteds}
				setSelecteds={setSelecteds}
			/>
		  );
  
	  
		default:
		  return <SysContent type={msgItem.type} content={msgItem.content} />;
	  }
	};
  
	return getContent();
}