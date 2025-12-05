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
exports.checkStatusDGII = exports.sendToDGII = void 0;
const axios_1 = __importDefault(require("axios"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const DGII_URLS = {
    test: 'https://ecf.dgii.gov.do/testecf/recepcionfc', // Example URL, needs verification
    prod: 'https://ecf.dgii.gov.do/recepcionfc'
};
const getBaseUrl = () => {
    return process.env.DGII_ENV === 'prod' ? DGII_URLS.prod : DGII_URLS.test;
};
const sendToDGII = (signedXml) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const url = `${getBaseUrl()}/api/ecf`; // Adjust endpoint path based on DGII docs
    try {
        const response = yield axios_1.default.post(url, signedXml, {
            headers: {
                'Content-Type': 'application/xml',
                // Add auth headers if required (e.g. Bearer token or Certificate auth)
            },
            timeout: 30000
        });
        return response.data;
    }
    catch (error) {
        console.error('Error sending to DGII:', ((_a = error.response) === null || _a === void 0 ? void 0 : _a.data) || error.message);
        throw new Error('Failed to send to DGII');
    }
});
exports.sendToDGII = sendToDGII;
const checkStatusDGII = (trackId) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const url = `${getBaseUrl()}/api/status/${trackId}`;
    try {
        const response = yield axios_1.default.get(url);
        return response.data;
    }
    catch (error) {
        console.error('Error checking status:', ((_a = error.response) === null || _a === void 0 ? void 0 : _a.data) || error.message);
        throw new Error('Failed to check status');
    }
});
exports.checkStatusDGII = checkStatusDGII;
