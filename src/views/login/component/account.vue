<template>
	<el-form class="login-content-form" :model="ruleForm" :rules="rules" ref="form">
		<el-form-item class="login-animation-one" prop="userName">
			<el-input type="text" :placeholder="$t('message.account.accountPlaceholder1')" v-model="ruleForm.userName"
				clearable autocomplete="off">
				<template #prefix>
					<el-icon class="el-input__icon">
						<elementUser />
					</el-icon>
				</template>
			</el-input>
		</el-form-item>
		<el-form-item class="login-animation-two" prop="password">
			<el-input :type="isShowPassword ? 'text' : 'password'"
				:placeholder="$t('message.account.accountPlaceholder2')" v-model="ruleForm.password"
				@keydown.enter="onSignIn" autocomplete="off">
				<template #prefix>
					<el-icon class="el-input__icon">
						<elementUnlock />
					</el-icon>
				</template>
				<template #suffix>
					<i class="iconfont el-input__icon login-content-password"
						:class="isShowPassword ? 'icon-yincangmima' : 'icon-xianshimima'"
						@click="isShowPassword = !isShowPassword"></i>
				</template>
			</el-input>
		</el-form-item>
		<el-form-item class="login-animation-four">
			<el-button type="primary" class="login-content-submit" round @click="submitForm(form, onSignIn)"
				:loading="loading.signIn">
				<span>{{ $t('message.account.accountBtnText') }}</span>
			</el-button>
		</el-form-item>
		<el-form-item class="login-animation-five">
			<el-button type="text" size="small">{{ $t('message.link.one3') }}</el-button>
			<el-button type="text" size="small">{{ $t('message.link.two4') }}</el-button>
		</el-form-item>
	</el-form>
</template>

<script lang="ts">
import { ref, toRefs, reactive, defineComponent, computed, getCurrentInstance } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import { useI18n } from 'vue-i18n';
import { initFrontEndControlRoutes } from '/@/router/frontEnd';
import { initBackEndControlRoutes } from '/@/router/backEnd';
import { useStore } from '/@/store/index';
import { signIn, getKey } from '/@/api/login/index';
import { getPerms } from '/@/api/menu/index';
import { ADMIN_ID, SET_USER_INFOS, SET_USER_PERMS, SESSION_TOKEN, SESSION_USER_INFO, USER_INFOS_MODULE, SESSION_USER_PERM, USER_PERMS_MODULE, AES_MODULE, SET_AES_KEY, SESSION_AES } from '/@/api/constant';
import { Session } from '/@/utils/storage';
import { formatAxis } from '/@/utils/formatTime';
import { publicKey, decrypt } from '/@/utils/rsa';
import { getCryptoKey, encryptMessage } from '/@/utils/aes';
import { submitForm } from '/@/utils/form';
export default defineComponent({
	name: 'loginAccount',
	setup() {
		const { t } = useI18n();
		const { proxy } = getCurrentInstance() as any;
		const form = ref()
		const store = useStore();
		const route = useRoute();
		const router = useRouter();
		const state = reactive({
			isShowPassword: false,
			ruleForm: {
				userName: '',
				password: '',
				code: '',
			},
			loading: {
				signIn: false,
			},
			rules: {
				userName: [
					{
						type: 'string',
						min: 2,
						max: 20,
						required: true,
						message: '请输入2-20位用户名',
						trigger: 'change',
					},
				],
				password: [
					{
						type: 'string',
						min: 6,
						max: 30,
						required: true,
						message: '请输入6-30位密码',
						trigger: 'change',
					},
				],
			}
		});

		// 时间获取
		const currentTime = computed(() => {
			return formatAxis(new Date());
		});

		// 登录
		const onSignIn = () => {
			// 模拟数据
			state.loading.signIn = true;
			getKey(publicKey).then((res) => {
				let strs = (decrypt(res.data) as string).split('|')
				const token: string = strs[0]
				// 缓存key
				Session.set(SESSION_AES, strs[1]);
				getCryptoKey(strs[1]).then(async (cryptoKey) => {
					// 请求登录接口
					const data = await encryptMessage(JSON.stringify({
						name: state.ruleForm.userName,
						password: state.ruleForm.password,
					}), cryptoKey)
					signIn({ data, token }).then(async (json) => {
						// 存储 token 到浏览器缓存
						Session.set(SESSION_TOKEN, json.data.token);
						// 存储用户信息到浏览器缓存
						delete json.data.token
						Session.set(SESSION_USER_INFO, json.data);
						// 1、请注意执行顺序(存储用户信息到vuex)
						store.dispatch(USER_INFOS_MODULE + '/' + SET_USER_INFOS, json.data);
						if (!store.state.themeConfig.themeConfig.isRequestRoutes) {
							// 前端控制路由，2、请注意执行顺序
							await initFrontEndControlRoutes();
						} else {
							// 模拟后端控制路由，isRequestRoutes 为 true，则开启后端控制路由
							// 添加完动态路由，再进行 router 跳转，否则可能报错 No match found for location with path "/"
							await initBackEndControlRoutes(true);

							// 获取用户按钮权限 管理员不需要获取
							if (json.data.id !== ADMIN_ID) {
								getPerms().then((res) => {
									Session.set(SESSION_USER_PERM, res.data);
									// 将用户权限存储起来
									store.dispatch(USER_PERMS_MODULE + '/' + SET_USER_PERMS, res.data);
								})
							}
						}
						signInSuccess();
					}).catch(() => {
						// 关闭 loading
						state.loading.signIn = false;
					})
				})
			}).catch(() => {
				// 关闭 loading
				state.loading.signIn = false;
			})
		};
		// 登录成功后的跳转
		const signInSuccess = () => {
			// 初始化登录成功时间问候语
			let currentTimeInfo = currentTime.value;
			// 登录成功，跳到转首页
			// 添加完动态路由，再进行 router 跳转，否则可能报错 No match found for location with path "/"
			// 如果是复制粘贴的路径，非首页/登录页，那么登录成功后重定向到对应的路径中
			if (route.query?.redirect) {
				router.push({
					path: route.query?.redirect as string,
					query: Object.keys(route.query?.params as any).length > 0 ? JSON.parse(route.query?.params as any) : '',
				});
			} else {
				router.push('/');
			}
			// 登录成功提示
			setTimeout(() => {
				// 关闭 loading
				state.loading.signIn = false;
				const signInText = t('message.signInText');
				ElMessage.success(`${currentTimeInfo}，${signInText}`);
				// 修复防止退出登录再进入界面时，需要刷新样式才生效的问题，初始化布局样式等(登录的时候触发，目前方案)
				proxy.mittBus.emit('onSignInClick');
			}, 300);
		};
		return {
			onSignIn,
			form,
			submitForm,
			...toRefs(state),
		};
	},
});
</script>

<style scoped lang="scss">
.login-content-form {
	margin-top: 20px;
	margin-bottom: 15px;

	.login-animation-one,
	.login-animation-two,
	.login-animation-three,
	.login-animation-four,
	.login-animation-five {
		opacity: 0;
		animation-name: error-num;
		animation-duration: 0.5s;
		animation-fill-mode: forwards;
	}

	.login-animation-one {
		animation-delay: 0.1s;
	}

	.login-animation-two {
		animation-delay: 0.2s;
	}

	.login-animation-three {
		animation-delay: 0.3s;
	}

	.login-animation-four {
		animation-delay: 0.4s;
		margin-bottom: 5px;
	}

	.login-animation-five {
		animation-delay: 0.5s;
	}

	.login-content-password {
		display: inline-block;
		width: 25px;
		cursor: pointer;

		&:hover {
			color: #909399;
		}
	}

	.login-content-code {
		display: flex;
		align-items: center;
		justify-content: space-around;

		.login-content-code-img {
			width: 100%;
			height: 40px;
			line-height: 40px;
			background-color: #ffffff;
			border: 1px solid rgb(220, 223, 230);
			color: #333;
			font-size: 16px;
			font-weight: 700;
			letter-spacing: 5px;
			text-indent: 5px;
			text-align: center;
			cursor: pointer;
			transition: all ease 0.2s;
			border-radius: 4px;
			user-select: none;

			&:hover {
				border-color: #c0c4cc;
				transition: all ease 0.2s;
			}
		}
	}

	.login-content-submit {
		width: 100%;
		letter-spacing: 2px;
		font-weight: 300;
		margin-top: 15px;
	}
}
</style>
