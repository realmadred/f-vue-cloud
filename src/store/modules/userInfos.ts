import { Module } from 'vuex';
import { Session } from '/@/utils/storage';
// 此处加上 `.ts` 后缀报错，具体原因不详
import { UserInfosState, RootStateTypes } from '/@/store/interface/index';
import { SET_USER_INFOS, SESSION_USER_INFO } from '/@/api/constant';

const userInfosModule: Module<UserInfosState, RootStateTypes> = {
	namespaced: true,
	state: {
		userInfos: {},
	},
	mutations: {
		// 设置用户信息
		[SET_USER_INFOS](state: any, data: object) {
			state.userInfos = data;
		},
	},
	actions: {
		// 设置用户信息
		async [SET_USER_INFOS]({ commit }, data: object) {
			if (data) {
				commit(SET_USER_INFOS, data);
			} else {
				if (Session.get(SESSION_USER_INFO)) commit(SET_USER_INFOS, Session.get(SESSION_USER_INFO));
			}
		},
	},
};

export default userInfosModule;
