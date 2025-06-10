/**
 * Formata uma data para exibição
 * @param {string|Date} date - Data a ser formatada
 * @returns {string} Data formatada
 */
export const formatDate = (date) => {
  const options = { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  };
  
  return new Date(date).toLocaleDateString('pt-BR', options);
};

