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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
require("./database/database");
const operations_1 = require("./operations");
const app = (0, express_1.default)();
const port = 3000;
app.use((0, cors_1.default)());
app.use(body_parser_1.default.json());
app.post('/', (req, res) => {
    return res.status(200).send('Hello world');
});
app.get('/getAllUsers', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const allUsers = yield (0, operations_1.getAllUsers)();
    return res.send(allUsers);
}));
app.post('/signup', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, operations_1.createUser)(req.body);
        return res.send('user created');
    }
    catch (e) {
        res.status(400).send(e.detail);
    }
}));
app.post('/resetPassword', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, operations_1.resetPassword)(req.body);
        res.send('password is updated');
    }
    catch (e) {
        res.status(401).send(e.message);
    }
}));
app.post('/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield (0, operations_1.userLogin)(req.body);
    if (response.allowed) {
        res.send('login success');
    }
    else {
        res.status(401).send('Unauthorised');
    }
}));
app.listen(port, () => {
    console.log('server is running on port 3000');
});
//# sourceMappingURL=app.js.map