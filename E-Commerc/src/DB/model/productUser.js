import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../connection.js';
import userModel from './user.model.js';

class ProductProvider extends Model {}

ProductProvider.init({
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    productId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    sellPrice: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    hasPromotion: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    promotionPercentage: {
        type: DataTypes.FLOAT,
        allowNull: true,
        validate: {
            min: 0,
            max: 100
        }
    },
    promotionExpiryDate: {
        type: DataTypes.DATE,
        allowNull: true
    }
}, {
    sequelize,
    modelName: 'ProductProvider',
    timestamps: false
});

ProductProvider.belongsTo(userModel, { foreignKey: 'userId' });
userModel.hasMany(ProductProvider, { foreignKey: 'userId' });

export default ProductProvider;
