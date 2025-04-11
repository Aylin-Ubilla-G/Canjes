document.addEventListener('DOMContentLoaded', function() {
    console.log("Dashboard inicializándose...");
    
    // Mostrar mensajes de carga
    mostrarCargando();
    
    // Cargar datos reales desde Google Apps Script
    cargarDatosReales();
    
    // Configurar filtros
    configurarFiltros();
});

function mostrarCargando() {
    // Mostrar carga en resúmenes
    document.getElementById('resumen-por-tipo').innerHTML = `
        <div class="loading-content">
            <div class="spinner"></div>
            <p>Cargando datos...</p>
        </div>
    `;
    
    document.getElementById('resumen-por-pais').innerHTML = `
        <div class="loading-content">
            <div class="spinner"></div>
            <p>Cargando datos...</p>
        </div>
    `;
    
    // Mostrar mensaje de carga en la tabla de solicitudes recientes
    const recentRequestsTable = document.querySelector('.recent-requests');
    if (recentRequestsTable) {
        recentRequestsTable.innerHTML = `
            <h3>Solicitudes Recientes</h3>
            <div class="loading-content">
                <div class="spinner"></div>
                <p>Cargando solicitudes...</p>
            </div>
        `;
    }
}

function cargarDatosReales() {
    // URL correcta del script de Google Apps Script
    const scriptUrl = 'https://script.google.com/macros/s/AKfycbwZAPR6dzK6v0-gDAnzhvf_GCGb6bt4NYNuYMQ36qO2zSK90XDqInDlnZSlo909Lug9FQ/exec';
    
    // Parámetros para solicitar datos del dashboard
    const params = new URLSearchParams();
    params.append('action', 'getDashboardData');
    
    // Filtros adicionales si se han configurado
    const filtroFechaDesde = document.getElementById('filtro-fecha-desde');
    const filtroFechaHasta = document.getElementById('filtro-fecha-hasta');
    const filtroEstado = document.getElementById('filtro-estado');
    const filtroPais = document.getElementById('filtro-pais');
    
    if (filtroFechaDesde && filtroFechaDesde.value) {
        params.append('fechaDesde', filtroFechaDesde.value);
    }
    
    if (filtroFechaHasta && filtroFechaHasta.value) {
        params.append('fechaHasta', filtroFechaHasta.value);
    }
    
    if (filtroEstado && filtroEstado.value) {
        params.append('estado', filtroEstado.value);
    }
    
    if (filtroPais && filtroPais.value) {
        params.append('pais', filtroPais.value);
    }
    
    // Obtener la URL completa con parámetros
    const url = `${scriptUrl}?${params.toString()}`;
    
    console.log("Solicitando datos al servidor:", url);
    
    // Mostrar estado de carga
    const status = document.createElement('div');
    status.className = 'dashboard-status';
    status.innerHTML = `<div class="loading-message">Conectando a Google Sheets...</div>`;
    document.querySelector('.container').appendChild(status);
    
    // Realizar la solicitud
    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);
            }
            status.innerHTML = `<div class="loading-message">Procesando datos...</div>`;
            return response.json();
        })
        .then(data => {
            console.log("Datos recibidos:", data);
            document.querySelector('.container').removeChild(status);
            
            if (data.success) {
                // Transformar los datos recibidos al formato esperado
                const dashboardData = procesarDatosServidor(data);
                // Actualizar el dashboard
                actualizarDashboard(dashboardData);
            } else {
                console.error("Error en la respuesta del servidor:", data.message);
                mostrarErrorConexion(data.message || "Error al obtener datos del servidor");
                // Usar datos de prueba como fallback después de 2 segundos
                setTimeout(usarDatosDePrueba, 2000);
            }
        })
        .catch(error => {
            console.error("Error al cargar datos:", error);
            document.querySelector('.container').removeChild(status);
            
            // Mostrar mensaje de error específico
            mostrarErrorConexion(`
                Error al conectar con Google Sheets: ${error.message}.<br>
                Verifica que el script tenga permisos para ejecutarse y que la URL sea correcta.<br>
                Mostrando datos de ejemplo mientras tanto.
            `);
            
            // Usar datos de prueba como fallback después de 2 segundos
            setTimeout(usarDatosDePrueba, 2000);
        });
}

function procesarDatosServidor(responseData) {
    // Si el servidor ya devuelve los datos en el formato esperado, retornarlos directamente
    if (responseData.data && responseData.data.totalSolicitudes !== undefined) {
        return responseData.data;
    }
    
    // De lo contrario, transformar los datos al formato esperado
    const dashboardData = {
        totalSolicitudes: 0,
        solicitudesPendientes: 0,
        solicitudesAprobadas: 0,
        solicitudesRechazadas: 0,
        solicitudesPorTipo: {},
        solicitudesPorPais: {},
        solicitudesRecientes: []
    };
    
    // Si no hay datos en la respuesta, retornar el objeto vacío
    if (!responseData.data || !responseData.data.solicitudes) {
        return dashboardData;
    }
    
    // Procesar las solicitudes
    const solicitudes = responseData.data.solicitudes || [];
    
    // Calcular totales
    dashboardData.totalSolicitudes = solicitudes.length;
    
    // Contar por estado
    solicitudes.forEach(solicitud => {
        if (solicitud.estado === 'pendiente') {
            dashboardData.solicitudesPendientes++;
        } else if (solicitud.estado === 'aprobado') {
            dashboardData.solicitudesAprobadas++;
        } else if (solicitud.estado === 'rechazado') {
            dashboardData.solicitudesRechazadas++;
        }
        
        // Contar por tipo
        const tipo = solicitud.tipoSolicitud || 'desconocido';
        dashboardData.solicitudesPorTipo[tipo] = (dashboardData.solicitudesPorTipo[tipo] || 0) + 1;
        
        // Contar por país
        const pais = solicitud.pais || 'Desconocido';
        dashboardData.solicitudesPorPais[pais] = (dashboardData.solicitudesPorPais[pais] || 0) + 1;
    });
    
    // Obtener solicitudes recientes (últimas 5)
    dashboardData.solicitudesRecientes = solicitudes
        .sort((a, b) => new Date(b.fechaSolicitud) - new Date(a.fechaSolicitud))
        .slice(0, 5);
    
    return dashboardData;
}

function mostrarErrorConexion(mensaje) {
    // Mostrar mensaje de error en los contenedores de resumen
    document.getElementById('resumen-por-tipo').innerHTML = `
        <div class="error-chart">
            <i class="fas fa-exclamation-triangle"></i>
            <p>${mensaje}</p>
        </div>
    `;
    
    document.getElementById('resumen-por-pais').innerHTML = `
        <div class="error-chart">
            <i class="fas fa-exclamation-triangle"></i>
            <p>${mensaje}</p>
        </div>
    `;
}

function usarDatosDePrueba() {
    console.log("Utilizando datos de prueba para el dashboard");
    
    // Datos simulados
    const mockData = {
        totalSolicitudes: 45,
        solicitudesPendientes: 12,
        solicitudesAprobadas: 28,
        solicitudesRechazadas: 5,
        solicitudesPorTipo: {
            tickets: 25,
            giftcard: 15,
            billetera: 5
        },
        solicitudesPorPais: {
            "Chile": 20,
            "Argentina": 10,
            "Perú": 8,
            "Colombia": 4,
            "Paraguay": 2,
            "Uruguay": 1
        },
        solicitudesRecientes: [
            {id: "SOL-001", email: "cliente1@ejemplo.com", tipoSolicitud: "tickets", pais: "Chile", fechaSolicitud: "2023-11-10", estado: "aprobado"},
            {id: "SOL-002", email: "cliente2@ejemplo.com", tipoSolicitud: "giftcard", pais: "Argentina", fechaSolicitud: "2023-11-09", estado: "pendiente"},
            {id: "SOL-003", email: "cliente3@ejemplo.com", tipoSolicitud: "billetera", pais: "Colombia", fechaSolicitud: "2023-11-08", estado: "rechazado"},
            {id: "SOL-004", email: "cliente4@ejemplo.com", tipoSolicitud: "tickets", pais: "Perú", fechaSolicitud: "2023-11-07", estado: "procesando"},
            {id: "SOL-005", email: "cliente5@ejemplo.com", tipoSolicitud: "giftcard", pais: "Chile", fechaSolicitud: "2023-11-06", estado: "aprobado"}
        ]
    };
    
    // Actualizar el dashboard con los datos de prueba
    actualizarDashboard(mockData);
}

function actualizarDashboard(data) {
    console.log("Actualizando dashboard con datos:", data);
    
    // Actualizar métricas principales
    actualizarMetricas(data);
    
    // Actualizar resúmenes en lugar de gráficos
    actualizarResumenes(data);
    
    // Actualizar tabla de solicitudes recientes
    actualizarTablaRecientes(data.solicitudesRecientes || []);
    
    // Actualizar fecha de última actualización
    document.getElementById('fecha-actualizacion').textContent = new Date().toLocaleString();
}

function actualizarMetricas(data) {
    // Actualizar los números en las tarjetas
    if (document.getElementById('total-solicitudes')) {
        document.getElementById('total-solicitudes').textContent = data.totalSolicitudes || 0;
    }
    
    if (document.getElementById('solicitudes-pendientes')) {
        document.getElementById('solicitudes-pendientes').textContent = data.solicitudesPendientes || 0;
    }
    
    if (document.getElementById('solicitudes-aprobadas')) {
        document.getElementById('solicitudes-aprobadas').textContent = data.solicitudesAprobadas || 0;
    }
    
    if (document.getElementById('solicitudes-rechazadas')) {
        document.getElementById('solicitudes-rechazadas').textContent = data.solicitudesRechazadas || 0;
    }
}

function actualizarResumenes(data) {
    // Actualizar resumen por tipo de solicitud
    const resumenTipoContainer = document.getElementById('resumen-por-tipo');
    if (resumenTipoContainer && data.solicitudesPorTipo) {
        if (!data.solicitudesPorTipo || Object.keys(data.solicitudesPorTipo).length === 0) {
            resumenTipoContainer.innerHTML = `<div class="empty-message">No hay datos disponibles</div>`;
            return;
        }
        
        let html = '';
        
        // Ordenar tipos por cantidad (mayor a menor)
        const tiposOrdenados = Object.entries(data.solicitudesPorTipo)
            .sort((a, b) => b[1] - a[1]);
        
        tiposOrdenados.forEach(([tipo, valor]) => {
            const tipoCapitalizado = tipo.charAt(0).toUpperCase() + tipo.slice(1);
            const colorDot = getTipoColor(tipo);
            
            html += `
                <div class="summary-item">
                    <div class="label">
                        <span class="color-dot" style="background-color: ${colorDot}"></span>
                        ${tipoCapitalizado}
                    </div>
                    <div class="value">${valor}</div>
                </div>
            `;
        });
        
        resumenTipoContainer.innerHTML = html;
    }
    
    // Actualizar resumen por país
    const resumenPaisContainer = document.getElementById('resumen-por-pais');
    if (resumenPaisContainer && data.solicitudesPorPais) {
        if (!data.solicitudesPorPais || Object.keys(data.solicitudesPorPais).length === 0) {
            resumenPaisContainer.innerHTML = `<div class="empty-message">No hay datos disponibles</div>`;
            return;
        }
        
        let html = '';
        
        // Ordenar países por cantidad (mayor a menor)
        const paisesOrdenados = Object.entries(data.solicitudesPorPais)
            .sort((a, b) => b[1] - a[1]);
        
        paisesOrdenados.forEach(([pais, valor]) => {
            const colorDot = getPaisColor(pais);
            
            html += `
                <div class="summary-item">
                    <div class="label">
                        <span class="color-dot" style="background-color: ${colorDot}"></span>
                        ${pais}
                    </div>
                    <div class="value">${valor}</div>
                </div>
            `;
        });
        
        resumenPaisContainer.innerHTML = html;
    }
}

function actualizarTablaRecientes(solicitudes) {
    const container = document.querySelector('.recent-requests');
    if (!container) return;
    
    if (!solicitudes || solicitudes.length === 0) {
        container.innerHTML = `
            <h3>Solicitudes Recientes</h3>
            <div class="empty-message">No hay solicitudes recientes para mostrar</div>
        `;
        return;
    }
    
    let html = `
        <h3>Solicitudes Recientes</h3>
        <div class="table-container">
            <table class="data-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Correo</th>
                        <th>Tipo</th>
                        <th>País</th>
                        <th>Fecha</th>
                        <th>Estado</th>
                    </tr>
                </thead>
                <tbody>
    `;
    
    solicitudes.forEach(solicitud => {
        html += `
            <tr>
                <td>${solicitud.id || '-'}</td>
                <td>${solicitud.email || '-'}</td>
                <td>${getTipoLabel(solicitud.tipoSolicitud) || '-'}</td>
                <td>${solicitud.pais || '-'}</td>
                <td>${formatDate(solicitud.fechaSolicitud) || '-'}</td>
                <td><span class="status ${solicitud.estado}">${getEstadoLabel(solicitud.estado)}</span></td>
            </tr>
        `;
    });
    
    html += `
                </tbody>
            </table>
        </div>
    `;
    
    container.innerHTML = html;
}

function configurarFiltros() {
    // Configurar eventos para filtros
    const filtroFechaDesde = document.getElementById('filtro-fecha-desde');
    const filtroFechaHasta = document.getElementById('filtro-fecha-hasta');
    const filtroEstado = document.getElementById('filtro-estado');
    const filtroPais = document.getElementById('filtro-pais');
    
    // Configurar fecha máxima como hoy
    const hoy = new Date().toISOString().split('T')[0];
    if (filtroFechaHasta) filtroFechaHasta.setAttribute('max', hoy);
    
    // Configurar fecha mínima como 3 meses atrás
    const tresMesesAtras = new Date();
    tresMesesAtras.setMonth(tresMesesAtras.getMonth() - 3);
    const tresMesesAtrasStr = tresMesesAtras.toISOString().split('T')[0];
    if (filtroFechaDesde) {
        filtroFechaDesde.setAttribute('min', tresMesesAtrasStr);
        filtroFechaDesde.value = tresMesesAtrasStr;
    }
    
    // Botón de filtrar
    const btnFiltrar = document.getElementById('btn-filtrar');
    if (btnFiltrar) {
        btnFiltrar.addEventListener('click', function() {
            mostrarCargando();
            // Cargar datos reales con los filtros aplicados
            cargarDatosReales();
        });
    }
}

// Funciones auxiliares
function getTipoColor(tipo) {
    const colores = {
        'tickets': '#B52525', // var(--primary-red)
        'giftcard': '#00CCCC', // var(--turquoise)
        'billetera': '#FFA600' // var(--yellow)
    };
    return colores[tipo] || '#122C52'; // var(--primary-blue)
}

function getPaisColor(pais) {
    const colores = {
        'Chile': '#B52525', // var(--primary-red)
        'Argentina': '#122C52', // var(--primary-blue)
        'Perú': '#D6007A', // var(--magenta)
        'Colombia': '#FFA600', // var(--yellow)
        'Paraguay': '#00CCCC', // var(--turquoise)
        'Uruguay': '#84D442', // var(--green)
        'Ecuador': '#3468AB', // var(--primary-blue-lightest)
        'Brasil': '#2B5329' // var(--green-dark)
    };
    return colores[pais] || '#1A3C70'; // var(--primary-blue-light)
}

function getTipoLabel(tipo) {
    const labels = {
        'tickets': 'Tickets',
        'giftcard': 'Gift Card',
        'billetera': 'Billetera'
    };
    return labels[tipo] || tipo;
}

function getEstadoLabel(estado) {
    const labels = {
        'pendiente': 'Pendiente',
        'aprobado': 'Aprobado',
        'rechazado': 'Rechazado',
        'procesando': 'Procesando'
    };
    return labels[estado] || estado;
}

function formatDate(dateString) {
    if (!dateString) return '-';
    
    try {
        const date = new Date(dateString);
        return date.toLocaleDateString();
    } catch (e) {
        return dateString;
    }
} 