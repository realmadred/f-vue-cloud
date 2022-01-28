import { Module } from 'vuex';
import { Session } from '/@/utils/storage';
// 此处加上 `.ts` 后缀报错，具体原因不详
import { UserPermsState, RootStateTypes } from '/@/store/interface/index';
import { SET_USER_PERMS, SESSION_USER_PERM } from '/@/api/constant';

const userPermsModule: Module<UserPermsState, RootStateTypes> = {
	namespaced: true,
	state: {
		perms: [],
	},
	mutations: {
		// 设置用户信息
		[SET_USER_PERMS](state: any, data: object) {
			state.perms = data;
		},
	},
	actions: {
		// 设置用户信息
		async [SET_USER_PERMS]({ commit }, data: object) {
			if (data) {
				commit(SET_USER_PERMS, data);
			} else {
				if (Session.get(SESSION_USER_PERM)) commit(SET_USER_PERMS, Session.get(SESSION_USER_PERM));
			}
		},
	},
};

export default userPermsModule;
