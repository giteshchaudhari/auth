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
exports.userLogin = exports.createUser = exports.getAllUsers = void 0;
const database_1 = require("./database");
function getAllUsers() {
    return __awaiter(this, void 0, void 0, function* () {
        const sql = 'SELECT * From PERSONS;';
        const results = yield (0, database_1.execute)(sql);
        return results.rows;
    });
}
exports.getAllUsers = getAllUsers;
function createUser(body) {
    return __awaiter(this, void 0, void 0, function* () {
        const { username, password, email, lastname, firstname } = body;
        const sql = `INSERT INTO Persons
     (username, password, email, firstname, lastname)
     values ($1,$2, $3, $4, $5);`;
        const results = yield (0, database_1.execute)(sql, [username, password, email, firstname, lastname]);
        return results.rows;
    });
}
exports.createUser = createUser;
function userLogin(body) {
    return __awaiter(this, void 0, void 0, function* () {
        const { username, password } = body;
        const sql = 'SELECT password from Persons where username=$1';
        const results = yield (0, database_1.execute)(sql, [username]);
        console.log('fvdscx', JSON.stringify(results.rows));
        const allowed = password === results.rows[0].password;
        return {
            allowed
        };
    });
}
exports.userLogin = userLogin;
//# sourceMappingURL=operations.js.map