module.exports = (sequelize, DataTypes) => {
    const Activities = sequelize.define('activities', {
        _id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                notEmpty: true,
            },
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true,
            },
        },
        user: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true,
            },
        },
        tochuc: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true,
            },
        },
        phoihop: {
            type: DataTypes.STRING,
        },
        ngaybatdau: {
            type: DataTypes.DATEONLY,
            allowNull: false,
            validate: {
                notEmpty: true,
            },
        },
        ngayketthuc: {
            type: DataTypes.DATEONLY,
            allowNull: false,
            validate: {
                notEmpty: true,
            },
        },
        diadiem: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true,
            },
        },
        vanban: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true,
            },
        },
        noidung: {
            type: DataTypes.TEXT,
            allowNull: false,
            defaultValue: '',
        },
        ketqua: {
            type: DataTypes.TEXT,
            allowNull: false,
            defaultValue: '',
        },
        soluong: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: '',
        },
        kinhphi: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: '',
        },
        minhchung: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: '',
        },
        nhanxet: {
            type: DataTypes.TEXT,
            allowNull: false,
            defaultValue: '',
        },
        renluyen: {
            type: DataTypes.STRING(3),
            allowNull: false,
            defaultValue: '',
        },
        diem: {
            type: DataTypes.TINYINT(1),
            allowNull: false,
            validate: {
                notEmpty: true,
            },
            defaultValue: 0,
        },
        ketluan: {
            type: DataTypes.TEXT,
            allowNull: false,
            defaultValue: '',
        },
        trangthai: {
            type: DataTypes.TINYINT(1),
            allowNull: false,
            defaultValue: false,
        },
        createdAt: {
            type: 'TIMESTAMP',
            allowNull: false,
            defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
        },
        updatedAt: {
            type: 'TIMESTAMP',
            allowNull: false,
            defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
        },
    });

    return Activities;
};
