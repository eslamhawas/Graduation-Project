import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../connection.js';
import userModel from './user.model.js';
import CartModel from './cart.model.js';
import OrderProductsModel from './OrderItem.model.js';
import discountModel from './discount.model .js';
export const orderStatus = {
    
    pending: "PENDING",
    fulfilled: "FULFILLED",
    cancelled: "CANCELLED",
    shipped: "SHIPPED",
    delivered: "DELIVERED"
}

class orderModel extends Model {}
orderModel.init({
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    cartId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    discountId: {
        type: DataTypes.INTEGER,
    },
    totalPrice: {
        type: DataTypes.FLOAT,
    },
    status: {
            type: DataTypes.ENUM(...Object.values(orderStatus)),
            defaultValue: orderStatus.pending,
    },
    unitPrice: {
        type: DataTypes.FLOAT,
        },
    
    email: {
        type: DataTypes.STRING,
        },
}, {
    sequelize,
    modelName: 'Order',
    timestamps: true
});

 // User-Order one-to-many relation
orderModel.belongsTo(userModel, {
    foreignKey: 'userId',
    onDelete: 'CASCADE',
    onUpdate:'CASCADE'
});

userModel.hasMany(orderModel, {
    foreignKey: 'userId',
});

orderModel.belongsTo(CartModel, {
    foreignKey: "cartId" ,
    onDelete: 'CASCADE',
    onUpdate:'CASCADE'});
CartModel.hasOne(orderModel,
    { foreignKey: "cartId" })

orderModel.belongsTo(discountModel, {
    foreignKey: 'discountId',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
})
    
discountModel.hasOne(orderModel, {
        foreignKey: 'discountId'
})

OrderProductsModel.belongsTo(orderModel, { foreignKey: 'orderId' });
orderModel.hasMany(OrderProductsModel, { foreignKey: 'orderId' });
export default orderModel;

