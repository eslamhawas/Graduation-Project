import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../connection.js';
import CategoryModel from './Category.model.js';
import userModel from './user.model.js';
import orderModel from './Order.model.js';
import CartModel from './cart.model.js';
import ProductProvider from './productUser.js';
import OrderProductsModel from './OrderItem.model.js';
import cartProductsModel from './cartProduct.js';

class productModel extends Model {}

productModel.init({
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    color: {
        type: DataTypes.STRING
    },
    attachments: {
        type: DataTypes.JSON,
    },
    brand: {
    type: DataTypes.STRING,
    allowNull: true,
    },
    isAccept: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    isAvailable: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    length: {
        type: DataTypes.FLOAT
    },
    width: {
        type: DataTypes.FLOAT
    },
    categoryId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
}, {
    sequelize,
    modelName: 'Product',
    timestamps: true
});

// Category-Product one-to-many relation
productModel.belongsTo(CategoryModel, {
    foreignKey: 'categoryId',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
});

CategoryModel.hasMany(productModel, {
    foreignKey: 'categoryId',
});
productModel.belongsToMany(userModel, {
    through: ProductProvider,
    foreignKey: 'productId',
    otherKey: 'userId'
});
userModel.belongsToMany(productModel, {
    through: ProductProvider,
    foreignKey: 'userId',
    otherKey: 'productId'
});

productModel.belongsToMany(orderModel, {
    through: OrderProductsModel,
    foreignKey: 'productId',
    otherKey: 'orderId'
});
orderModel.belongsToMany(productModel, {
    through: OrderProductsModel,
    foreignKey: 'orderId',
    otherKey: 'productId'
});
productModel.belongsToMany(CartModel, {
    through: cartProductsModel,
    foreignKey: 'productId',
    otherKey: 'cartId',
})
CartModel.belongsToMany(productModel, {
    through: cartProductsModel,
    foreignKey: 'cartId',
    otherKey: 'productId',
})
ProductProvider.belongsTo(productModel, { foreignKey: 'productId' })
productModel.hasMany(ProductProvider, { foreignKey: 'productId' , as: 'UserProducts' })

OrderProductsModel.belongsTo(productModel, { foreignKey: 'productId' })
productModel.hasMany(OrderProductsModel, { foreignKey: 'productId' })

export default productModel




