"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userLogin = exports.createUser = exports.getAllUsers = void 0;
const database_1 = require("./database");
const crypto = __importStar(require("crypto"));
const md5_1 = __importDefault(require("md5"));
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
        const { salt, hashedPass } = getHashedPassword(password);
        const sql = `INSERT INTO Persons
     (username, salt, passhash , email, firstname, lastname)
     values ($1,$2, $3, $4, $5, $6);`;
        const results = yield (0, database_1.execute)(sql, [username, salt, hashedPass, email, firstname, lastname]);
        return results.rows;
    });
}
exports.createUser = createUser;
function getHashedPassword(password) {
    const salt = crypto.randomBytes(16).toString('base64');
    const saltAddedPassword = salt + password;
    const hashedPass = (0, md5_1.default)(saltAddedPassword);
    return { salt, hashedPass };
}
function userLogin(body) {
    return __awaiter(this, void 0, void 0, function* () {
        const { username, password } = body;
        const sql = 'SELECT salt, passhash from Persons where username=$1';
        const results = yield (0, database_1.execute)(sql, [username]);
        const salt = results.rows[0].salt;
        const hassedPass = results.rows[0].passhash;
        const allowed = hassedPass === (0, md5_1.default)(salt + password);
        return {
            allowed
        };
    });
}
exports.userLogin = userLogin;
//# sourceMappingURL=operations.js.map