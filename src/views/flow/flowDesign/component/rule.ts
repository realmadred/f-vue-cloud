export const rule = {
        flowId: [
        {
            type: 'string' ,
            min: 2,
            max: 15,
            required: true,
            message: '请输入2-15位流程id',
            trigger: 'change',
        },
    ],
    name: [
        {
            type: 'string' ,
            min: 2,
            max: 15,
            required: true,
            message: '请输入2-15位流程名称',
            trigger: 'change',
        },
    ],
    xml: [
        {
            type: 'string' ,
            min: 2,
            max: 15,
            required: true,
            message: '请输入2-15位xml',
            trigger: 'change',
        },
    ],
    svg: [
        {
            type: 'string' ,
            min: 2,
            max: 15,
            required: true,
            message: '请输入2-15位svg',
            trigger: 'change',
        },
    ],
}
