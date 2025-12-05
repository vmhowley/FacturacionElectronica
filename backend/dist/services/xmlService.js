"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildECFXML = void 0;
const xmlbuilder2_1 = require("xmlbuilder2");
const buildECFXML = (data) => {
    const root = (0, xmlbuilder2_1.create)({ version: '1.0', encoding: 'UTF-8' })
        .ele('eCF', { xmlns: 'http://www.dgii.gov.do/ecf/schema', version: '1.0' })
        .ele('Header')
        .ele('Emisor').ele('RNC').txt(data.emisor.rnc).up().ele('Nombre').txt(data.emisor.nombre).up().up()
        .ele('Receptor').ele('RNC').txt(data.receptor.rnc).up().ele('Nombre').txt(data.receptor.nombre).up().up()
        .ele('FechaEmision').txt(data.fecha).up()
        .ele('TipoComprobante').txt(data.tipo).up()
        .ele('eNCF').txt(data.encf).up()
        .up()
        .ele('Items');
    data.items.forEach(it => {
        root.ele('Item')
            .ele('Descripcion').txt(it.descripcion).up()
            .ele('Cantidad').txt(it.cantidad).up()
            .ele('PrecioUnitario').txt(it.precio).up()
            .ele('Monto').txt(it.monto).up()
            .ele('Impuesto').txt(it.impuesto).up()
            .up();
    });
    root.up()
        .ele('Totales')
        .ele('SubTotal').txt(data.subtotal).up()
        .ele('ImpuestoTotal').txt(data.impuestototal).up()
        .ele('Total').txt(data.total).up()
        .up();
    return root.end({ prettyPrint: true });
};
exports.buildECFXML = buildECFXML;
