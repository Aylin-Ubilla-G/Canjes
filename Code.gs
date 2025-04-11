// Función que maneja solicitudes GET para el dashboard
function doGet(e) {
  try {
    // Para propósitos de prueba - Si se solicita 'test', devolver un mensaje simple
    if (e && e.parameter && e.parameter.action === 'test') {
      return ContentService.createTextOutput(JSON.stringify({
        success: true,
        message: "El script está funcionando correctamente",
        timestamp: new Date().toISOString()
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
    // Verificar la acción solicitada
    if (!e || !e.parameter || !e.parameter.action) {
      return ContentService.createTextOutput(JSON.stringify({
        success: false,
        message: "Parámetros no válidos: se requiere una acción"
      })).setMimeType(ContentService.MimeType.JSON);
    }

    const action = e.parameter.action;
    
    if (action === 'getDashboardData') {
      // Obtener datos para el dashboard
      const data = obtenerDatosDashboard(e.parameter);
      
      return ContentService.createTextOutput(JSON.stringify({
        success: true,
        data: data
      })).setMimeType(ContentService.MimeType.JSON);
    } else {
      return ContentService.createTextOutput(JSON.stringify({
        success: false,
        message: "Acción no válida: " + action
      })).setMimeType(ContentService.MimeType.JSON);
    }
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

// Función que maneja solicitudes POST del formulario
function doPost(e) {
  try {
    Logger.log("Recibida solicitud POST");
    
    let data = {};
    
    // Verificar si es una solicitud JSON o form-encoded
    if (e.postData && e.postData.type === "application/json") {
      // Es una solicitud JSON
      data = JSON.parse(e.postData.contents);
      Logger.log("Datos JSON recibidos: " + JSON.stringify(data));
    } else if (e.parameter) {
      // Es un formulario
      data = e.parameter;
      Logger.log("Parámetros de formulario recibidos: " + JSON.stringify(data));
    } else {
      Logger.log("Error: No se recibieron datos");
      return ContentService.createTextOutput(JSON.stringify({
        success: false,
        message: 'No se recibieron datos'
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
    // Obtener la hoja de cálculo
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getActiveSheet();
    Logger.log("Hoja activa: " + sheet.getName());
    
    // Obtener encabezados o crearlos si es la primera fila
    let headers = [];
    if (sheet.getLastRow() === 0) {
      // Primera ejecución, crear encabezados
      headers = [
        'email', 'pais', 'tipoSolicitud', 'canalVenta', 'partner', 
        'concepto', 'fechaSolicitud', 'estado', 'cantidadPasajeros', 
        'tipoViaje', 'vueloIdaFecha', 'vueloIdaNumero', 
        'vueloVueltaFecha', 'vueloVueltaNumero', 'pasajerosInfo',
        'cantidad', 'moneda', 'monto'
      ];
      sheet.appendRow(headers);
      Logger.log("Se crearon los encabezados: " + headers.join(", "));
    } else {
      // Obtener encabezados existentes
      headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
      Logger.log("Encabezados existentes: " + headers.join(", "));
    }
    
    // Preparar fila para insertar
    const rowData = headers.map(header => {
      // Para el estado, si no existe, poner "Pendiente"
      if (header === 'estado' && !data[header]) {
        return 'Pendiente';
      }
      
      // Para fechaSolicitud, si no se envió, usar la fecha actual
      if (header === 'fechaSolicitud' && !data[header]) {
        return new Date().toISOString();
      }
      
      return data[header] || '';
    });
    
    // Insertar fila
    sheet.appendRow(rowData);
    Logger.log("Fila insertada correctamente. Última fila: " + sheet.getLastRow());
    
    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      message: 'Datos guardados correctamente',
      rowNumber: sheet.getLastRow()
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    Logger.log("Error en doPost: " + error.toString() + "\n" + error.stack);
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

// Función para obtener datos del dashboard
function getDashboardData(dateRange, dateFrom, dateTo) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // Si no hay datos, devolver métricas vacías
    if (sheet.getLastRow() <= 1) {
      return ContentService.createTextOutput(JSON.stringify({
        totalSolicitudes: 0,
        totalTickets: 0,
        totalGiftCards: 0,
        totalBilleteras: 0,
        solicitudesPorPais: {},
        recentRequests: []
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
    const data = sheet.getDataRange().getValues();
    const headers = data[0];
    const rows = data.slice(1);
    
    // Filtrar por fecha
    const filteredRows = filterByDateRange(rows, headers, dateRange, dateFrom, dateTo);
    
    // Calcular métricas
    const metrics = calculateMetrics(filteredRows, headers);
    
    return ContentService.createTextOutput(JSON.stringify(metrics))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    Logger.log("Error en getDashboardData: " + error.toString());
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

// Filtrar filas por rango de fechas
function filterByDateRange(rows, headers, dateRange, dateFrom, dateTo) {
  const fechaIndex = headers.indexOf('fechaSolicitud');
  if (fechaIndex === -1) return rows; // Si no hay columna de fecha, devuelve todas las filas
  
  const now = new Date();
  let startDate;
  let endDate;
  
  if (dateRange === 'custom' && dateFrom && dateTo) {
    startDate = new Date(dateFrom);
    endDate = new Date(dateTo);
  } else {
    const days = parseInt(dateRange) || 30;
    startDate = new Date(now.getTime() - (days * 24 * 60 * 60 * 1000));
  }
  
  return rows.filter(row => {
    const rowDateStr = row[fechaIndex];
    if (!rowDateStr) return false;
    
    const rowDate = new Date(rowDateStr);
    if (isNaN(rowDate.getTime())) return false;
    
    return rowDate >= startDate && (!endDate || rowDate <= endDate);
  });
}

// Calcular métricas para el dashboard
function calculateMetrics(rows, headers) {
  const tipoSolicitudIndex = headers.indexOf('tipoSolicitud');
  const paisIndex = headers.indexOf('pais');
  const emailIndex = headers.indexOf('email');
  const partnerIndex = headers.indexOf('partner');
  const fechaIndex = headers.indexOf('fechaSolicitud');
  const estadoIndex = headers.indexOf('estado');
  
  const metrics = {
    totalSolicitudes: rows.length,
    totalTickets: 0,
    totalGiftCards: 0,
    totalBilleteras: 0,
    solicitudesPorPais: {},
    recentRequests: []
  };
  
  rows.forEach(row => {
    const tipoSolicitud = row[tipoSolicitudIndex] || '';
    const pais = row[paisIndex] || 'Desconocido';
    
    // Contar por tipo
    if (tipoSolicitud === 'tickets') metrics.totalTickets++;
    else if (tipoSolicitud === 'giftcard') metrics.totalGiftCards++;
    else if (tipoSolicitud === 'billetera') metrics.totalBilleteras++;
    
    // Contar por país
    if (!metrics.solicitudesPorPais[pais]) {
      metrics.solicitudesPorPais[pais] = 0;
    }
    metrics.solicitudesPorPais[pais]++;
  });
  
  // Obtener las 10 solicitudes más recientes
  const sortedRows = [...rows].sort((a, b) => {
    const dateA = new Date(a[fechaIndex] || 0);
    const dateB = new Date(b[fechaIndex] || 0);
    return dateB - dateA; // Ordenar de más reciente a más antigua
  });
  
  metrics.recentRequests = sortedRows.slice(0, 10).map(row => ({
    fechaSolicitud: row[fechaIndex] || '',
    email: row[emailIndex] || '',
    pais: row[paisIndex] || '',
    tipoSolicitud: row[tipoSolicitudIndex] || '',
    partner: row[partnerIndex] || '',
    estado: row[estadoIndex] || 'Pendiente'
  }));
  
  return metrics;
}

// Función de prueba para verificar que el script puede escribir en la hoja
function testAppendRow() {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    sheet.appendRow(['Prueba', 'Desde', 'Script', new Date().toString()]);
    Logger.log('Fila agregada para prueba en la hoja: ' + sheet.getName());
    return "Prueba completada con éxito";
  } catch (error) {
    Logger.log('Error en testAppendRow: ' + error.toString());
    return "Error: " + error.toString();
  }
}

function obtenerDatosDashboard(parametros) {
  // Obtener la hoja de cálculo activa
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  
  // Primero intentamos buscar una hoja llamada "Solicitudes"
  let sheet = spreadsheet.getSheetByName("Solicitudes");
  
  // Si no existe, usamos la hoja activa
  if (!sheet) {
    sheet = spreadsheet.getActiveSheet();
    Logger.log("Usando hoja activa: " + sheet.getName());
  } else {
    Logger.log("Usando hoja 'Solicitudes'");
  }
  
  // Obtener todos los datos de la hoja
  const dataRange = sheet.getDataRange();
  const values = dataRange.getValues();
  
  if (values.length <= 1) {
    // Solo hay encabezados o está vacía
    Logger.log("La hoja está vacía o solo tiene encabezados");
    return {
      totalSolicitudes: 0,
      solicitudesPendientes: 0,
      solicitudesAprobadas: 0,
      solicitudesRechazadas: 0,
      solicitudesPorTipo: {},
      solicitudesPorPais: {},
      solicitudesRecientes: []
    };
  }
  
  // Obtener los índices de las columnas (siendo flexibles con los nombres)
  const headers = values[0].map(header => String(header).toLowerCase());
  Logger.log("Encabezados encontrados: " + headers.join(", "));
  
  // Buscar los índices necesarios de forma flexible
  const emailIndex = findColumnIndex(headers, ["email", "correo", "correo electrónico"]);
  const paisIndex = findColumnIndex(headers, ["pais", "país", "country"]);
  const tipoSolicitudIndex = findColumnIndex(headers, ["tiposolicitud", "tipo solicitud", "tipo de solicitud", "tipo"]);
  const fechaSolicitudIndex = findColumnIndex(headers, ["fechasolicitud", "fecha solicitud", "fecha", "fecha de solicitud"]);
  const estadoIndex = findColumnIndex(headers, ["estado", "status"]);
  
  Logger.log("Índices encontrados - Email: " + emailIndex + ", País: " + paisIndex + 
            ", Tipo: " + tipoSolicitudIndex + ", Fecha: " + fechaSolicitudIndex + ", Estado: " + estadoIndex);
  
  // Filtrar según parámetros recibidos
  let solicitudes = [];
  
  // Convertir fechas de filtro si están presentes
  let fechaDesde = parametros.fechaDesde ? new Date(parametros.fechaDesde) : null;
  let fechaHasta = parametros.fechaHasta ? new Date(parametros.fechaHasta) : null;
  
  // Si fechaHasta está presente, ajustar al final del día
  if (fechaHasta) {
    fechaHasta.setHours(23, 59, 59, 999);
  }
  
  // Procesar cada fila (excluyendo encabezados)
  for (let i = 1; i < values.length; i++) {
    const row = values[i];
    
    // Obtener fecha de solicitud
    let fechaSolicitud = null;
    if (fechaSolicitudIndex >= 0) {
      try {
        const fechaValue = row[fechaSolicitudIndex];
        fechaSolicitud = fechaValue ? (fechaValue instanceof Date ? fechaValue : new Date(fechaValue)) : null;
        
        if (isNaN(fechaSolicitud.getTime())) {
          Logger.log("Fecha inválida en fila " + i + ": " + fechaValue);
          fechaSolicitud = null;
        }
      } catch (e) {
        Logger.log("Error al procesar fecha en fila " + i + ": " + e.message);
        fechaSolicitud = null;
      }
    }
    
    // Aplicar filtros si están definidos los índices
    if (parametros.estado && estadoIndex >= 0 && 
        row[estadoIndex] && row[estadoIndex].toString().toLowerCase() !== parametros.estado.toLowerCase()) {
      continue;
    }
    
    if (parametros.pais && paisIndex >= 0 && 
        row[paisIndex] && row[paisIndex].toString().toLowerCase() !== parametros.pais.toLowerCase()) {
      continue;
    }
    
    if (fechaDesde && fechaSolicitud && fechaSolicitud < fechaDesde) {
      continue;
    }
    
    if (fechaHasta && fechaSolicitud && fechaSolicitud > fechaHasta) {
      continue;
    }
    
    // Para evitar errores, verificar cada índice antes de acceder
    const solicitud = {
      id: `SOL-${i}`,
      email: emailIndex >= 0 ? (row[emailIndex] || "") : "",
      pais: paisIndex >= 0 ? (row[paisIndex] || "") : "",
      tipoSolicitud: tipoSolicitudIndex >= 0 ? (row[tipoSolicitudIndex] || "") : "",
      fechaSolicitud: fechaSolicitud ? fechaSolicitud.toISOString() : "",
      estado: estadoIndex >= 0 ? (row[estadoIndex] || "pendiente") : "pendiente"
    };
    
    // Añadir solicitud al array
    solicitudes.push(solicitud);
  }
  
  Logger.log("Total de solicitudes filtradas: " + solicitudes.length);
  
  // Calcular métricas
  let totalSolicitudes = solicitudes.length;
  let solicitudesPendientes = 0;
  let solicitudesAprobadas = 0;
  let solicitudesRechazadas = 0;
  let solicitudesPorTipo = {};
  let solicitudesPorPais = {};
  
  solicitudes.forEach(solicitud => {
    // Contar por estado
    const estado = solicitud.estado.toLowerCase();
    if (estado === "pendiente") solicitudesPendientes++;
    else if (estado === "aprobado") solicitudesAprobadas++;
    else if (estado === "rechazado") solicitudesRechazadas++;
    
    // Contar por tipo
    const tipo = solicitud.tipoSolicitud;
    if (tipo) {
      solicitudesPorTipo[tipo] = (solicitudesPorTipo[tipo] || 0) + 1;
    }
    
    // Contar por país
    const pais = solicitud.pais;
    if (pais) {
      solicitudesPorPais[pais] = (solicitudesPorPais[pais] || 0) + 1;
    }
  });
  
  // Ordenar solicitudes por fecha (más recientes primero)
  solicitudes.sort((a, b) => {
    return new Date(b.fechaSolicitud || 0) - new Date(a.fechaSolicitud || 0);
  });
  
  // Tomar solo las 5 más recientes para el listado
  const solicitudesRecientes = solicitudes.slice(0, 5);
  
  Logger.log("Datos procesados correctamente");
  return {
    totalSolicitudes,
    solicitudesPendientes,
    solicitudesAprobadas,
    solicitudesRechazadas,
    solicitudesPorTipo,
    solicitudesPorPais,
    solicitudesRecientes
  };
}

// Función auxiliar para encontrar el índice de columna de manera flexible
function findColumnIndex(headers, possibleNames) {
  for (const name of possibleNames) {
    const index = headers.findIndex(header => header.toLowerCase() === name.toLowerCase());
    if (index >= 0) return index;
  }
  return -1;
} 