import { Sequelize, DataTypes } from 'sequelize'

const { DB_HOST, DB_USER, DB_PASS, DB_PORT, DB_NAME, DB_SCHEMA } = process.env
const sequelize = new Sequelize(`postgres://${DB_USER}:${DB_PASS}@${DB_HOST}:${DB_PORT}/${DB_NAME}`)

const tableModel = sequelize.define(
  'exampleTable',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    timestamp: { type: DataTypes.DATE, allowNull: false },
    category: { type: DataTypes.TEXT, allowNull: false },
    type: { type: DataTypes.TEXT, allowNull: false },
    args: { type: DataTypes.JSON, allowNull: false },
    details: { type: DataTypes.TEXT, allowNull: false },
    user: { type: DataTypes.TEXT, allowNull: false },
    msp_id: { type: DataTypes.INTEGER, allowNull: false },
    source_api: { type: DataTypes.TEXT, allowNull: false },
    createAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
  },
  {
    sequelize,
    tableName: 'exampleTable',
    schema: DB_SCHEMA,
    timestamps: false,
  }
)

export default tableModel
