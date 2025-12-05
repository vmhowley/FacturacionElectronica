"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signXml = exports.loadP12 = void 0;
const xmldom_1 = require("@xmldom/xmldom");
const fs_1 = __importDefault(require("fs"));
const node_forge_1 = __importDefault(require("node-forge"));
const xml_crypto_1 = require("xml-crypto");
const loadP12 = (p12Path, password) => {
    const p12Der = fs_1.default.readFileSync(p12Path, 'binary');
    const p12Asn1 = node_forge_1.default.asn1.fromDer(p12Der);
    const p12 = node_forge_1.default.pkcs12.pkcs12FromAsn1(p12Asn1, password);
    let privateKey = null;
    let certificate = null;
    for (const safeContent of p12.safeContents) {
        for (const safeBag of safeContent.safeBags) {
            if (safeBag.type === node_forge_1.default.pki.oids.pkcs8ShroudedKeyBag) {
                privateKey = safeBag.key;
            }
            else if (safeBag.type === node_forge_1.default.pki.oids.certBag) {
                certificate = safeBag.cert;
            }
        }
    }
    if (!privateKey || !certificate) {
        throw new Error('Could not find private key or certificate in .p12 file');
    }
    return {
        privateKeyPem: node_forge_1.default.pki.privateKeyToPem(privateKey),
        certPem: node_forge_1.default.pki.certificateToPem(certificate)
    };
};
exports.loadP12 = loadP12;
const signXml = (xmlString, privateKeyPem, certPem) => {
    // Note: DOMParser from 'xmldom' is needed. 
    // Ensure 'xmldom' is installed: npm i xmldom @types/xmldom
    // The user example used 'xmldom' but I installed 'xml-crypto' which might need it.
    // Actually, 'xml-crypto' usually works with DOM nodes.
    const doc = new xmldom_1.DOMParser().parseFromString(xmlString);
    const sig = new xml_crypto_1.SignedXml({ privateKey: privateKeyPem });
    sig.addReference({
        xpath: "//*[local-name(.)='eCF']",
        transforms: ["http://www.w3.org/2000/09/xmldsig#enveloped-signature"],
        digestAlgorithm: "http://www.w3.org/2001/04/xmlenc#sha256"
    });
    sig.keyInfoProvider = {
        getKeyInfo: () => `<X509Data><X509Certificate>${certPem.replace(/-----.*CERTIFICATE-----/g, '').replace(/\n/g, '')}</X509Certificate></X509Data>`
    };
    sig.computeSignature(xmlString, { location: { reference: "", action: "append" } });
    return sig.getSignedXml();
};
exports.signXml = signXml;
