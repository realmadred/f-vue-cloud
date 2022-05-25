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
    address: [
        {
            type: 'string',
            min: 2,
            max: 60,
            required: true,
            message: '请输入2-60位地址',
            trigger: 'change',
        },
    ],
    houseNumber: [
        {
            type: 'number',
            min: 1,
            max: 99999,
            required: true,
            message: '请输入1-99999',
            trigger: 'change',
        },
    ],
}
