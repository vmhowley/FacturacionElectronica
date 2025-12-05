import { create } from 'xmlbuilder2';

interface InvoiceData {
  emisor: { rnc: string; nombre: string };
  receptor: { rnc: string; nombre: string };
  fecha: string;
  tipo: string;
  encf: string;
  items: Array<{
    descripcion: string;
    cantidad: string;
    precio: string;
    monto: string;
    impuesto: string;
  }>;
  subtotal: string;
  impuestototal: string;
  total: string;
}

export const buildECFXML = (data: InvoiceData): string => {
  const root = create({ version: '1.0', encoding: 'UTF-8' })
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
      .ele('Cantidad').txt(String(it.cantidad)).up()
      .ele('PrecioUnitario').txt(String(it.precio)).up()
      .ele('Monto').txt(String(it.monto)).up()
      .ele('Impuesto').txt(String(it.impuesto)).up()
    .up();
  });
  
  root.up()
    .ele('Totales')
      .ele('SubTotal').txt(String(data.subtotal)).up()
      .ele('ImpuestoTotal').txt(String(data.impuestototal)).up()
      .ele('Total').txt(String(data.total)).up()
    .up();

  // Convert to string properly
  const xml = root.end({ prettyPrint: true });
  return xml;
};
