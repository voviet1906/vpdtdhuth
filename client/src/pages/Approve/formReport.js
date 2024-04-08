const inputs = [
    {
        id: 1,
        classify: 'textarea',
        name: 'nhanxet',
        type: 'text',
        placeholder: 'Hoạt động ...',
        label: 'Nhận xét',
        required: true,
    },
    {
        id: 2,
        classify: 'select',
        name: 'renluyen',
        lable: 'Mục rèn luyện',
        link: 'training-point',
    },
    {
        id: 3,
        name: 'diem',
        type: 'number',
        placeholder: '3',
        label: 'Điểm rèn luyện',
        value: '',
        required: true,
    },
    {
        id: 4,
        classify: 'textarea',
        name: 'ketluan',
        type: 'text',
        placeholder: 'Hoạt động ...',
        label: 'Kết luận',
        required: true,
    },
    {
        id: 5,
        name: 'trangthai',
        type: 'radio',
        value: '2',
        label: 'Không duyệt',
    },
    {
        id: 6,
        name: 'trangthai',
        type: 'radio',
        value: '1',
        label: 'Duyệt',
    },
];

export default inputs;
