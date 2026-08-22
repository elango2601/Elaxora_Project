const fs = require('fs');
const path = require('path');

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function camelCaseToWords(s) {
  const result = s.replace(/([A-Z])/g, ' $1');
  return capitalizeFirstLetter(result.trim());
}

function processTag(match) {
  // Check if it already has a placeholder
  if (match.includes('placeholder=')) {
    return match; // already has one
  }

  // Determine if we should skip
  const typeMatch = match.match(/type=(?:'|")([^'"]+)(?:'|")/);
  if (typeMatch) {
    const t = typeMatch[1].toLowerCase();
    if (['checkbox', 'radio', 'date', 'file', 'hidden', 'submit', 'reset', 'button'].includes(t)) {
      return match;
    }
  }

  let fieldName = '';

  // Try to find value={varName}
  const valMatch = match.match(/value=\{([a-zA-Z0-9_]+)\}/);
  if (valMatch && valMatch[1] !== 'undefined' && valMatch[1] !== 'null') {
    fieldName = valMatch[1];
  } else {
    // Try id
    const idMatch = match.match(/id=(?:'|")([^'"]+)(?:'|")/);
    if (idMatch) {
      fieldName = idMatch[1];
    } else {
      // Try name
      const nameMatch = match.match(/name=(?:'|")([^'"]+)(?:'|")/);
      if (nameMatch) fieldName = nameMatch[1];
    }
  }

  if (fieldName) {
    // some mapping
    if (fieldName === 'prefTech') fieldName = 'Preferred Technology';
    if (fieldName === 'whatsapp' || fieldName === 'mobileNumber' || fieldName === 'mobile') fieldName = 'Mobile Number';
    if (fieldName === 'stateLocation') fieldName = 'State';
    if (fieldName === 'short_description') fieldName = 'Short Description';
    
    // convert camel case / snake case to words
    fieldName = fieldName.replace(/_/g, ' ');
    let words = camelCaseToWords(fieldName);
    
    // Replace <input with <input placeholder="Enter Words"
    // Handle both <input and <textarea
    if (match.startsWith('<input')) {
       return match.replace('<input', `<input placeholder="Enter ${words}"`);
    } else if (match.startsWith('<textarea')) {
       return match.replace('<textarea', `<textarea placeholder="Enter ${words}"`);
    }
  }

  return match;
}

const dir = path.join(__dirname, 'src');

function walk(dir) {
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const full = path.join(dir, file);
    if (fs.statSync(full).isDirectory()) {
      walk(full);
    } else if (full.endsWith('.tsx') || full.endsWith('.jsx')) {
      let content = fs.readFileSync(full, 'utf8');
      
      // Regex to match <input ... > and <textarea ... >
      // Note: we want to match across newlines!
      content = content.replace(/<input\b[^>]*>/g, processTag);
      content = content.replace(/<textarea\b[^>]*>/g, processTag);
      
      fs.writeFileSync(full, content, 'utf8');
    }
  }
}

walk(dir);
console.log('Placeholders added.');
