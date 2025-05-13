// Tab Navigation Logic
const tabButtons = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

tabButtons.forEach(button => {
  button.addEventListener('click', () => {
    // Remove active class from all tabs
    tabButtons.forEach(btn => btn.classList.remove('active-tab', 'bg-indigo-100', 'text-indigo-700'));
    tabContents.forEach(content => content.classList.remove('active'));
    
    // Add active class to current tab
    button.classList.add('active-tab', 'bg-indigo-100', 'text-indigo-700');
    const contentId = 'content-' + button.id.split('-')[1];
    document.getElementById(contentId).classList.add('active');
  });
});

// Propositional Logic Functions
document.getElementById('generate-truth-table').addEventListener('click', generateTruthTable);

function generateTruthTable() {
  const expression = document.getElementById('logic-expression').value.trim();
  if (!expression) {
    alert('Please enter a logical expression.');
    return;
  }

  // Parse the expression to find unique variables
  const variables = findUniqueVariables(expression);
  if (variables.length === 0) {
    alert('No valid variables found. Please use p, q, r, s as variables.');
    return;
  }

  // Generate all possible combinations of truth values
  const combinations = generateCombinations(variables);
  
  // Evaluate the expression for each combination
  const results = combinations.map(combination => {
    const result = evaluateExpression(expression, combination);
    return { combination, result };
  });

  // Display the truth table
  displayTruthTable(variables, results);
}

function findUniqueVariables(expression) {
  const validVariables = ['p', 'q', 'r', 's'];
  const foundVariables = [];
  
  validVariables.forEach(variable => {
    if (expression.includes(variable) && !foundVariables.includes(variable)) {
      foundVariables.push(variable);
    }
  });
  
  return foundVariables;
}

function generateCombinations(variables) {
  const combinations = [];
  const numCombinations = Math.pow(2, variables.length);
  
  for (let i = 0; i < numCombinations; i++) {
    const combination = {};
    for (let j = 0; j < variables.length; j++) {
      // Use bit operations to generate all possible combinations
      combination[variables[j]] = (i & (1 << j)) !== 0;
    }
    combinations.push(combination);
  }
  
  return combinations;
}

function evaluateExpression(expression, assignment) {
  // Replace logical operators with JavaScript operators
  let jsExpression = expression
    .replace(/&&|∧/g, '&&')
    .replace(/\|\||∨/g, '||')
    .replace(/!|¬/g, '!')
    .replace(/<->|↔/g, '===')
    .replace(/->|→/g, '<=')
    .replace(/[pqrs]/g, match => assignment[match] ? 'true' : 'false');
  
  // Handle implication (a -> b is equivalent to !a || b)
  jsExpression = jsExpression.replace(/(true|false) <= (true|false)/g, (match, a, b) => {
    return a === 'true' && b === 'false' ? 'false' : 'true';
  });
  
  // Handle equivalence (a <-> b is true if a and b have the same value)
  jsExpression = jsExpression.replace(/(true|false) === (true|false)/g, (match, a, b) => {
    return a === b ? 'true' : 'false';
  });
  
  try {
    return eval(jsExpression);
  } catch (error) {
    console.error('Error evaluating expression:', error);
    return null;
  }
}

function displayTruthTable(variables, results) {
  const resultDiv = document.getElementById('truth-table-result');
  
  // Create table
  let tableHTML = '<table class="truth-table w-full"><thead><tr>';
  
  // Add headers for variables
  variables.forEach(variable => {
    tableHTML += `<th>${variable}</th>`;
  });
  
  // Add header for the expression
  tableHTML += `<th>${document.getElementById('logic-expression').value}</th>`;
  tableHTML += '</tr></thead><tbody>';
  
  // Add rows for each combination
  results.forEach(({ combination, result }) => {
    tableHTML += '<tr>';
    
    // Add cells for variable values
    variables.forEach(variable => {
      tableHTML += `<td>${combination[variable] ? 'T' : 'F'}</td>`;
    });
    
    // Add cell for the result
    tableHTML += `<td class="${result ? 'bg-green-100' : 'bg-red-100'}">${result ? 'T' : 'F'}</td>`;
    tableHTML += '</tr>';
  });
  
  tableHTML += '</tbody></table>';
  
  resultDiv.innerHTML = tableHTML;
}

// Set Operations Functions
document.getElementById('calculate-sets').addEventListener('click', calculateSetOperations);

function calculateSetOperations() {
  const setAInput = document.getElementById('set-a').value.trim();
  const setBInput = document.getElementById('set-b').value.trim();
  
  if (!setAInput || !setBInput) {
    alert('Please enter values for both sets.');
    return;
  }
  
  // Parse inputs into sets
  const setA = parseSet(setAInput);
  const setB = parseSet(setBInput);
  
  // Calculate operations
  const union = setUnion(setA, setB);
  const intersection = setIntersection(setA, setB);
  const aMinusB = setDifference(setA, setB);
  const bMinusA = setDifference(setB, setA);
  const symmetricDifference = setSymmetricDifference(setA, setB);
  
  // Display results
  document.getElementById('set-a-display').innerHTML = `<strong>Set A:</strong> {${Array.from(setA).join(', ')}}`;
  document.getElementById('set-b-display').innerHTML = `<strong>Set B:</strong> {${Array.from(setB).join(', ')}}`;
  document.getElementById('union-result').innerHTML = `<strong>Union (A ∪ B):</strong> {${Array.from(union).join(', ')}}`;
  document.getElementById('intersection-result').innerHTML = `<strong>Intersection (A ∩ B):</strong> {${Array.from(intersection).join(', ')}}`;
  document.getElementById('a-minus-b-result').innerHTML = `<strong>Difference (A - B):</strong> {${Array.from(aMinusB).join(', ')}}`;
  document.getElementById('b-minus-a-result').innerHTML = `<strong>Difference (B - A):</strong> {${Array.from(bMinusA).join(', ')}}`;
  document.getElementById('symmetric-difference-result').innerHTML = `<strong>Symmetric Difference (A △ B):</strong> {${Array.from(symmetricDifference).join(', ')}}`;
}

function parseSet(input) {
  return new Set(
    input.split(',')
      .map(item => item.trim())
      .filter(item => item !== "")
      .map(item => isNaN(item) ? item : Number(item))
  );
}

function setUnion(setA, setB) {
  return new Set([...setA, ...setB]);
}

function setIntersection(setA, setB) {
  return new Set([...setA].filter(x => setB.has(x)));
}

function setDifference(setA, setB) {
  return new Set([...setA].filter(x => !setB.has(x)));
}

function setSymmetricDifference(setA, setB) {
  return new Set(
    [...setA].filter(x => !setB.has(x)).concat([...setB].filter(x => !setA.has(x)))
  );
}

// Predicate Logic Functions
document.getElementById('predicate-select').addEventListener('change', togglePredicateParams);
document.getElementById('evaluate-predicate').addEventListener('click', evaluatePredicate);

function togglePredicateParams() {
  const selected = document.getElementById('predicate-select').value;
  const paramContainer = document.getElementById('predicate-param-container');
  const paramLabel = document.getElementById('predicate-param-label');
  
  if (selected === 'divisible') {
    paramLabel.textContent = 'Divisible by:';
    paramContainer.classList.remove('hidden');
  } else if (selected === 'greater') {
    paramLabel.textContent = 'Greater than:';
    paramContainer.classList.remove('hidden');
  } else if (selected === 'less') {
    paramLabel.textContent = 'Less than:';
    paramContainer.classList.remove('hidden');
  } else {
    paramContainer.classList.add('hidden');
  }
}

function evaluatePredicate() {
  const domainInput = document.getElementById('domain-input').value.trim();
  if (!domainInput) {
    alert('Please enter a domain.');
    return;
  }
  
  // Parse domain
  const domain = domainInput.split(',')
    .map(item => item.trim())
    .filter(item => item !== "" && !isNaN(item))
    .map(Number);
  
  if (domain.length === 0) {
    alert('Please enter a valid domain with at least one number.');
    return;
  }
  
  const predicateType = document.getElementById('predicate-select').value;
  const quantifierType = document.getElementById('quantifier-select').value;
  let param = 0;
  
  if (['divisible', 'greater', 'less'].includes(predicateType)) {
    param = parseInt(document.getElementById('predicate-param').value);
  }
  
  // Evaluate predicate for each element in the domain
  const results = domain.map(x => {
    let predicateResult = false;
    
    switch(predicateType) {
      case 'even':
        predicateResult = x % 2 === 0;
        break;
      case 'odd':
        predicateResult = x % 2 !== 0;
        break;
      case 'prime':
        predicateResult = isPrime(x);
        break;
      case 'divisible':
        predicateResult = x % param === 0;
        break;
      case 'greater':
        predicateResult = x > param;
        break;
      case 'less':
        predicateResult = x < param;
        break;
    }
    
    return { x, result: predicateResult };
  });
  
  // Evaluate quantifier
  let quantifierResult = false;
  const satisfyingElements = results.filter(r => r.result).map(r => r.x);
  const failingElements = results.filter(r => !r.result).map(r => r.x);
  
  if (quantifierType === 'universal') {
    quantifierResult = results.every(r => r.result);
  } else { // existential
    quantifierResult = results.some(r => r.result);
  }
  
  // Display results
  displayPredicateResults(predicateType, param, quantifierType, domain, satisfyingElements, failingElements, quantifierResult);
}

function isPrime(num) {
  if (num <= 1) return false;
  if (num <= 3) return true;
  if (num % 2 === 0 || num % 3 === 0) return false;
  
  for (let i = 5; i * i <= num; i += 6) {
    if (num % i === 0 || num % (i + 2) === 0) return false;
  }
  
  return true;
}

function displayPredicateResults(predicateType, param, quantifierType, domain, satisfyingElements, failingElements, quantifierResult) {
  const resultDiv = document.getElementById('predicate-result');
  
  // Format predicate string
  let predicateStr = '';
  switch(predicateType) {
    case 'even':
      predicateStr = 'P(x): x is even';
      break;
    case 'odd':
      predicateStr = 'P(x): x is odd';
      break;
    case 'prime':
      predicateStr = 'P(x): x is prime';
      break;
    case 'divisible':
      predicateStr = `P(x): x is divisible by ${param}`;
      break;
    case 'greater':
      predicateStr = `P(x): x is greater than ${param}`;
      break;
    case 'less':
      predicateStr = `P(x): x is less than ${param}`;
      break;
  }
  
  // Format quantifier string
  let quantifierStr = quantifierType === 'universal' ? 
    '∀x P(x): For all x in domain, P(x) is true' :
    '∃x P(x): There exists at least one x in domain such that P(x) is true';
  
  // Create HTML
  let html = `
    <div class="p-4 border rounded ${quantifierResult ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}">
      <p class="font-medium">${quantifierStr}</p>
      <p class="mb-2">Where ${predicateStr}</p>
      <p class="mb-1">Domain D = {${domain.join(', ')}}</p>
      <p class="mb-3">Result: <span class="font-bold">${quantifierResult ? 'TRUE' : 'FALSE'}</span></p>
      
      <div class="mt-4">
        <p class="mb-2">Elements satisfying P(x): 
          <span class="text-green-600">{${satisfyingElements.length ? satisfyingElements.join(', ') : '∅'}}</span>
        </p>
        <p>Elements NOT satisfying P(x): 
          <span class="text-red-600">{${failingElements.length ? failingElements.join(', ') : '∅'}}</span>
        </p>
      </div>
    </div>
  `;
  
  resultDiv.innerHTML = html;
}

// Relations Functions
document.getElementById('relation-type').addEventListener('change', toggleCustomRelation);
document.getElementById('analyze-relation').addEventListener('click', analyzeRelation);

function toggleCustomRelation() {
  const selected = document.getElementById('relation-type').value;
  const customContainer = document.getElementById('custom-relation-container');
  
  if (selected === 'custom') {
    customContainer.classList.remove('hidden');
  } else {
    customContainer.classList.add('hidden');
  }
}

function analyzeRelation() {
  const setInput = document.getElementById('relation-set').value.trim();
  if (!setInput) {
    alert('Please enter elements for the set.');
    return;
  }
  
  // Parse set
  const set = parseSet(setInput);
  const setArray = Array.from(set);
  
  // Get relation type
  const relationType = document.getElementById('relation-type').value;
  
  // Generate relation pairs
  let relationPairs = [];
  
  if (relationType === 'custom') {
    const customInput = document.getElementById('custom-relation').value.trim();
    if (!customInput) {
      alert('Please enter ordered pairs for your custom relation.');
      return;
    }
    
    relationPairs = parseCustomRelation(customInput, setArray);
  } else {
    relationPairs = generateRelationPairs(setArray, relationType);
  }
  
  // Create relation matrix
  const relationMatrix = createRelationMatrix(setArray, relationPairs);
  
  // Check relation properties
  const isReflexive = checkReflexive(setArray, relationPairs);
  const isIrreflexive = checkIrreflexive(setArray, relationPairs);
  const isSymmetric = checkSymmetric(relationPairs);
  const isAsymmetric = checkAsymmetric(relationPairs);
  const isAntisymmetric = checkAntisymmetric(relationPairs);
  const isTransitive = checkTransitive(relationPairs);
  
  // Determine if it's an equivalence relation
  const isEquivalence = isReflexive && isSymmetric && isTransitive;
  
  // Determine if it's a partial order
  const isPartialOrder = isReflexive && isAntisymmetric && isTransitive;
  
  // Display results
  displayRelationResults(
    setArray, 
    relationPairs, 
    relationMatrix, 
    {
      isReflexive,
      isIrreflexive,
      isSymmetric,
      isAsymmetric,
      isAntisymmetric,
      isTransitive,
      isEquivalence,
      isPartialOrder
    }
  );
}

function parseCustomRelation(input, set) {
  // Extract pairs from format like (1,2), (2,3)
  const pairsRegex = /\(\s*([^,]+)\s*,\s*([^)]+)\s*\)/g;
  const pairs = [];
  let match;
  
  while (match = pairsRegex.exec(input)) {
    const a = isNaN(match[1]) ? match[1].trim() : Number(match[1].trim());
    const b = isNaN(match[2]) ? match[2].trim() : Number(match[2].trim());
    
    // Check if elements are in the set
    if (set.some(item => item === a) && set.some(item => item === b)) {
      pairs.push([a, b]);
    }
  }
  
  return pairs;
}

function generateRelationPairs(set, relationType) {
  const pairs = [];
  
  for (let a of set) {
    for (let b of set) {
      let related = false;
      
      switch(relationType) {
        case 'less':
          related = a < b;
          break;
        case 'less-equal':
          related = a <= b;
          break;
        case 'equal':
          related = a === b;
          break;
        case 'greater':
          related = a > b;
          break;
        case 'greater-equal':
          related = a >= b;
          break;
        case 'divisibility':
          // Check if a divides b (b % a === 0)
          related = a !== 0 && b % a === 0;
          break;
      }
      
      if (related) {
        pairs.push([a, b]);
      }
    }
  }
  
  return pairs;
}

function createRelationMatrix(set, relationPairs) {
  const matrix = [];
  
  for (let i = 0; i < set.length; i++) {
    matrix[i] = [];
    for (let j = 0; j < set.length; j++) {
      // Check if the pair exists in relationPairs
      matrix[i][j] = relationPairs.some(pair => pair[0] === set[i] && pair[1] === set[j]);
    }
  }
  
  return matrix;
}

function checkReflexive(set, relationPairs) {
  // For all a in set, (a,a) must be in the relation
  return set.every(a => relationPairs.some(pair => pair[0] === a && pair[1] === a));
}

function checkIrreflexive(set, relationPairs) {
  // For all a in set, (a,a) must NOT be in the relation
  return set.every(a => !relationPairs.some(pair => pair[0] === a && pair[1] === a));
}

function checkSymmetric(relationPairs) {
  // For all (a,b) in relation, (b,a) must also be in the relation
  return relationPairs.every(pair => 
    relationPairs.some(otherPair => 
      otherPair[0] === pair[1] && otherPair[1] === pair[0]
    )
  );
}

function checkAsymmetric(relationPairs) {
  // For all (a,b) in relation where a ≠ b, (b,a) must NOT be in the relation
  return relationPairs.every(pair => 
    pair[0] === pair[1] || !relationPairs.some(otherPair => 
      otherPair[0] === pair[1] && otherPair[1] === pair[0]
    )
  );
}

function checkAntisymmetric(relationPairs) {
  // For all (a,b) in relation, if (b,a) is also in relation, then a = b
  for (let [a, b] of relationPairs) {
    if (a !== b) {
      // If (a,b) exists and (b,a) exists, relation is not antisymmetric
      const hasBothDirections = relationPairs.some(pair => 
        pair[0] === b && pair[1] === a
      );
      
      if (hasBothDirections) {
        return false;
      }
    }
  }
  return true;
}

function checkTransitive(relationPairs) {
  // For all a,b,c if (a,b) and (b,c) are in relation, then (a,c) must be in relation
  for (let [a, b] of relationPairs) {
    const cPairs = relationPairs.filter(pair => pair[0] === b);
    
    for (let [_, c] of cPairs) {
      // Check if (a,c) exists in the relation
      const hasAC = relationPairs.some(pair => 
        pair[0] === a && pair[1] === c
      );
      
      if (!hasAC) {
        return false;
      }
    }
  }
  return true;
}

function displayRelationResults(set, relationPairs, relationMatrix, properties) {
  const resultDiv = document.getElementById('relation-result');
  
  // Format relation as a set
  const relationStr = relationPairs.map(pair => `(${pair[0]}, ${pair[1]})`).join(', ');
  
  // Create HTML
  let html = `
    <div class="p-4 border rounded bg-gray-50">
      <p class="font-medium mb-2">Set A = {${set.join(', ')}}</p>
      <p class="mb-3">Relation R = {${relationStr}}</p>
      
      <div class="overflow-x-auto">
        <h3 class="font-medium mb-2">Relation Matrix:</h3>
        <table class="relation-matrix mb-4">
          <tr>
            <td class="bg-gray-200"></td>
            ${set.map(item => `<td class="bg-gray-200 font-medium">${item}</td>`).join('')}
          </tr>
          ${relationMatrix.map((row, i) => `
            <tr>
              <td class="bg-gray-200 font-medium">${set[i]}</td>
              ${row.map(cell => `
                <td class="${cell ? 'bg-green-100' : 'bg-red-100'}">${cell ? '1' : '0'}</td>
              `).join('')}
            </tr>
          `).join('')}
        </table>
      </div>
      
      <h3 class="font-medium mb-2">Relation Properties:</h3>
      <ul class="space-y-1">
        <li>Reflexive: <span class="${properties.isReflexive ? 'text-green-600' : 'text-red-600'}">${properties.isReflexive ? 'Yes' : 'No'}</span></li>
        <li>Irreflexive: <span class="${properties.isIrreflexive ? 'text-green-600' : 'text-red-600'}">${properties.isIrreflexive ? 'Yes' : 'No'}</span></li>
        <li>Symmetric: <span class="${properties.isSymmetric ? 'text-green-600' : 'text-red-600'}">${properties.isSymmetric ? 'Yes' : 'No'}</span></li>
        <li>Asymmetric: <span class="${properties.isAsymmetric ? 'text-green-600' : 'text-red-600'}">${properties.isAsymmetric ? 'Yes' : 'No'}</span></li>
        <li>Antisymmetric: <span class="${properties.isAntisymmetric ? 'text-green-600' : 'text-red-600'}">${properties.isAntisymmetric ? 'Yes' : 'No'}</span></li>
        <li>Transitive: <span class="${properties.isTransitive ? 'text-green-600' : 'text-red-600'}">${properties.isTransitive ? 'Yes' : 'No'}</span></li>
      </ul>
      
      <div class="mt-4">
        <p class="font-medium">Special Relation Types:</p>
        <ul class="space-y-1">
          <li>Equivalence Relation: <span class="${properties.isEquivalence ? 'text-green-600 font-medium' : 'text-red-600'}">${properties.isEquivalence ? 'Yes' : 'No'}</span>
            ${properties.isEquivalence ? '' : '<span class="text-sm text-gray-600"> (requires reflexive, symmetric, and transitive)</span>'}
          </li>
          <li>Partial Order: <span class="${properties.isPartialOrder ? 'text-green-600 font-medium' : 'text-red-600'}">${properties.isPartialOrder ? 'Yes' : 'No'}</span>
            ${properties.isPartialOrder ? '' : '<span class="text-sm text-gray-600"> (requires reflexive, antisymmetric, and transitive)</span>'}
          </li>
        </ul>
      </div>
    </div>
  `;
  
  resultDiv.innerHTML = html;
}