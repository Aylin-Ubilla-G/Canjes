function validarPaso2() {
    console.log("Validando paso 2...");
    let isValid = true;
    const tipoSolicitud = document.getElementById('tipoSolicitud').value;
    
    if (tipoSolicitud === 'tickets') {
        // Validar cantidad de pasajeros
        const cantidadPasajeros = document.getElementById('cantidadPasajeros');
        if (!cantidadPasajeros.value || cantidadPasajeros.value < 1) {
            mostrarErrorInput(cantidadPasajeros, 'Por favor, ingresa una cantidad válida');
            isValid = false;
        } else {
            ocultarErrorInput(cantidadPasajeros);
        }
        
        // Validar fecha de ida
        const fechaIda = document.getElementById('fecha-ida');
        if (!fechaIda.value) {
            mostrarErrorInput(fechaIda, 'Por favor, ingresa la fecha de ida');
            isValid = false;
        } else {
            ocultarErrorInput(fechaIda);
        }
        
        // Validar número de vuelo de ida
        const numeroVueloIda = document.getElementById('numero-vuelo-ida');
        if (!numeroVueloIda.value) {
            mostrarErrorInput(numeroVueloIda, 'Por favor, ingresa el número de vuelo de ida');
            isValid = false;
        } else {
            ocultarErrorInput(numeroVueloIda);
        }
        
        // Validar información de cada pasajero
        const pasajeros = document.querySelectorAll('.pasajero-info');
        for (let pasajero of pasajeros) {
            const nombre = pasajero.querySelector('.pasajero-nombre');
            const apellido = pasajero.querySelector('.pasajero-apellido');
            const dni = pasajero.querySelector('.pasajero-dni');
            const fechaNacimiento = pasajero.querySelector('.pasajero-fecha-nacimiento');
            
            if (!nombre.value) {
                mostrarErrorInput(nombre, 'Por favor, ingresa el nombre');
                isValid = false;
            } else {
                ocultarErrorInput(nombre);
            }
            
            if (!apellido.value) {
                mostrarErrorInput(apellido, 'Por favor, ingresa el apellido');
                isValid = false;
            } else {
                ocultarErrorInput(apellido);
            }
            
            if (!dni.value) {
                mostrarErrorInput(dni, 'Por favor, ingresa el DNI/Pasaporte');
                isValid = false;
            } else {
                ocultarErrorInput(dni);
            }
            
            if (!fechaNacimiento.value) {
                mostrarErrorInput(fechaNacimiento, 'Por favor, ingresa la fecha de nacimiento');
                isValid = false;
            } else {
                ocultarErrorInput(fechaNacimiento);
            }
        }
        
        // Validar vuelo de vuelta si es necesario
        const tipoViaje = document.querySelector('input[name="tipoViaje"]:checked').value;
        if (tipoViaje === 'idaVuelta') {
            const fechaVuelta = document.getElementById('fecha-vuelta');
            if (!fechaVuelta.value) {
                mostrarErrorInput(fechaVuelta, 'Por favor, ingresa la fecha de vuelta');
                isValid = false;
            } else {
                ocultarErrorInput(fechaVuelta);
            }
            
            const numeroVueloVuelta = document.getElementById('numero-vuelo-vuelta');
            if (!numeroVueloVuelta.value) {
                mostrarErrorInput(numeroVueloVuelta, 'Por favor, ingresa el número de vuelo de vuelta');
                isValid = false;
            } else {
                ocultarErrorInput(numeroVueloVuelta);
            }
        }
    } else if (tipoSolicitud === 'giftcard' || tipoSolicitud === 'billetera') {
        const suffix = tipoSolicitud === 'giftcard' ? '-gc' : '-bill';
        
        const cantidad = document.getElementById('cantidad' + suffix);
        if (!cantidad.value || cantidad.value < 1) {
            mostrarErrorInput(cantidad, 'Por favor, ingresa una cantidad válida');
            isValid = false;
        } else {
            ocultarErrorInput(cantidad);
        }
        
        const moneda = document.getElementById('moneda' + suffix);
        if (!moneda.value) {
            mostrarErrorInput(moneda, 'Por favor, selecciona una moneda');
            isValid = false;
        } else {
            ocultarErrorInput(moneda);
        }
        
        const monto = document.getElementById('monto' + suffix);
        if (!monto.value || monto.value <= 0) {
            mostrarErrorInput(monto, 'Por favor, ingresa un monto válido');
            isValid = false;
        } else {
            ocultarErrorInput(monto);
        }
    }
    
    console.log("Resultado de validación paso 2:", isValid);
    return isValid;
}

function validarPaso3() {
    console.log("Validando paso 3...");
    let isValid = true;
    
    const partner = document.getElementById('partner');
    const partnerError = document.querySelector('#partner + .error-message') || document.createElement('div');
    
    if (!partnerError.classList.contains('error-message')) {
        partnerError.className = 'error-message';
        partner.insertAdjacentElement('afterend', partnerError);
    }
    
    if (!partner.value) {
        partnerError.textContent = 'Por favor, selecciona un partner';
        partner.classList.add('input-error');
        isValid = false;
    } else {
        partnerError.textContent = '';
        partner.classList.remove('input-error');
    }
    
    const concepto = document.getElementById('concepto');
    const conceptoError = document.querySelector('#concepto + .error-message') || document.createElement('div');
    
    if (!conceptoError.classList.contains('error-message')) {
        conceptoError.className = 'error-message';
        concepto.insertAdjacentElement('afterend', conceptoError);
    }
    
    if (!concepto.value) {
        conceptoError.textContent = 'Por favor, selecciona un concepto';
        concepto.classList.add('input-error');
        isValid = false;
    } else {
        conceptoError.textContent = '';
        concepto.classList.remove('input-error');
    }
    
    console.log("Resultado de validación paso 3:", isValid);
    return isValid;
}

function validarEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function generarResumen() {
    const resumenContenido = document.getElementById('resumen-contenido');
    const tipoSolicitud = document.getElementById('tipoSolicitud').value;
    let resumenHTML = '';
    
    // Información básica
    resumenHTML += `<p><strong>Correo:</strong> ${document.getElementById('email').value}</p>`;
    resumenHTML += `<p><strong>País:</strong> ${document.getElementById('pais').value}</p>`;
    resumenHTML += `<p><strong>Tipo de Solicitud:</strong> ${tipoSolicitud}</p>`;
    resumenHTML += `<p><strong>Canal de Venta:</strong> ${document.getElementById('canalVenta').value}</p>`;
    
    // Detalles específicos según tipo de solicitud
    if (tipoSolicitud === 'tickets') {
        const cantidadPasajeros = parseInt(document.getElementById('cantidadPasajeros').value);
        const tipoViaje = document.querySelector('input[name="tipoViaje"]:checked').value;
        
        resumenHTML += `<h4>Información de Pasajeros</h4>`;
        const pasajeros = document.querySelectorAll('.pasajero-info');
        pasajeros.forEach((pasajero, index) => {
            resumenHTML += `<p><strong>Pasajero ${index + 1}:</strong> `;
            resumenHTML += `${pasajero.querySelector('.pasajero-nombre').value} `;
            resumenHTML += `${pasajero.querySelector('.pasajero-apellido').value}</p>`;
        });
        
        resumenHTML += `<h4>Información de Vuelos</h4>`;
        resumenHTML += `<p><strong>Tipo de Viaje:</strong> ${tipoViaje === 'ida' ? 'Solo Ida' : 'Ida y Vuelta'}</p>`;
        resumenHTML += `<p><strong>Vuelo Ida:</strong> ${document.getElementById('numero-vuelo-ida').value} - ${document.getElementById('fecha-ida').value}</p>`;
        
        if (tipoViaje === 'idaVuelta') {
            resumenHTML += `<p><strong>Vuelo Vuelta:</strong> ${document.getElementById('numero-vuelo-vuelta').value} - ${document.getElementById('fecha-vuelta').value}</p>`;
        }
    } else {
        const suffix = tipoSolicitud === 'giftcard' ? '-gc' : '-bill';
        resumenHTML += `<h4>Detalles del ${tipoSolicitud === 'giftcard' ? 'Gift Card' : 'Billetera'}</h4>`;
        resumenHTML += `<p><strong>Cantidad:</strong> ${document.getElementById('cantidad' + suffix).value}</p>`;
        resumenHTML += `<p><strong>Moneda:</strong> ${document.getElementById('moneda' + suffix).value}</p>`;
        resumenHTML += `<p><strong>Monto:</strong> ${document.getElementById('monto' + suffix).value}</p>`;
    }
    
    resumenContenido.innerHTML = resumenHTML;
}

function setupExcelFileUpload() {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.id = 'excelFile';
    fileInput.accept = '.xlsx';
    fileInput.style.display = 'none';
    
    const button = document.createElement('button');
    button.id = 'cargarExcel';
    button.className = 'btn-secondary';
    button.textContent = 'Cargar archivo de canjes';
    button.style.margin = '20px auto';
    button.style.display = 'block';
    
    // Agregar elementos al DOM
    const container = document.querySelector('.container');
    container.insertBefore(fileInput, container.firstChild.nextSibling);
    container.insertBefore(button, container.firstChild.nextSibling);
    
    // Configurar eventos
    button.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', handleExcelFileUpload);
}

async function handleExcelFileUpload(event) {
    const file = event.target.files[0];
    if (!file) {
        logDebug("No se seleccionó ningún archivo", {});
        return;
    }
    
    logDebug("Archivo seleccionado", { nombre: file.name, tamaño: file.size });
    
    try {
        const reader = new FileReader();
        
        reader.onload = function(e) {
            logDebug("Archivo leído correctamente", { resultado: "Success" });
            
            try {
                const data = new Uint8Array(e.target.result);
                const workbook = XLSX.read(data, { type: 'array' });
                
                logDebug("Hojas encontradas", { hojas: workbook.SheetNames });
                
                // Procesar los datos del archivo Excel
                procesarDatosExcel(workbook);
            } catch (error) {
                logDebug("Error al procesar el contenido del archivo", { error: error.toString() });
                console.error('Error al procesar el archivo Excel:', error);
                alert('Error al procesar el archivo. Verifique que sea un archivo Excel válido.');
            }
        };
        
        reader.onerror = function(e) {
            logDebug("Error al leer el archivo", { error: e.target.error });
        };
        
        reader.readAsArrayBuffer(file);
        
        // Ocultar el botón una vez cargado
        document.getElementById('cargarExcel').style.display = 'none';
    } catch (error) {
        logDebug("Error en el proceso de lectura", { error: error.toString() });
        console.error('Error al leer el archivo Excel:', error);
        alert('Error al leer el archivo. Por favor, intente con otro archivo.');
    }
}

function procesarDatosExcel(workbook) {
    try {
        logDebug("Iniciando procesamiento de Excel", { hojas: workbook.SheetNames });
        
        // Verificar que el archivo tiene las hojas necesarias
        if (workbook.SheetNames.length < 2) {
            throw new Error("El archivo debe tener al menos 2 hojas (Países y Partners)");
        }
        
        // Cargar países
        const paisesSheet = workbook.Sheets[workbook.SheetNames[0]];
        logDebug("Hoja de países encontrada", { nombre: workbook.SheetNames[0] });
        
        const paises = XLSX.utils.sheet_to_json(paisesSheet);
        logDebug("Datos de países extraídos", { cantidad: paises.length, muestra: paises.slice(0, 2) });
        
        if (paises.length === 0) {
            throw new Error("No se encontraron datos de países en la primera hoja");
        }
        
        // Verificar formato
        if (!paises[0].hasOwnProperty('codigo') || !paises[0].hasOwnProperty('nombre')) {
            throw new Error("La hoja de países debe tener columnas 'codigo' y 'nombre'");
        }
        
        const selectPais = document.getElementById('pais');
        
        // Limpiar opciones actuales
        selectPais.innerHTML = '<option value="">Seleccione su país</option>';
        
        paises.forEach(pais => {
            const option = document.createElement('option');
            option.value = pais.codigo;
            option.textContent = pais.nombre;
            selectPais.appendChild(option);
        });
        
        // Cargar partners y conceptos
        const partnersSheet = workbook.Sheets[workbook.SheetNames[1]];
        logDebug("Hoja de partners encontrada", { nombre: workbook.SheetNames[1] });
        
        const partners = XLSX.utils.sheet_to_json(partnersSheet);
        logDebug("Datos de partners extraídos", { cantidad: partners.length, muestra: partners.slice(0, 2) });
        
        if (partners.length === 0) {
            throw new Error("No se encontraron datos de partners en la segunda hoja");
        }
        
        // Verificar formato
        if (!partners[0].hasOwnProperty('partner') || !partners[0].hasOwnProperty('concepto')) {
            throw new Error("La hoja de partners debe tener columnas 'partner' y 'concepto'");
        }
        
        const selectPartner = document.getElementById('partner');
        const selectConcepto = document.getElementById('concepto');
        
        // Limpiar opciones actuales
        selectPartner.innerHTML = '<option value="">Seleccione partner</option>';
        selectConcepto.innerHTML = '<option value="">Seleccione concepto</option>';
        
        // Agrupar partners y conceptos
        const partnerMap = new Map();
        partners.forEach(row => {
            if (!partnerMap.has(row.partner)) {
                partnerMap.set(row.partner, new Set());
            }
            partnerMap.get(row.partner).add(row.concepto);
        });
        
        // Llenar select de partners
        partnerMap.forEach((conceptos, partner) => {
            const option = document.createElement('option');
            option.value = partner;
            option.textContent = partner;
            selectPartner.appendChild(option);
        });
        
        // Actualizar conceptos cuando cambia el partner
        selectPartner.addEventListener('change', function() {
            selectConcepto.innerHTML = '<option value="">Seleccione concepto</option>';
            if (this.value) {
                const conceptos = partnerMap.get(this.value);
                conceptos.forEach(concepto => {
                    const option = document.createElement('option');
                    option.value = concepto;
                    option.textContent = concepto;
                    selectConcepto.appendChild(option);
                });
            }
        });
        
        alert('Archivo cargado correctamente');
    } catch (error) {
        logDebug("Error al procesar el archivo Excel", { 
            mensaje: error.toString(),
            stack: error.stack
        });
        console.error('Error al procesar el archivo Excel:', error);
        alert('Error al procesar el archivo: ' + error.message);
    }
}

function setupDynamicFormBehavior() {
    console.log("Configurando comportamiento dinámico del formulario...");
    
    // 1. Manejar cambio en cantidad de pasajeros
    const cantidadPasajeros = document.getElementById('cantidadPasajeros');
    if (cantidadPasajeros) {
        cantidadPasajeros.addEventListener('change', function() {
            generatePassengerForms(this.value);
        });
        
        // Generar formularios iniciales
        generatePassengerForms(cantidadPasajeros.value);
    }
    
    // 2. Manejar cambio en tipo de viaje
    const tipoViajeRadios = document.querySelectorAll('input[name="tipoViaje"]');
    tipoViajeRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            const vueloVuelta = document.getElementById('vuelo-vuelta');
            if (vueloVuelta) {
                vueloVuelta.style.display = this.value === 'idaVuelta' ? 'block' : 'none';
            }
        });
    });
    
    // 3. Manejar cambio en tipo de solicitud
    const tipoSolicitud = document.getElementById('tipoSolicitud');
    if (tipoSolicitud) {
        tipoSolicitud.addEventListener('change', function() {
            updateFormSections();
        });
    }
    
    console.log("Comportamiento dinámico configurado correctamente");
}

function generatePassengerForms(cantidad) {
    console.log(`Generando formularios para ${cantidad} pasajeros`);
    
    const container = document.getElementById('pasajeros-container');
    if (!container) {
        console.error("No se encontró el contenedor de pasajeros");
        return;
    }
    
    // Limpiar contenedor
    container.innerHTML = '';
    
    // Validar cantidad (máximo 9)
    cantidad = Math.min(Math.max(parseInt(cantidad) || 1, 1), 9);
    
    // Generar formularios
    for (let i = 1; i <= cantidad; i++) {
        const pasajeroDiv = document.createElement('div');
        pasajeroDiv.className = 'pasajero-info';
        pasajeroDiv.dataset.pasajero = i;
        
        pasajeroDiv.innerHTML = `
            <h4>Pasajero ${i}</h4>
            <div class="form-group">
                <label>* Nombre</label>
                <input type="text" class="pasajero-nombre" required>
            </div>
            <div class="form-group">
                <label>* Apellido</label>
                <input type="text" class="pasajero-apellido" required>
            </div>
            <div class="form-group">
                <label>* DNI/Pasaporte</label>
                <input type="text" class="pasajero-dni" required>
            </div>
            <div class="form-group">
                <label>* Fecha de nacimiento</label>
                <input type="date" class="pasajero-fecha-nacimiento" required>
            </div>
        `;
        
        container.appendChild(pasajeroDiv);
    }
    
    console.log(`${cantidad} formularios de pasajeros generados`);
}

function cargarDatosPredefinidos() {
    // Cargar países
    const paises = ['Chile', 'Argentina', 'Perú', 'Colombia', 'Paraguay', 'Uruguay', 'Ecuador', 'Brasil'];
    const selectPais = document.getElementById('pais');
    
    if (selectPais) {
        selectPais.innerHTML = '<option value="">Selecciona tu país</option>';
        paises.forEach(pais => {
            const option = document.createElement('option');
            option.value = pais.toLowerCase();
            option.textContent = pais;
            selectPais.appendChild(option);
        });
    }
    
    // Cargar partners
    const partners = [
        'Copa Trinche', 'FILBO', 'GHL', 'Camara dela Diversidad', 'DICO', 'FENALCO',
        'CAMARA DE COMERCIO DE PEREIRA', 'CITY TV', 'CENCOSUD', 'Ayax Travel',
        'Intertours (Workshop Work & FUN)', 'Despegar', 'Alexandra Nunton',
        'Diario El Pais', 'Diario Crónicas', 'Influ AO (Flavio Fusco)',
        'Influ AO (Dionei e Felipe Kreusch)', 'Influ AO (Manuela)', 
        'Influ AO (Barbara Cherubini)', 'Influ AO (Renata Porto)', 'PY Rock fest (4 eventos)',
        'Transport', 'Travel Ecuador', 'Cyberday EC', 'CAMEPE', 'Cámara de Comercio de Quito',
        'Aniversario Chiclayo/Concierto Ráfaga', 'Carrera de la Amistad/ Chiclayo',
        'Carnaval Blanco', 'We the lion', 'Hombres a la plancha', 'Preludio', 'Raiz Camp',
        'Radio Exitosa', 'Radio: estudio 92', 'CVC (pendiente de 2024)'
    ];
    
    const selectPartner = document.getElementById('partner');
    if (selectPartner) {
        selectPartner.innerHTML = '<option value="">Selecciona un partner</option>';
        partners.forEach(partner => {
            const option = document.createElement('option');
            option.value = partner.toLowerCase().replace(/\s+/g, '_');
            option.textContent = partner;
            selectPartner.appendChild(option);
        });
    }
    
    // Cargar conceptos para partner seleccionado
    const conceptoSelect = document.getElementById('concepto');
    const partnerSelect = document.getElementById('partner');
    
    if (partnerSelect && conceptoSelect) {
        partnerSelect.addEventListener('change', function() {
            conceptoSelect.innerHTML = '<option value="">Selecciona un concepto</option>';
            
            if (this.value) {
                const conceptos = ['Marketing', 'Comercial', 'Otro'];
                conceptos.forEach(concepto => {
                    const option = document.createElement('option');
                    option.value = concepto.toLowerCase();
                    option.textContent = concepto;
                    conceptoSelect.appendChild(option);
                });
            }
        });
    }
}

function enviarDatosAGoogleSheet() {
    try {
        // Mostrar mensaje de carga
        const loadingMessage = document.createElement('div');
        loadingMessage.className = 'loading-overlay';
        loadingMessage.innerHTML = `
            <div class="loading-content">
                <div class="spinner"></div>
                <p>Enviando tu solicitud...</p>
            </div>
        `;
        document.body.appendChild(loadingMessage);
        
        // Recopilar todos los datos
        const tipoSolicitud = document.getElementById('tipoSolicitud').value;
        const formData = new FormData();
        
        // Datos básicos
        formData.append('email', document.getElementById('email').value);
        formData.append('pais', document.getElementById('pais').options[document.getElementById('pais').selectedIndex].text);
        formData.append('tipoSolicitud', tipoSolicitud);
        formData.append('canalVenta', document.getElementById('canalVenta').value);
        
        // Paso 3
        formData.append('partner', document.getElementById('partner').options[document.getElementById('partner').selectedIndex].text);
        formData.append('concepto', document.getElementById('concepto').value);
        
        // Fecha de la solicitud
        formData.append('fechaSolicitud', new Date().toISOString());
        
        // Agregar datos específicos según tipo de solicitud
        if (tipoSolicitud === 'tickets') {
            formData.append('cantidadPasajeros', document.getElementById('cantidadPasajeros').value);
            formData.append('tipoViaje', document.querySelector('input[name="tipoViaje"]:checked').value);
            
            // Información de vuelos
            formData.append('vueloIdaFecha', document.getElementById('fecha-ida').value);
            formData.append('vueloIdaNumero', document.getElementById('numero-vuelo-ida').value);
            
            if (formData.get('tipoViaje') === 'idaVuelta') {
                formData.append('vueloVueltaFecha', document.getElementById('fecha-vuelta').value);
                formData.append('vueloVueltaNumero', document.getElementById('numero-vuelo-vuelta').value);
            }
            
            // Recopilar información de pasajeros
            const pasajeros = [];
            document.querySelectorAll('.pasajero-info').forEach(pasajero => {
                pasajeros.push({
                    nombre: pasajero.querySelector('.pasajero-nombre').value,
                    apellido: pasajero.querySelector('.pasajero-apellido').value,
                    dni: pasajero.querySelector('.pasajero-dni').value,
                    fechaNacimiento: pasajero.querySelector('.pasajero-fecha-nacimiento').value
                });
            });
            formData.append('pasajerosInfo', JSON.stringify(pasajeros));
        } else {
            const suffix = tipoSolicitud === 'giftcard' ? '-gc' : '-bill';
            formData.append('cantidad', document.getElementById('cantidad' + suffix).value);
            formData.append('moneda', document.getElementById('moneda' + suffix).value);
            formData.append('monto', document.getElementById('monto' + suffix).value);
        }
        
        // URL del script de Google Apps Script
        const scriptUrl = 'https://script.google.com/macros/s/AKfycbzs5Iw2_blcsvkEtBBGaIK2oPQ4ObDR3Rqy7ubSR-uADW3YDXluJWnb_VVN09xQxgaqLw/exec';
        
        // Preparar datos para formulario
        const queryString = new URLSearchParams();
        for (const [key, value] of formData.entries()) {
            queryString.append(key, value);
        }
        
        // Usar XMLHttpRequest
        const xhr = new XMLHttpRequest();
        xhr.open('POST', scriptUrl, true);
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        
        // Configurar evento de respuesta
        xhr.onload = function() {
            // Quitar mensaje de carga
            document.body.removeChild(loadingMessage);
            
            // Mostrar mensaje de éxito
            const successMessage = document.createElement('div');
            successMessage.className = 'success-overlay';
            successMessage.innerHTML = `
                <div class="success-content">
                    <div class="success-icon">
                        <i class="fas fa-check-circle"></i>
                    </div>
                    <h3>¡Solicitud enviada con éxito!</h3>
                    <p>Hemos recibido tu solicitud de canje correctamente.</p>
                    <p>Te enviaremos un correo electrónico con la confirmación a: ${formData.get('email')}</p>
                    <button class="btn-primary close-success">ACEPTAR</button>
                </div>
            `;
            document.body.appendChild(successMessage);
            
            // Cerrar mensaje y redireccionar
            document.querySelector('.close-success').addEventListener('click', function() {
                document.body.removeChild(successMessage);
                window.location.href = 'index.html';
            });
        };
        
        // Configurar evento de error
        xhr.onerror = function() {
            // Quitar mensaje de carga
            document.body.removeChild(loadingMessage);
            
            console.error('Error al enviar datos');
            alert('Ocurrió un error al enviar la solicitud. Por favor, intenta nuevamente.');
        };
        
        // Enviar la solicitud
        xhr.send(queryString.toString());
        
    } catch (error) {
        console.error('Error al preparar el envío:', error);
        alert('Ocurrió un error al preparar la solicitud. Por favor, intenta nuevamente.');
    }
}

function recolectarDatosFormulario() {
    const tipoSolicitud = document.getElementById('tipoSolicitud').value;
    const datosBasicos = {
        email: document.getElementById('email').value,
        pais: document.getElementById('pais').value,
        tipoSolicitud: tipoSolicitud,
        canalVenta: document.getElementById('canalVenta').value,
        partner: document.getElementById('partner').value,
        concepto: document.getElementById('concepto').value,
        fechaSolicitud: new Date().toISOString()
    };
    
    let datosEspecificos = {};
    
    if (tipoSolicitud === 'tickets') {
        datosEspecificos = recolectarDatosTickets();
    } else {
        datosEspecificos = recolectarDatosGiftCardBilletera(tipoSolicitud);
    }
    
    return { ...datosBasicos, ...datosEspecificos };
}

function recolectarDatosTickets() {
    const pasajeros = [];
    document.querySelectorAll('.pasajero-info').forEach(pasajero => {
        pasajeros.push({
            nombre: pasajero.querySelector('.pasajero-nombre').value,
            apellido: pasajero.querySelector('.pasajero-apellido').value,
            dni: pasajero.querySelector('.pasajero-dni').value,
            fechaNacimiento: pasajero.querySelector('.pasajero-fecha-nacimiento').value
        });
    });
    
    const tipoViaje = document.querySelector('input[name="tipoViaje"]:checked').value;
    const datos = {
        cantidadPasajeros: document.getElementById('cantidadPasajeros').value,
        pasajeros: pasajeros,
        tipoViaje: tipoViaje,
        vueloIda: {
            fecha: document.getElementById('fecha-ida').value,
            numero: document.getElementById('numero-vuelo-ida').value
        }
    };
    
    if (tipoViaje === 'idaVuelta') {
        datos.vueloVuelta = {
            fecha: document.getElementById('fecha-vuelta').value,
            numero: document.getElementById('numero-vuelo-vuelta').value
        };
    }
    
    return datos;
}

function recolectarDatosGiftCardBilletera(tipo) {
    const suffix = tipo === 'giftcard' ? '-gc' : '-bill';
    return {
        cantidad: document.getElementById('cantidad' + suffix).value,
        moneda: document.getElementById('moneda' + suffix).value,
        monto: document.getElementById('monto' + suffix).value
    };
}

// Añadir logger para debugging
function logDebug(message, data) {
    console.log(`[DEBUG] ${message}`, data);
    // También puedes mostrar información en la UI
    const debugDiv = document.getElementById('debug-info') || 
                     (() => {
                         const div = document.createElement('div');
                         div.id = 'debug-info';
                         div.style.padding = '10px';
                         div.style.margin = '10px';
                         div.style.border = '1px solid red';
                         div.style.backgroundColor = '#ffe6e6';
                         document.body.appendChild(div);
                         return div;
                     })();
    
    debugDiv.innerHTML += `<p>${message}: ${JSON.stringify(data)}</p>`;
}

// Función principal para validar paso 1
function validarPaso1() {
    console.log("Validando paso 1...");
    let isValid = true;
    
    // Validar email
    const email = document.getElementById('email');
    if (!email || !email.value) {
        mostrarErrorInput(email, 'Por favor, ingresa tu correo electrónico');
        isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
        mostrarErrorInput(email, 'Por favor, ingresa un correo electrónico válido');
        isValid = false;
    } else {
        ocultarErrorInput(email);
    }
    
    // Validar país
    const pais = document.getElementById('pais');
    if (!pais || !pais.value) {
        mostrarErrorInput(pais, 'Por favor, selecciona tu país');
        isValid = false;
    } else {
        ocultarErrorInput(pais);
    }
    
    // Validar tipo de solicitud
    const tipoSolicitud = document.getElementById('tipoSolicitud');
    if (!tipoSolicitud || !tipoSolicitud.value) {
        mostrarErrorInput(tipoSolicitud, 'Por favor, selecciona un tipo de canje');
        isValid = false;
    } else {
        ocultarErrorInput(tipoSolicitud);
    }
    
    // Validar canal de venta
    const canalVenta = document.getElementById('canalVenta');
    if (!canalVenta || !canalVenta.value) {
        mostrarErrorInput(canalVenta, 'Por favor, selecciona tu canal de venta');
        isValid = false;
    } else {
        ocultarErrorInput(canalVenta);
    }
    
    console.log("Resultado validación paso 1:", isValid);
    return isValid;
}

// Este código se debe colocar al final del archivo, después de todas las funciones
// Para ejecutarse inmediatamente y reparar la navegación
(function repararNavegacion() {
    console.log("Reparando navegación...");
    
    // Referencias a botones
    const nextStep1Button = document.getElementById('next-step1');
    const prevStep2Button = document.getElementById('prev-step2');
    const nextStep2Button = document.getElementById('next-step2');
    const prevStep3Button = document.getElementById('prev-step3');
    const submitFormButton = document.getElementById('submit-form');
    
    console.log("Botones encontrados:", {
        nextStep1Button: nextStep1Button ? true : false,
        prevStep2Button: prevStep2Button ? true : false,
        nextStep2Button: nextStep2Button ? true : false,
        prevStep3Button: prevStep3Button ? true : false,
        submitFormButton: submitFormButton ? true : false,
    });

    // Eliminar todos los event listeners actuales
    if (nextStep1Button) {
        const nuevoBoton = nextStep1Button.cloneNode(true);
        nextStep1Button.parentNode.replaceChild(nuevoBoton, nextStep1Button);
        nuevoBoton.onclick = function(e) {
            e.preventDefault();
            console.log("Clic directo en botón siguiente paso 1");
            if (validarPaso1()) {
                mostrarPaso(2);
                actualizarSeccionesSegunTipo();
            }
        };
    }

    if (prevStep2Button) {
        const nuevoBoton = prevStep2Button.cloneNode(true);
        prevStep2Button.parentNode.replaceChild(nuevoBoton, prevStep2Button);
        nuevoBoton.onclick = function(e) {
            e.preventDefault();
            console.log("Clic directo en botón anterior paso 2");
            mostrarPaso(1);
        };
    }

    if (nextStep2Button) {
        const nuevoBoton = nextStep2Button.cloneNode(true);
        nextStep2Button.parentNode.replaceChild(nuevoBoton, nextStep2Button);
        nuevoBoton.onclick = function(e) {
            e.preventDefault();
            console.log("Clic directo en botón siguiente paso 2");
            if (validarPaso2()) {
                mostrarPaso(3);
                generarResumen();
            }
        };
    }

    if (prevStep3Button) {
        const nuevoBoton = prevStep3Button.cloneNode(true);
        prevStep3Button.parentNode.replaceChild(nuevoBoton, prevStep3Button);
        nuevoBoton.onclick = function(e) {
            e.preventDefault();
            console.log("Clic directo en botón anterior paso 3");
            mostrarPaso(2);
        };
    }

    if (submitFormButton) {
        const nuevoBoton = submitFormButton.cloneNode(true);
        submitFormButton.parentNode.replaceChild(nuevoBoton, submitFormButton);
        nuevoBoton.onclick = function(e) {
            e.preventDefault();
            console.log("Clic directo en botón enviar solicitud");
            if (validarPaso3()) {
                enviarDatosAGoogleSheet();
            }
        };
    }
    
    console.log("Navegación reparada");
})();

function actualizarSeccionesSegunTipo() {
    console.log("Actualizando secciones según tipo de solicitud");
    const tipoSolicitud = document.getElementById('tipoSolicitud').value;
    
    // Obtener referencias a las secciones
    const ticketsSection = document.getElementById('tickets-section');
    const giftcardSection = document.getElementById('giftcard-section');
    const billeteraSection = document.getElementById('billetera-section');
    
    // Verificar que todas las secciones existen
    if (!ticketsSection || !giftcardSection || !billeteraSection) {
        console.error("No se encontraron todas las secciones necesarias");
        return;
    }
    
    // Ocultar todas las secciones
    ticketsSection.style.display = 'none';
    giftcardSection.style.display = 'none';
    billeteraSection.style.display = 'none';
    
    // Mostrar la sección correspondiente al tipo seleccionado
    console.log(`Tipo de solicitud seleccionado: ${tipoSolicitud}`);
    
    if (tipoSolicitud === 'tickets') {
        ticketsSection.style.display = 'block';
    } else if (tipoSolicitud === 'giftcard') {
        giftcardSection.style.display = 'block';
    } else if (tipoSolicitud === 'billetera') {
        billeteraSection.style.display = 'block';
    }
}

// Funciones auxiliares para mostrar y ocultar errores
function mostrarErrorInput(input, mensaje) {
    input.classList.add('input-error');
    
    // Buscar mensaje de error existente o crear uno nuevo
    let errorDiv = input.nextElementSibling;
    if (!errorDiv || !errorDiv.classList.contains('error-message')) {
        errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        input.insertAdjacentElement('afterend', errorDiv);
    }
    
    errorDiv.textContent = mensaje;
    errorDiv.style.display = 'block';
}

function ocultarErrorInput(input) {
    input.classList.remove('input-error');
    
    // Ocultar mensaje de error si existe
    const errorDiv = input.nextElementSibling;
    if (errorDiv && errorDiv.classList.contains('error-message')) {
        errorDiv.textContent = '';
        errorDiv.style.display = 'none';
    }
}

// Reemplaza el evento DOMContentLoaded por esta versión
document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM completamente cargado");
    
    // Eliminar navegación de emergencia si existe
    const emergencyNav = document.querySelector('div[style*="border: 1px solid #f00"]');
    if (emergencyNav) {
        console.log("Eliminando navegación de emergencia");
        emergencyNav.remove();
    }
    
    // Cargar datos predefinidos
    cargarDatosPredefinidos();
    
    // Configurar la navegación
    setupNavigation();
    
    // Configurar comportamiento dinámico
    setupDynamicFormBehavior();
    
    // Verificar elementos del DOM
    verificarElementosDOM();
    
    // Inicialización específica para estos elementos
    const tipoSolicitud = document.getElementById('tipoSolicitud');
    if (tipoSolicitud) {
        tipoSolicitud.addEventListener('change', actualizarSeccionesSegunTipo);
    }
    
    const cantidadPasajeros = document.getElementById('cantidadPasajeros');
    if (cantidadPasajeros) {
        generatePassengerForms(cantidadPasajeros.value || 1);
    }
    
    console.log("Inicialización completada");
});

function setupNavigation() {
    console.log("Configurando navegación...");
    
    // Referencias a formularios
    const step1Form = document.getElementById('step1-form');
    const step2Form = document.getElementById('step2-form');
    const step3Form = document.getElementById('step3-form');
    
    // Referencias a botones
    const nextStep1Button = document.getElementById('next-step1');
    const prevStep2Button = document.getElementById('prev-step2');
    const nextStep2Button = document.getElementById('next-step2');
    const prevStep3Button = document.getElementById('prev-step3');
    const submitFormButton = document.getElementById('submit-form');
    
    // Verificación de botones
    console.log("Botones de navegación:", {
        nextStep1Button: !!nextStep1Button,
        prevStep2Button: !!prevStep2Button,
        nextStep2Button: !!nextStep2Button,
        prevStep3Button: !!prevStep3Button,
        submitFormButton: !!submitFormButton
    });
    
    // Evento para botón "Siguiente" del paso 1
    if (nextStep1Button) {
        // Eliminamos todos los event listeners existentes
        nextStep1Button.replaceWith(nextStep1Button.cloneNode(true));
        // Obtenemos la referencia al nuevo botón clonado
        const newNextStep1Button = document.getElementById('next-step1');
        
        newNextStep1Button.addEventListener('click', function(e) {
            e.preventDefault();
            console.log("Botón siguiente paso 1 clickeado");
            if (validarPaso1()) {
                mostrarPaso(2);
                actualizarSeccionesSegunTipo();
            }
        });
    }
    
    // Evento para botón "Anterior" del paso 2
    if (prevStep2Button) {
        prevStep2Button.replaceWith(prevStep2Button.cloneNode(true));
        const newPrevStep2Button = document.getElementById('prev-step2');
        
        newPrevStep2Button.addEventListener('click', function(e) {
            e.preventDefault();
            console.log("Botón anterior paso 2 clickeado");
            mostrarPaso(1);
        });
    }
    
    // Evento para botón "Siguiente" del paso 2
    if (nextStep2Button) {
        nextStep2Button.replaceWith(nextStep2Button.cloneNode(true));
        const newNextStep2Button = document.getElementById('next-step2');
        
        newNextStep2Button.addEventListener('click', function(e) {
            e.preventDefault();
            console.log("Botón siguiente paso 2 clickeado");
            if (validarPaso2()) {
                mostrarPaso(3);
                generarResumen();
            }
        });
    }
    
    // Evento para botón "Anterior" del paso 3
    if (prevStep3Button) {
        prevStep3Button.replaceWith(prevStep3Button.cloneNode(true));
        const newPrevStep3Button = document.getElementById('prev-step3');
        
        newPrevStep3Button.addEventListener('click', function(e) {
            e.preventDefault();
            console.log("Botón anterior paso 3 clickeado");
            mostrarPaso(2);
        });
    }
    
    // Evento para botón "Enviar solicitud"
    if (submitFormButton) {
        submitFormButton.replaceWith(submitFormButton.cloneNode(true));
        const newSubmitFormButton = document.getElementById('submit-form');
        
        newSubmitFormButton.addEventListener('click', function(e) {
            e.preventDefault();
            console.log("Botón enviar solicitud clickeado");
            if (validarPaso3()) {
                enviarDatosAGoogleSheet();
            }
        });
    }
    
    console.log("Navegación configurada correctamente");
}

// Asegúrate de que solo usamos una función de mostrar paso
// Y reemplaza todas las llamadas a showStep() por mostrarPaso()
function mostrarPaso(paso) {
    console.log(`Mostrando paso ${paso}`);
    
    // Referencias a formularios
    const step1Form = document.getElementById('step1-form');
    const step2Form = document.getElementById('step2-form');
    const step3Form = document.getElementById('step3-form');
    
    // Referencias a indicadores
    const step1Indicator = document.getElementById('step1');
    const step2Indicator = document.getElementById('step2');
    const step3Indicator = document.getElementById('step3');
    
    // Ocultar todos los formularios
    [step1Form, step2Form, step3Form].forEach(form => {
        if (form) {
            form.classList.remove('active-form');
            form.classList.add('hidden-form');
        } else {
            console.error("Falta un formulario de paso");
        }
    });
    
    // Quitar clase "active" de todos los indicadores
    [step1Indicator, step2Indicator, step3Indicator].forEach(indicator => {
        if (indicator) {
            indicator.classList.remove('active');
        } else {
            console.error("Falta un indicador de paso");
        }
    });
    
    // Mostrar el formulario correspondiente al paso
    if (paso === 1) {
        if (step1Form) {
            step1Form.classList.add('active-form');
            step1Form.classList.remove('hidden-form');
        }
        if (step1Indicator) step1Indicator.classList.add('active');
    } else if (paso === 2) {
        if (step2Form) {
            step2Form.classList.add('active-form');
            step2Form.classList.remove('hidden-form');
        }
        if (step1Indicator) step1Indicator.classList.add('active');
        if (step2Indicator) step2Indicator.classList.add('active');
    } else if (paso === 3) {
        if (step3Form) {
            step3Form.classList.add('active-form');
            step3Form.classList.remove('hidden-form');
        }
        if (step1Indicator) step1Indicator.classList.add('active');
        if (step2Indicator) step2Indicator.classList.add('active');
        if (step3Indicator) step3Indicator.classList.add('active');
    }
    
    console.log(`Paso ${paso} mostrado correctamente`);
}