

/**
 * Formatea una fecha en formato YYYY-MM-DD, con opción de usar hora local o UTC
 * @param {string|number|Date} fecha - Fecha a formatear (default: fecha actual)
 * @param {boolean} useLocalTime - Si es true, usa la hora local en lugar de UTC (default: false)
 * @returns {string} Fecha formateada como YYYY-MM-DD
 */
export function translateDate(fecha = Date.now(), useLocalTime = true) {
    // Para entradas tipo string, normalizar a mediodía UTC para evitar problemas con zonas horarias
    const normalizedFecha = typeof fecha === 'string' ? fecha + 'T12:00:00Z' : fecha;
    
    // Crear objeto Date a partir del parámetro normalizado
    const date = normalizedFecha instanceof Date ? new Date(normalizedFecha) : new Date(normalizedFecha);
    
    // Verificar si la fecha es válida
    if (isNaN(date.getTime())) {
      console.error('Fecha inválida:', fecha);
      return '';
    }
    
    // Obtener componentes de fecha según zona horaria elegida
    const year = useLocalTime ? date.getFullYear() : date.getUTCFullYear();
    const month = useLocalTime ? date.getMonth() + 1 : date.getUTCMonth() + 1;
    const day = useLocalTime ? date.getDate() : date.getUTCDate();
    
    // Formatear con padStart para añadir ceros a la izquierda
    const formattedMonth = String(month).padStart(2, '0');
    const formattedDay = String(day).padStart(2, '0');
    
    // Retornar la fecha formateada
    return `${year}-${formattedMonth}-${formattedDay}`;
  }
  /*
  // Ejemplos de uso:
  console.log('Fecha actual (UTC):', translateDate()); // Por defecto usa UTC
  console.log('Fecha actual (local):', translateDate(undefined, true));
  console.log('Fecha específica (UTC):', translateDate('2025-04-12'));
  console.log('Fecha específica (local):', translateDate('2025-04-12', true));


  export function translateDate(fecha = Date.now()) {
    
    //let date = new Date(fecha + 'T12:00:00Z')
    //const date = new Date(fecha); // CORREGIDO
    const date = new Date(typeof fecha === 'string' ? fecha + 'T12:00:00Z' : fecha);
    
    //const year = date.getFullYear();
    //const month = String(date.getMonth() + 1).padStart(2, '0'); // Siempre 2 dígitos
    //const day = String(date.getDate()).padStart(2, '0');        // Siempre 2 dígitos

    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, '0'); 
    const day = String(date.getUTCDate()).padStart(2, '0'); 
    
    console.log(`${year}-${month}-${day}`);
    return `${year}-${month}-${day}`;
    
   
};
*/
