import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../connection.js';
import UserModel from './user.model.js';

class CartModel extends Model {}

CartModel.init({
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    sequelize,
    modelName: 'Cart',
    timestamps: true
});

// Cart-User one-to-many relation
CartModel.belongsTo(UserModel, {
    foreignKey: 'userId',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
});
UserModel.hasOne(CartModel, {
    foreignKey: 'userId',
})
export default CartModel



