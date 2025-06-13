import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../connection.js';
class CategoryModel extends Model {}

CategoryModel.init(
    {
    name: {
    type: DataTypes.STRING,
    allowNull: false
    },
    attachments: {
    type: DataTypes.JSON
    },
    width: {
    type: DataTypes.FLOAT
    },
    height: {
    type: DataTypes.FLOAT
    }
    },
    {
    sequelize,
    modelName: 'Category',
    timestamps: true
    }
)
export default CategoryModel

