import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../connection.js';

class discountModel extends Model {}

discountModel.init({
    id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    discountPercentage: {
    type: DataTypes.FLOAT,
    allowNull: false
    },
    startDate: {
    type: DataTypes.DATE,
    allowNull: false
    },
    endDate: {
    type: DataTypes.DATE,
    allowNull: false
    },
}, {
    sequelize,
    modelName: 'Discount',
    timestamps: false
});
export default discountModel;
