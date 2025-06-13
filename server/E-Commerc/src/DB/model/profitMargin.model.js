import { DataTypes, Model } from 'sequelize';
import {sequelize} from '../connection.js';

class ProfitMarginModel extends Model {}

ProfitMarginModel.init({
    userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    },
    profitPercentage: {
    type: DataTypes.FLOAT,
    allowNull: false,
    },
    startDate: {
    type: DataTypes.DATE,
    allowNull: false,
    },
    endDate: {
    type: DataTypes.DATE,
    allowNull: true,
    },
}, {
    sequelize,
    modelName: 'ProfitMargin',
    timestamps: false,
})

export default ProfitMarginModel

