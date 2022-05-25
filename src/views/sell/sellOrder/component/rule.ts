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
    amount: [
        {
            type: 'number',
            min: 0,
            max: 999999999,
            required: true,
            message: '请输入0-999999999',
            trigger: 'change',
        },
    ],
    payAmount: [
        {
            type: 'number',
            min: 0,
            max: 999999999,
            required: true,
            message: '请输入0-999999999',
            trigger: 'change',
        },
    ],
    payMethod: [
        {
            type: 'number',
            required: true,
            message: '请选择支付方式',
            trigger: 'change',
        },
    ],
    discountAmount: [
        {
            type: 'number',
            min: 0,
            max: 999999999,
            message: '请输入0-999999999',
            trigger: 'change',
        },
    ],
    lastPayAmount: [
        {
            type: 'number',
            min: 0,
            max: 999999999,
            message: '请输入0-999999999',
            trigger: 'change',
        },
    ],
    remark: [
        {
            type: 'string',
            min: 1,
            max: 100,
            required: true,
            message: '请输入1-100位',
            trigger: 'change',
        },
    ],
}
