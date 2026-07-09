const fs = require('fs');
let code = fs.readFileSync('src/pages/app/Billing.tsx', 'utf8');

code = code.replace(/import\s*\{\s*Button\s*\}\s*from\s*['"]..\/..\/components\/ui\/Button['"];/, "import { Button } from '../../components/ui/Button';\nimport { cn } from '../../lib/cn';");

code = code.replace(/invoices\.length === 0/g, '!invoices || invoices.length === 0');
code = code.replace(/data=\{invoices\}/g, 'data={invoices || []}');
code = code.replace(/render:\s*\(row\)\s*=>/g, 'render: (row: any) =>');
code = code.replace(/setSelectedInvoice\(row.id\)/g, 'setSelectedInvoice(row.id as any)');

fs.writeFileSync('src/pages/app/Billing.tsx', code);
console.log('Fixed Billing.tsx');
