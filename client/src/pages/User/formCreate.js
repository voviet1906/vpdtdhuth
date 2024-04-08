const inputs = [
    {
        id: 1,
        name: '_id',
        type: 'text',
        placeholder: 'lchsv.ktvt',
        label: 'Tài khoản',
        required: true,
    },
    {
        id: 2,
        name: 'name',
        type: 'text',
        placeholder: 'Liên Chi hội sinh viên Khoa Kinh tế vận tải',
        label: 'Tên',
        required: true,
    },
    {
        id: 3,
        name: 'role',
        type: 'radio',
        value: 'M',
        label: 'Quản lý',
    },
    {
        id: 4,
        name: 'role',
        type: 'radio',
        value: 'U',
        label: 'Người dùng',
    },
];

export default inputs;
