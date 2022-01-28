import type { ElForm } from 'element-plus'

export const submitForm = (formEl: InstanceType<typeof ElForm> | undefined, submit: Function) => {
    if (!formEl) return
    formEl.validate((valid) => {
        if (valid) {
            submit()
        } else {
            return false
        }
    })
}

export const resetForm = (formEl: InstanceType<typeof ElForm> | undefined) => {
    if (!formEl) return
    formEl.resetFields()
}