export const rule = {
    name: [
        {
            type: 'string',
            min: 2,
            max: 15,
            required: true,
            message: '请输入2-15位名称',
            trigger: 'change',
        },
    ],
    code: [
        {
            type: 'string',
            min: 2,
            max: 15,
            required: true,
            message: '请输入2-15位编码',
            trigger: 'change',
        },
    ],
}