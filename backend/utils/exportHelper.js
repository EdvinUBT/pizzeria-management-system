const ExcelJS = require('exceljs');

const exportHelper = {
    toJSON: (data) => {
        return JSON.stringify(data, null, 2);
    },

    toCSV: (data, columns) => {
        if (!data || data.length === 0) return '';

        const header = columns.map(c => c.header).join(',');
        const rows = data.map(row => {
            return columns.map(c => {
                let value = row[c.key] !== undefined && row[c.key] !== null ? String(row[c.key]) : '';
                if (value.includes(',') || value.includes('"') || value.includes('\n')) {
                    value = `"${value.replace(/"/g, '""')}"`;
                }
                return value;
            }).join(',');
        });

        return [header, ...rows].join('\n');
    },

    toExcel: async (data, columns, sheetName = 'Sheet1') => {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet(sheetName);

        worksheet.columns = columns.map(c => ({
            header: c.header,
            key: c.key,
            width: c.width || 15
        }));

        // Stilizo header-in
        worksheet.getRow(1).font = { bold: true };
        worksheet.getRow(1).fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFD32F2F' }
        };
        worksheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };

        data.forEach(row => {
            worksheet.addRow(row);
        });

        return await workbook.xlsx.writeBuffer();
    },

    parseCSV: (csvString) => {
        const lines = csvString.trim().split('\n');
        if (lines.length < 2) return [];

        const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
        const data = [];

        for (let i = 1; i < lines.length; i++) {
            const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''));
            const row = {};
            headers.forEach((h, index) => {
                row[h] = values[index] || '';
            });
            data.push(row);
        }

        return data;
    },

    parseExcel: async (buffer) => {
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.load(buffer);
        const worksheet = workbook.getWorksheet(1);
        const data = [];
        const headers = [];

        worksheet.getRow(1).eachCell((cell) => {
            headers.push(cell.value);
        });

        worksheet.eachRow((row, rowNumber) => {
            if (rowNumber === 1) return;
            const rowData = {};
            row.eachCell((cell, colNumber) => {
                rowData[headers[colNumber - 1]] = cell.value;
            });
            data.push(rowData);
        });

        return data;
    }
};

module.exports = exportHelper;