"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDatabase = exports.execute = void 0;
const pg_1 = require("pg");
const config_1 = require("./config");
const pool = new pg_1.Pool(config_1.credentials);
function execute(query, params) {
    return __awaiter(this, void 0, void 0, function* () {
        const connection = yield pool.connect();
        try {
            return connection.query(query, params);
        }
        catch (e) {
            console.log(e);
        }
        finally {
            connection.release();
        }
    });
}
exports.execute = execute;
function createDatabase() {
    return __awaiter(this, void 0, void 0, function* () {
        const sql = 'CREATE TABLE IF NOT EXISTS  Persons( id SERIAL PRIMARY KEY,  username VARCHAR(255) NOT NULL UNIQUE ,email VARCHAR(255) NOT NULL UNIQUE, password VARCHAR(255) NOT NULL, firstname VARCHAR(255) NOT NULL,  lastname VARCHAR(255) NOT NULL);';
        yield execute(sql);
    });
}
exports.createDatabase = createDatabase;
createDatabase().then(() => {
    console.log('Persons table created');
});
//# sourceMappingURL=database.js.map