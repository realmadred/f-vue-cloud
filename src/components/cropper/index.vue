<template>
	<div>
		<el-dialog :title="title" v-model="isShowDialog" width="769px">
			<div class="cropper-warp">
				<div class="cropper-warp-left" @mousewheel="mouseWheel">
					<img :src="cropperImg" class="cropper-warp-left-img" />
				</div>
				<div class="cropper-warp-right">
					<div class="cropper-warp-right-title">预览</div>
					<div class="cropper-warp-right-item">
						<div class="cropper-warp-right-value">
							<img :src="cropperImgBase64" class="cropper-warp-right-value-img" />
						</div>
						<div class="cropper-warp-right-label">100 x 100</div>
					</div>
					<div class="cropper-warp-right-item">
						<div class="cropper-warp-right-value">
							<img :src="cropperImgBase64" class="cropper-warp-right-value-img cropper-size" />
						</div>
						<div class="cropper-warp-right-label">50 x 50</div>
					</div>
				</div>
			</div>
			<template #footer>
				<span class="dialog-footer">
					<el-upload
						:show-file-list="false"
						class="upload"
						accept="image/*"
						action
						:http-request="selectFile"
					>
						<el-button type="primary" size="small">选择文件</el-button>
					</el-upload>
					<el-button @click="onCancel" size="small">取 消</el-button>
					<el-button type="primary" @click="onSubmit" size="small">确 定</el-button>
				</span>
			</template>
		</el-dialog>
	</div>
</template>

<script lang="ts">
import { reactive, toRefs, toRef, nextTick } from 'vue';
import Cropper from 'cropperjs';
import 'cropperjs/dist/cropper.css';
import { getPreSignedPutObjectUrl, MyFile, uploadFileByUrl } from '/@/api/file';
import { getPath } from '/@/utils/common';
export default {
	name: 'cropperIndex',
	setup(props: object, context: any) {
		const title = toRef(props, 'title' as never) || '头像'
		const state = reactive({
			isShowDialog: false,
			cropperImg: '',
			cropperImgBase64: '',
			cropper: {} as Cropper,
		});

		let init = false

		// 打开弹窗
		const openDialog = (imgs: any) => {
			state.cropperImg = imgs;
			state.isShowDialog = true;
			nextTick(() => {
				initCropper(imgs);
			});
		};
		// 关闭弹窗
		const closeDialog = () => {
			state.isShowDialog = false;
			setTimeout(() => {
				state.cropperImgBase64 = ''
			}, 80)
		};
		// 取消
		const onCancel = () => {
			closeDialog();
		};

		// 鼠标滚动事件
		const mouseWheel = (e: any) => {
			if (init) {
				state.cropper.zoom(e.wheelDelta / 1500)
			}
		};

		// 更换
		const onSubmit = () => {
			state.cropper.getCroppedCanvas().toBlob(bolb => {
				getPreSignedPutObjectUrl('.png').then(res => {
					uploadFileByUrl(bolb!, res.data)
					context.emit('on-croppe', getPath(res.data))
					closeDialog();
				})
			})
		};

		const selectFile = (file: MyFile) => {
			const reader = new FileReader();
			reader.onload = e => {
				const url = e.target!.result as string;
				if (init) {
					state.cropper.replace(url, false)
				} else {
					// 重新初始化
					state.cropperImg = url;
					initCropper('');
					state.cropper.replace(url, false)
				}
			}
			reader.readAsDataURL(file.file);
		}

		// 初始化cropperjs图片裁剪
		const initCropper = (url: string) => {
			const letImg: any = document.querySelector('.cropper-warp-left-img');
			if (init && url) {
				state.cropper.replace(url, false)
				return
			}
			try {
				state.cropper = new Cropper(letImg, {
					viewMode: 1,
					dragMode: 'none',
					initialAspectRatio: 1,
					aspectRatio: 1,
					preview: '.before',
					background: false,
					autoCropArea: 0.8,
					zoomOnWheel: false,
					crop: () => {
						state.cropperImgBase64 = state.cropper.getCroppedCanvas().toDataURL('image/jpeg');
					},
				});
				init = true
			} catch (e) {
				state.cropperImg = ''
				init = false
			}

		};
		return {
			openDialog,
			closeDialog,
			onCancel,
			onSubmit,
			selectFile,
			title,
			initCropper,
			mouseWheel,
			...toRefs(state),
		};
	},
};
</script>

<style scoped lang="scss">
.cropper-warp {
	display: flex;
	.cropper-warp-left {
		position: relative;
		display: inline-block;
		height: 350px;
		flex: 1;
		border: var(--el-border-base);
		background: var(--color-whites);
		overflow: hidden;
		background-repeat: no-repeat;
		cursor: move;
		border-radius: var(--el-border-radius-base);
		.cropper-warp-left-img {
			width: 100%;
			height: 100%;
		}
	}
	.cropper-warp-right {
		width: 150px;
		height: 350px;
		.cropper-warp-right-title {
			text-align: center;
			height: 20px;
			line-height: 20px;
		}
		.cropper-warp-right-item {
			margin: 15px 0;
			.cropper-warp-right-value {
				display: flex;
				.cropper-warp-right-value-img {
					width: 100px;
					height: 100px;
					border-radius: var(--el-border-radius-circle);
					margin: auto;
				}
				.cropper-size {
					width: 50px;
					height: 50px;
				}
			}
			.cropper-warp-right-label {
				text-align: center;
				font-size: 12px;
				color: var(--el-text-color-primary);
				height: 30px;
				line-height: 30px;
			}
		}
	}
}

.upload {
	position: absolute;
}
</style>
