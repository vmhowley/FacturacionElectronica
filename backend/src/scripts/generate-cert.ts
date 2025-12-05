import fs from 'fs';
import forge from 'node-forge';
import path from 'path';

const generateCert = () => {
  console.log('Generating self-signed certificate...');

  const keys = forge.pki.rsa.generateKeyPair(2048);
  const cert = forge.pki.createCertificate();
  
  cert.publicKey = keys.publicKey;
  cert.serialNumber = '01';
  cert.validity.notBefore = new Date();
  cert.validity.notAfter = new Date();
  cert.validity.notAfter.setFullYear(cert.validity.notBefore.getFullYear() + 1);
  
  const attrs = [{
    name: 'commonName',
    value: 'Test Company'
  }, {
    name: 'countryName',
    value: 'DO'
  }, {
    shortName: 'ST',
    value: 'Santo Domingo'
  }, {
    name: 'localityName',
    value: 'Santo Domingo'
  }, {
    name: 'organizationName',
    value: 'Test Company'
  }, {
    shortName: 'OU',
    value: 'IT'
  }];
  
  cert.setSubject(attrs);
  cert.setIssuer(attrs);
  cert.sign(keys.privateKey);

  const p12Asn1 = forge.pkcs12.toPkcs12Asn1(
    keys.privateKey, 
    [cert], 
    'password', // Password for the p12 file
    { algorithm: '3des' }
  );

  const p12Der = forge.asn1.toDer(p12Asn1).getBytes();
  
  const certPath = path.join(__dirname, '../../certs/test-cert.p12');
  fs.writeFileSync(certPath, p12Der, 'binary');
  
  console.log(`Certificate generated at: ${certPath}`);
  console.log('Password: password');
};

generateCert();
