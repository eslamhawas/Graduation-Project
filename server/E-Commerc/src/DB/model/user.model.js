import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../connection.js';
import ProfitMargin from './profitMargin.model.js';
import ProfitMarginModel from './profitMargin.model.js';

class userModel extends Model {}

userModel.init({
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    phoneNumber: {
        type: DataTypes.STRING,
        allowNull: false
    },
    role: {
        type: DataTypes.ENUM('customer', 'vendor', 'admin'),
        allowNull: false
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
}, {
    sequelize,
    modelName: 'User',
    timestamps: false
});
userModel.hasMany(ProfitMarginModel, {
    foreignKey: 'userId'});
ProfitMargin.belongsTo(userModel, {
    foreignKey: 'userId',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
});
export default userModel;


