const mysql = require("mysql2");
const { error, logs } = require("../utils/Logger");

class Schema {
    constructor(schemaDict) {
        this.schemaDict = schemaDict;
    }
}

let connexion = null;

async function connect(config) {
    connexion = mysql.createPool(config);
}

async function logout(){
    connexion.end(err => {
        if(err){
            error(`Error closing database connection: ${err}`);
            return;
        }

        logs("Database connection closed");
    });
}

function generateCondition(filter, isUpdate = false) {
    const keys = Object.keys(filter);
    const values = Object.values(filter);

    const conditions = keys.map((key, index) => {
        const value = values[index];
        return `${key} = ${typeof value === "string" ? `"${value}"` : value}`;
    }).join(` ${isUpdate == false? "AND" : ","} `);

    return conditions;
}

function generateValueSQL(value){
    return value.map(item => {
        return typeof item == "string" ? `"${item}"` : item;
    }).join(", ");
}

function replaceValues(dict, replacementDict) {
    const resultDict = {};

    for (const key in dict) {
        if (key in replacementDict) resultDict[key] = replacementDict[key];
        else resultDict[key] = dict[key];
    }

    return resultDict;
}

const reservedKeywords = ['ADD', 'ALL', 'ALTER', 'AND', 'AS', 'ASC', 'BETWEEN', 'BY', 'CASE', 'CHECK', 'COLUMN', 'CONSTRAINT', 'CREATE', 'CURRENT_DATE', 'CURRENT_TIME', 'CURRENT_TIMESTAMP', 'DEFAULT', 'DELETE', 'DESC', 'DISTINCT', 'DROP', 'ELSE', 'END', 'ESCAPE', 'EXCEPT', 'EXISTS', 'FOR', 'FOREIGN', 'FROM', 'FULL', 'GROUP', 'HAVING', 'IN', 'INNER', 'INSERT', 'INTERSECT', 'INTO', 'IS', 'JOIN', 'LEFT', 'LIKE', 'LIMIT', 'NOT', 'NULL', 'ON', 'OR', 'ORDER', 'OUTER', 'PRIMARY', 'REFERENCES', 'RIGHT', 'SELECT', 'SET', 'SOME', 'TABLE', 'THEN', 'UNION', 'UNIQUE', 'UPDATE', 'VALUES', 'WHEN', 'WHERE'];

function ifReservedKeywords(tableName) {
  if (reservedKeywords.includes(tableName.toUpperCase())) {
    return true;
  }
  return false;
}

class Model{
    constructor(name, schema){
        this.name = name;
        this.schema = schema;

        connexion.query(this.generateCreateTableStatement(schema.schemaDict), (err) => {
            if(err){
                error(`Error creating table: ${err} with table name: ${this.name}`);
                return;
            }
            logs(`La base de donnée ${this.name} a été créé`);
        });
    }

    generateCreateTableStatement(schema) {
        const sqlTypeMap = {
            String: 'VARCHAR',
            Number: 'INT',
            Boolean: 'BOOLEAN',
            Date: 'DATETIME',
            Object: 'JSON',
            Array: 'VARCHAR',
            Now: 'NOW()'
        };

        const columns = Object.keys(schema).map(fieldName => {
            const field = schema[fieldName];
            let lengthDefault = 255;
            if (!field.type && typeof field == "object") throw new Error(`Field ${fieldName} has no type defined.`);
            const fieldType = typeof field == "object" ? field.type.name : field.name;

            if(field.type && typeof field == "object"){
                if (!sqlTypeMap[fieldType]) throw new Error(`Field ${fieldName} has unsupported type ${fieldType}.`);

                let columnDefinition = `${fieldName} ${sqlTypeMap[fieldType]}${sqlTypeMap[fieldType] == "VARCHAR" || sqlTypeMap[fieldType] == "INT" ? `(${field.length > 0 ? field.length : lengthDefault})` : ""}`;

                if (field.required) columnDefinition += ' NOT NULL';
                if (field.default !== undefined) columnDefinition += ` DEFAULT "${field.default}"`;
                if (field.unique) columnDefinition += ' UNIQUE';
                return columnDefinition;
            }

            if(!sqlTypeMap[fieldType]) throw new Error(`Field ${fieldName} has unsupported type ${field}`);

            return `${fieldName} ${sqlTypeMap[fieldType] == "VARCHAR" ? `${sqlTypeMap[fieldType]}(${lengthDefault})` : sqlTypeMap[fieldType]}`;
        });
        if(ifReservedKeywords(this.name)){
            error("Error: Invalid table name. Please choose a different name that is not a reserved keyword in SQL");
            return;
        }
        return `CREATE TABLE IF NOT EXISTS ${this.name} (${columns.join(', ')}) ENGINE=InnoDB`;
    }

    async save(data) {
        const keys = Object.keys(data);
        const sql = `INSERT INTO ${this.name} (${keys.join(', ')}) VALUES (${generateValueSQL(Object.values(data))})`;
        try {
            await connexion.promise().query(sql).catch((err) => {
                error(`Error insert element : ${err}`);
                throw err;
            });
            return data;
        } catch (err) {
            error(`Error inserting data into ${this.name}: ${err}`);
            throw err;
        }
    }

    async findOne(filter) {
        const sql = `SELECT * FROM ${this.name} WHERE ${generateCondition(filter)}`;

        return new Promise((resolve, reject) => {
            connexion.promise().query(sql).then((rows) => {
                if(rows.length == 0) return resolve(0);
                
                resolve(new ModelInstance(this.name, Object.values(rows[0])[0]));
            }).catch((err) => {
                error(`Error executing query: ${err}`);
                return;
                // throw err;
            });
        });
    }
}

class ModelInstance{
    constructor(name, data){
        this.name = name;
        this.data = data;
    }

    async updateOne(model) {
        const sql = `UPDATE ${this.name} SET ${generateCondition(model, true)} WHERE ${generateCondition(this.data)}`;
        await connexion.promise().query(sql).catch((err) => {
            error(`Error executing query: ${err}`);
            throw err;
        });

        return replaceValues(this.data, model);
    }

    async deleteOne(model) {
        const sql = `DELETE FROM ${this.name} WHERE ${generateCondition(model)}`;
        try {
            await connexion.promise().query(sql).catch((err) => {
                return error(`Error executing query: ${err}`);
            });
        } catch (err) {
            return error(`Error deleting data from ${this.name}: ${err}`);
        }

        return replaceValues(this.data, model);
    }

    async customRequest(custom){
        try {
            await connexion.promise().query(custom).catch((err) => {
                return error(`Error executing query: ${err}`);
            })
        } catch (err) {
            return error(`Error executing query: ${err}`);
        }
    }
}

module.exports = {Schema, connect, Model};