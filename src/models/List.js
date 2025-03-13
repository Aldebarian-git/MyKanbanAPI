import { Model, DataTypes } from 'sequelize';
import { sequelize } from './connection.js';

export class List extends Model {}

List.init(
    {
        title: {
            type: DataTypes.TEXT,
            // https://sequelize.org/docs/v6/core-concepts/validations-and-constraints/
            validate: {
                len: [3, 100]
            }
        },
        position: {
            type: DataTypes.INTEGER,
            defaultValue: 1,
        },
    },
    {
        sequelize,
        tableName: 'list',
    }
);
