export const simpleSanitize = (dirtyHtml: string): string => {
    // Supprime tous les scripts et iframes
    let cleaned = dirtyHtml.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '');
    cleaned = cleaned.replace(/<iframe[^>]*>[\s\S]*?<\/iframe>/gi, '');
  
    // Supprime tous les attributs dangereux (onclick, onerror, style, etc.)
    cleaned = cleaned.replace(/ on\w+="[^"]*"/gi, '');
    cleaned = cleaned.replace(/ style="[^"]*"/gi, '');
  
    // Garde uniquement certaines balises
    const allowedTags = ['h2', 'p', 'ul', 'li', 'span', 'strong', 'em', 'br'];
    cleaned = cleaned.replace(/<\/?([a-z][a-z0-9]*)\b[^>]*>/gi, (match, tag) => {
      return allowedTags.includes(tag.toLowerCase()) ? match : '';
    });
  
    return cleaned;
  };
  