// Keep a natural breath group together. A gift can take the next group,
// without waiting for an entire long monologue or cutting a word in half.
export function speechSegments(text,max=180){
 const sentences=String(text).split(/(?<=[.!?])\s+/u),parts=[];let group='';
 for(let sentence of sentences){sentence=sentence.trim();if(!sentence)continue;if(group&&group.length+sentence.length+1>max){parts.push(group);group='';}group+=(group?' ':'')+sentence;}
 if(group)parts.push(group);return parts;
}
export function spokenViewerName(name){return String(name||'').normalize('NFKC').replace(/[\p{Extended_Pictographic}\uFE0F\u200D]/gu,'').replace(/[@_]+/g,' ').replace(/\d+/g,' ').replace(/[^\p{L}\p{M}\s'-]/gu,' ').replace(/\s+/g,' ').trim().slice(0,50)||'bạn';}
export function prepareSpokenText(text,values={}){
 let line=String(text);if(values.name)line=line.replaceAll(values.name,spokenViewerName(values.name));
 return line.replace(/[\p{Extended_Pictographic}\uFE0F\u200D]/gu,'').replace(/(?<=\d)[.,](?=\d{3}(?:\D|$))/g,'').replace(/\bcmt\b/gi,'bình luận').replace(/\bLIVE\b/g,'trực tiếp').replace(/\s+/g,' ').trim();
}
