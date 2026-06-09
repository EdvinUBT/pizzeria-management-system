const reportsService = require('../services/reportsService');
const exportHelper = require('../utils/exportHelper');

const getFullReport = async (req, res) => {
    try {
        const { data_nga, data_deri } = req.query;
        const report = await reportsService.getFullReport(data_nga, data_deri);
        res.json({ sukses: true, te_dhena: report });
    } catch (error) {
        console.error('Gabim:', error);
        res.status(500).json({ sukses: false, mesazhi: error.message || 'Gabim ne server' });
    }
};

const exportReport = async (req, res) => {
    try {
        const { data_nga, data_deri, format } = req.query;
        const report = await reportsService.getFullReport(data_nga, data_deri);

        if (format === 'json') {
            res.setHeader('Content-Type', 'application/json');
            res.setHeader('Content-Disposition', 'attachment; filename=raporti.json');
            return res.send(exportHelper.toJSON(report));
        }

        if (format === 'csv') {
            const columns = [
                { header: 'Kategoria', key: 'emri_kategorise' },
                { header: 'Numri Porosive', key: 'numri_porosive' },
                { header: 'Sasia Totale', key: 'sasia_totale' },
                { header: 'Shitjet Totale', key: 'shitjet_totale' }
            ];
            const csv = exportHelper.toCSV(report.kategorite, columns);
            res.setHeader('Content-Type', 'text/csv');
            res.setHeader('Content-Disposition', 'attachment; filename=raporti.csv');
            return res.send(csv);
        }

        if (format === 'excel') {
            const ExcelJS = require('exceljs');
            const workbook = new ExcelJS.Workbook();

            // Sheet 1 - Sipas Kategorise
            const ws1 = workbook.addWorksheet('Sipas Kategorise');
            ws1.columns = [
                { header: 'Kategoria', key: 'emri_kategorise', width: 20 },
                { header: 'Numri Porosive', key: 'numri_porosive', width: 15 },
                { header: 'Sasia Totale', key: 'sasia_totale', width: 15 },
                { header: 'Shitjet Totale', key: 'shitjet_totale', width: 15 }
            ];
            ws1.getRow(1).font = { bold: true };
            report.kategorite.forEach(r => ws1.addRow(r));

            // Sheet 2 - Top Produktet
            const ws2 = workbook.addWorksheet('Top Produktet');
            ws2.columns = [
                { header: 'Produkti', key: 'emri_produktit', width: 25 },
                { header: 'Sasia', key: 'sasia_totale', width: 12 },
                { header: 'Shitjet', key: 'shitjet_totale', width: 15 },
                { header: 'Numri Porosive', key: 'numri_porosive', width: 15 }
            ];
            ws2.getRow(1).font = { bold: true };
            report.produktet.forEach(r => ws2.addRow(r));

            // Sheet 3 - Shitjet Ditore
            const ws3 = workbook.addWorksheet('Shitjet Ditore');
            ws3.columns = [
                { header: 'Data', key: 'data', width: 15 },
                { header: 'Numri Porosive', key: 'numri_porosive', width: 15 },
                { header: 'Shitjet', key: 'shitjet_totale', width: 15 }
            ];
            ws3.getRow(1).font = { bold: true };
            report.ditore.forEach(r => ws3.addRow(r));

            // Sheet 4 - Statuset
            const ws4 = workbook.addWorksheet('Statuset');
            ws4.columns = [
                { header: 'Statusi', key: 'statusi', width: 15 },
                { header: 'Numri', key: 'numri', width: 12 },
                { header: 'Totali', key: 'totali', width: 15 }
            ];
            ws4.getRow(1).font = { bold: true };
            report.statuset.forEach(r => ws4.addRow(r));

            const buffer = await workbook.xlsx.writeBuffer();
            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.setHeader('Content-Disposition', 'attachment; filename=raporti.xlsx');
            return res.send(Buffer.from(buffer));
        }

        return res.status(400).json({ sukses: false, mesazhi: 'Formati duhet te jete: json, csv ose excel' });
    } catch (error) {
        console.error('Gabim:', error);
        res.status(500).json({ sukses: false, mesazhi: error.message || 'Gabim ne server' });
    }
};

module.exports = { getFullReport, exportReport };