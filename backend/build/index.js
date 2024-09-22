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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var dotenv_1 = __importDefault(require("dotenv"));
var db_1 = require("./db");
var assets_1 = __importDefault(require("./models/assets"));
var auth_1 = __importDefault(require("./models/auth"));
var nodemailer_1 = __importDefault(require("nodemailer"));
var crypto_1 = __importDefault(require("crypto"));
// import { Location } from '../models/location';
var multer_1 = __importDefault(require("multer"));
var uuid_1 = require("uuid");
var path_1 = __importDefault(require("path"));
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
dotenv_1.default.config();
var HOST = process.env.HOST || 'http://localhost';
var PORT = parseInt(process.env.PORT || '4500');
var app = (0, express_1.default)();
var transporter = nodemailer_1.default.createTransport({
    host: 'smtp.example.com',
    port: 587,
    auth: {
        user: 'your-email@example.com',
        pass: 'your-password'
    }
});
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.json());
var storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        var uploadPath = path_1.default.join(__dirname, '..', '..', 'uploads');
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        var uniqueFilename = "".concat((0, uuid_1.v4)()).concat(path_1.default.extname(file.originalname));
        cb(null, uniqueFilename);
    },
});
var upload = (0, multer_1.default)({ storage: storage });
var verifyToken = function (req, res, next) {
    var _a;
    var token = (_a = req.header('Authorization')) === null || _a === void 0 ? void 0 : _a.replace('Bearer ', '');
    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }
    try {
        var decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    }
    catch (error) {
        res.status(401).json({ message: 'Invalid token' });
    }
};
app.get('/', function (req, res) {
    try {
        return res.status(200).send();
    }
    catch (error) {
        return res.status(422).send();
    }
});
/*
* Auth
*/
app.post("/auth/login", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var email, code, expires, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                email = req.body.email;
                code = crypto_1.default.randomBytes(3).toString('hex');
                expires = new Date(Date.now() + 10 * 60 * 1000);
                return [4 /*yield*/, auth_1.default.findOneAndUpdate({ email: email }, { code: code, expires: expires }, { upsert: true, new: true })];
            case 1:
                _a.sent();
                res.status(200).json({
                    code: code,
                });
                return [3 /*break*/, 3];
            case 2:
                error_1 = _a.sent();
                console.log(error_1);
                res.status(500).send();
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
app.post('/auth/verify', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, email, code, auth, token, error_2;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 3, , 4]);
                _a = req.body, email = _a.email, code = _a.code;
                return [4 /*yield*/, auth_1.default.findOne({ email: email })];
            case 1:
                auth = _b.sent();
                if (!auth || auth.code !== code || auth.expires < new Date()) {
                    return [2 /*return*/, res.status(400).json({ message: 'Invalid or expired code' })];
                }
                token = jsonwebtoken_1.default.sign({ email: email }, JWT_SECRET, { expiresIn: '365d' });
                return [4 /*yield*/, auth_1.default.deleteOne({ email: email })];
            case 2:
                _b.sent();
                res.status(200).json({ message: 'Sign in successful', token: token });
                return [3 /*break*/, 4];
            case 3:
                error_2 = _b.sent();
                console.error('Error verifying code:', error_2);
                res.status(500).json({ message: 'Error verifying code' });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
/*
 * Assets
 *
*/
app.get('/assets', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var assets, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, assets_1.default.find({ owner: "DEBUG" }).populate('locations')];
            case 1:
                assets = _a.sent();
                return [2 /*return*/, res.status(200).json({ assets: assets })];
            case 2:
                error_3 = _a.sent();
                console.error(error_3);
                return [2 /*return*/, res.status(422).json({ message: 'Error fetching assets' })];
            case 3: return [2 /*return*/];
        }
    });
}); });
app.get('/assets/:id', function (req, res) {
    try {
        return res.status(200).send();
    }
    catch (error) {
        return res.status(422).send();
    }
});
app.post('/asset/add', upload.fields([
    { name: 'images', maxCount: 10 },
    { name: 'receipt', maxCount: 10 }
]), function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, title, owner, _b, currency, files, imageLinks, newAsset, error_4;
    var _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                _d.trys.push([0, 2, , 3]);
                _a = req.body, title = _a.title, owner = _a.owner, _b = _a.currency, currency = _b === void 0 ? "USD" : _b;
                files = req.files;
                if (!title) {
                    return [2 /*return*/, res.status(422).json({ message: 'The fields title and locations are required' })];
                }
                imageLinks = ((_c = files['images']) === null || _c === void 0 ? void 0 : _c.map(function (file) { return "".concat(file.filename); })) || [];
                newAsset = new assets_1.default({
                    title: title,
                    owner: owner,
                    currency: currency,
                    locations: null,
                    images: imageLinks,
                });
                return [4 /*yield*/, newAsset.save()];
            case 1:
                _d.sent();
                return [2 /*return*/, res.status(201).json({ message: 'Asset created successfully', asset: newAsset })];
            case 2:
                error_4 = _d.sent();
                console.error(error_4);
                return [2 /*return*/, res.status(422).json({ message: 'Error creating asset' })];
            case 3: return [2 /*return*/];
        }
    });
}); });
app.delete('/asset/delete/:id', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, deletedAsset, error_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                console.log(req.params);
                id = req.params.id;
                return [4 /*yield*/, assets_1.default.findByIdAndDelete(id)];
            case 1:
                deletedAsset = _a.sent();
                if (!deletedAsset) {
                    return [2 /*return*/, res.status(404).json({ message: 'Asset not found' })];
                }
                return [2 /*return*/, res.status(200).json({ message: 'Asset deleted successfully', asset: deletedAsset })];
            case 2:
                error_5 = _a.sent();
                console.log(error_5);
                return [2 /*return*/, res.status(500).json({ message: 'Error deleting asset' })];
            case 3: return [2 /*return*/];
        }
    });
}); });
app.put('/asset/update/:id', function (req, res) {
    try {
        return res.json({});
    }
    catch (error) {
        return res.json({});
    }
});
app.listen(PORT, function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, db_1.connectToDatabase)()];
            case 1:
                _a.sent();
                console.log("Application started on URL ".concat(HOST, ":").concat(PORT, " \uD83C\uDF89"));
                return [2 /*return*/];
        }
    });
}); });
