import { useState } from 'react';
import API from '../services/api';
import { FaFileExport, FaFileImport, FaFileCsv, FaFileExcel } from 'react-icons/fa';
import { VscJson } from 'react-icons/vsc';

const ExportImport = ({ entity, entityLabel, onImportSuccess }) => {
    const [showImport, setShowImport] = useState(false);
    const [importFile, setImportFile] = useState(null);
    const [importFormat, setImportFormat] = useState('json');
    const [importing, setImporting] = useState(false);
    const [message, setMessage] = useState('');

    const handleExport = async (format) => {
        try {
            const response = await API.get(`/export/${entity}?format=${format}`, {
                responseType: 'blob'
            });

            const extensions = { json: 'json', csv: 'csv', excel: 'xlsx' };
            const mimeTypes = {
                json: 'application/json',
                csv: 'text/csv',
                excel: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            };

            const blob = new Blob([response.data], { type: mimeTypes[format] });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `${entity}.${extensions[format]}`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Gabim ne eksportim:', error);
            setMessage('Gabim gjate eksportimit!');
        }
    };

    const handleImport = async () => {
        if (!importFile) {
            setMessage('Zgjidhni nje fajll!');
            return;
        }

        setImporting(true);
        setMessage('');

        try {
            let response;

            if (importFormat === 'json') {
                const text = await importFile.text();
                const data = JSON.parse(text);
                response = await API.post(`/import/${entity}?format=json`, data);
            } else if (importFormat === 'csv') {
                const text = await importFile.text();
                response = await API.post(`/import/${entity}?format=csv`, text, {
                    headers: { 'Content-Type': 'text/plain' }
                });
            } else if (importFormat === 'excel') {
                const buffer = await importFile.arrayBuffer();
                response = await API.post(`/import/${entity}?format=excel`, buffer, {
                    headers: { 'Content-Type': 'application/octet-stream' }
                });
            }

            setMessage(`${response.data.mesazhi}${response.data.gabimet ? ` (${response.data.gabimet.length} gabime)` : ''}`);
            setImportFile(null);
            setShowImport(false);
            if (onImportSuccess) onImportSuccess();
        } catch (error) {
            setMessage(error.response?.data?.mesazhi || 'Gabim gjate importimit!');
        } finally {
            setImporting(false);
        }
    };

    return (
        <div className="card shadow-sm mb-3">
            <div className="card-body py-2">
                <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
                    <div className="d-flex align-items-center gap-2">
                        <FaFileExport className="text-danger" />
                        <span className="fw-bold small">Eksporto {entityLabel}:</span>
                        <button className="btn btn-sm btn-outline-success" onClick={() => handleExport('excel')}>
                            <FaFileExcel className="me-1" />Excel
                        </button>
                        <button className="btn btn-sm btn-outline-primary" onClick={() => handleExport('csv')}>
                            <FaFileCsv className="me-1" />CSV
                        </button>
                        <button className="btn btn-sm btn-outline-warning" onClick={() => handleExport('json')}>
                            <VscJson className="me-1" />JSON
                        </button>
                    </div>
                    <button className={`btn btn-sm ${showImport ? 'btn-secondary' : 'btn-outline-dark'}`} onClick={() => setShowImport(!showImport)}>
                        <FaFileImport className="me-1" />{showImport ? 'Mbyll' : 'Importo'}
                    </button>
                </div>

                {showImport && (
                    <div className="row mt-3 pt-2 border-top align-items-end">
                        <div className="col-md-3">
                            <label className="form-label small">Formati</label>
                            <select className="form-select form-select-sm" value={importFormat} onChange={(e) => setImportFormat(e.target.value)}>
                                <option value="json">JSON</option>
                                <option value="csv">CSV</option>
                                <option value="excel">Excel</option>
                            </select>
                        </div>
                        <div className="col-md-5">
                            <label className="form-label small">Fajlli</label>
                            <input type="file" className="form-control form-control-sm"
                                accept={importFormat === 'json' ? '.json' : importFormat === 'csv' ? '.csv' : '.xlsx'}
                                onChange={(e) => setImportFile(e.target.files[0])} />
                        </div>
                        <div className="col-md-2">
                            <button className="btn btn-sm btn-danger" onClick={handleImport} disabled={importing}>
                                {importing ? 'Duke importuar...' : 'Importo'}
                            </button>
                        </div>
                    </div>
                )}

                {message && (
                    <div className={`alert ${message.includes('Gabim') ? 'alert-danger' : 'alert-success'} mt-2 mb-0 py-1`}>
                        <small>{message}</small>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ExportImport;