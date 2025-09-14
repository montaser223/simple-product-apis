export const sanitizeLLMResponse =(content: string): string=>{
    if (!content || typeof content !== 'string') {
        return '';
      }
  
      // Remove markdown code blocks
      let cleaned = content.replace(/```json\s*/g, '').replace(/```\s*/g, '');
      
      // Remove extra whitespace and newlines
      cleaned = cleaned.replace(/\s+/g, ' ').trim();
      
      // Remove potential HTML tags
      cleaned = cleaned.replace(/<[^>]*>/g, '');
      
      // Remove control characters except newlines and tabs
      cleaned = cleaned.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');
      
      // Remove excessive punctuation
      cleaned = cleaned.replace(/[.]{3,}/g, '...');
      cleaned = cleaned.replace(/[!]{2,}/g, '!');
      cleaned = cleaned.replace(/[?]{2,}/g, '?');
      
      return cleaned;
}
