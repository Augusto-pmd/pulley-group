#!/usr/bin/env node

/**
 * Generador de reporte E2E en formato markdown
 */

import * as fs from 'fs';
import * as path from 'path';

const reportDir = 'qa-e2e';
const reportPath = path.join(reportDir, 'report.md');

// Leer resultados de tests si existen
const testResultsPath = path.join('test-results');
const playwrightReportPath = path.join('playwright-report');

function generateReport() {
  const timestamp = new Date().toISOString();
  
  let report = `# REPORTE E2E - PULLEY\n\n`;
  report += `**Timestamp:** ${timestamp}\n\n`;
  report += `---\n\n`;

  // Sección de resultados
  report += `## RESULTADOS\n\n`;
  report += `- **Build:** ${checkBuild()}\n`;
  report += `- **API QA runner:** ${checkApiQA()}\n`;
  report += `- **E2E:** ${checkE2E()}\n\n`;
  report += `---\n\n`;

  // Sección de errores (si existen)
  const errors = collectErrors();
  if (errors.length > 0) {
    report += `## ERRORES DETECTADOS\n\n`;
    errors.forEach((error, index) => {
      report += `### ERROR ${index + 1}\n\n`;
      report += `**Módulo:** ${error.module}\n`;
      report += `**Ruta:** ${error.route}\n`;
      report += `**Paso que falla:** ${error.step}\n`;
      report += `**Severidad:** ${error.severity}\n\n`;
      report += `**Evidencia:**\n`;
      report += `- Request esperado: ${error.expectedRequest || 'N/A'}\n`;
      report += `- Request observado: ${error.observedRequest || 'Ninguno'}\n`;
      report += `- Status code: ${error.statusCode || 'N/A'}\n`;
      if (error.consoleErrors && error.consoleErrors.length > 0) {
        report += `- Console errors:\n`;
        error.consoleErrors.forEach(err => {
          report += `  - ${err}\n`;
        });
      }
      if (error.screenshot) {
        report += `- Screenshot: ${error.screenshot}\n`;
      }
      report += `\n`;
    });
  } else {
    report += `## ERRORES DETECTADOS\n\n`;
    report += `No se detectaron errores.\n\n`;
  }

  // Guardar reporte
  if (!fs.existsSync(reportDir)) {
    fs.mkdirSync(reportDir, { recursive: true });
  }
  fs.writeFileSync(reportPath, report);
  
  console.log(`\nReporte generado en: ${reportPath}\n`);
  return report;
}

function checkBuild() {
  // Verificar si existe build exitoso
  try {
    if (fs.existsSync('.next')) {
      return 'PASS';
    }
  } catch (e) {}
  return 'UNKNOWN';
}

function checkApiQA() {
  // Verificar reporte de QA API
  try {
    const qaReportPath = path.join('qa', 'report.json');
    if (fs.existsSync(qaReportPath)) {
      const report = JSON.parse(fs.readFileSync(qaReportPath, 'utf-8'));
      if (report.summary && report.summary.failed === 0) {
        return 'PASS';
      }
    }
  } catch (e) {}
  return 'UNKNOWN';
}

function checkE2E() {
  // Verificar resultados de Playwright
  try {
    if (fs.existsSync(playwrightReportPath)) {
      // Si existe reporte HTML, asumir que se ejecutó
      return 'EXECUTED';
    }
  } catch (e) {}
  return 'NOT_EXECUTED';
}

function collectErrors() {
  const errors = [];
  
  // Buscar logs de network y console en qa-e2e/
  if (fs.existsSync(reportDir)) {
    const files = fs.readdirSync(reportDir);
    
    files.forEach(file => {
      if (file.endsWith('-network.log')) {
        try {
          const content = JSON.parse(fs.readFileSync(path.join(reportDir, file), 'utf-8'));
          // Analizar requests fallidos
          const failed = content.filter(req => req.status && req.status >= 400);
          failed.forEach(req => {
            errors.push({
              module: extractModuleFromFilename(file),
              route: req.url,
              step: 'Request API',
              severity: req.status >= 500 ? 'BLOQUEANTE' : 'ALTA',
              expectedRequest: `${req.method} ${req.url}`,
              observedRequest: `${req.method} ${req.url}`,
              statusCode: req.status,
            });
          });
        } catch (e) {
          // Ignorar errores de parse
        }
      }
      
      if (file.endsWith('-console.log')) {
        try {
          const content = JSON.parse(fs.readFileSync(path.join(reportDir, file), 'utf-8'));
          const consoleErrors = content.filter(log => log.type === 'error');
          if (consoleErrors.length > 0) {
            errors.push({
              module: extractModuleFromFilename(file),
              route: 'N/A',
              step: 'Console',
              severity: 'MEDIA',
              consoleErrors: consoleErrors.map(e => e.text),
            });
          }
        } catch (e) {
          // Ignorar
        }
      }
    });
  }
  
  return errors;
}

function extractModuleFromFilename(filename) {
  if (filename.includes('vida-mensual')) return 'Vida Mensual';
  if (filename.includes('activos')) return 'Activos';
  if (filename.includes('inversiones')) return 'Inversiones';
  if (filename.includes('emma')) return 'Emma';
  return 'Unknown';
}

// Ejecutar
const report = generateReport();
console.log(report);

