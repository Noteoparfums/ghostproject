const fs = require('fs');
const files = [
  'src/components/system/ErrorBoundary.tsx',
  'src/components/ui/Accordion.tsx',
  'src/components/ui/Badge.tsx',
  'src/components/ui/DataTable.tsx',
  'src/components/ui/EmptyState.tsx',
  'src/components/ui/Modal.tsx',
  'src/components/ui/Skeleton.tsx',
  'src/contexts/BillingContext.tsx',
  'src/contexts/ConsentContext.tsx',
  'src/contexts/ThemeContext.tsx',
  'src/contexts/ToastContext.tsx',
  'src/hooks/useGenerationStream.ts',
  'src/pages/app/BrandVoices.tsx',
  'src/pages/app/Projects.tsx',
  'src/pages/app/Settings.tsx',
  'src/pages/auth/Signup.tsx',
  'src/pages/auth/VerifyEmail.tsx',
  'src/pages/marketing/Landing.tsx',
  'src/pages/marketing/Pricing.tsx'
];

files.forEach(f => {
  if (!fs.existsSync(f)) return;
  let code = fs.readFileSync(f, 'utf8');
  
  // Fix ReactNode duplicates and ensure it's a type import
  code = code.replace(/import type \{ ReactNode \} from "react";\n/g, '');
  code = code.replace(/import\s*\{(.*?)ReactNode(.*?)\}\s*from\s*['"]react['"];/g, (match, p1, p2) => {
    const rest = (p1 + p2).replace(/,\s*,/g, ',').replace(/^\s*,|,\s*$/g, '');
    if (rest.trim() === '') {
      return `import type { ReactNode } from 'react';`;
    }
    return `import { ${rest} } from 'react';\nimport type { ReactNode } from 'react';`;
  });

  // Fix ErrorInfo
  code = code.replace(/import\s*\{(.*?)ErrorInfo(.*?)\}\s*from\s*['"]react['"];/g, (match, p1, p2) => {
    const rest = (p1 + p2).replace(/,\s*,/g, ',').replace(/^\s*,|,\s*$/g, '');
    return `import { ${rest} } from 'react';\nimport type { ErrorInfo } from 'react';`;
  });

  // Fix HTMLAttributes
  code = code.replace(/import\s*\{(.*?)HTMLAttributes(.*?)\}\s*from\s*['"]react['"];/g, (match, p1, p2) => {
    const rest = (p1 + p2).replace(/,\s*,/g, ',').replace(/^\s*,|,\s*$/g, '');
    return `import { ${rest} } from 'react';\nimport type { HTMLAttributes } from 'react';`;
  });

  // Fix framer-motion Variants in Modal.tsx
  if (f.includes('Modal.tsx')) {
    code = code.replace(/transition:\s*\{[^}]*duration[^}]*\}/g, 'transition: { duration: 0.2 } as any');
    code = code.replace(/transition:\s*\{[^}]*type[^}]*damping[^}]*\}/g, 'transition: { type: "spring", damping: 25, stiffness: 300 } as any');
  }

  // Fix BrandVoices imports
  if (f.includes('BrandVoices.tsx')) {
    code = code.replace(/import\s*\{\s*BrandVoice(.*?)\}\s*from\s*['"]@ghostwriter\/shared['"];/g, `import type { BrandVoice } from '@ghostwriter/shared';`);
  }

  // Fix Projects imports
  if (f.includes('Projects.tsx')) {
    code = code.replace(/import\s*\{\s*Project(.*?)\}\s*from\s*['"]@ghostwriter\/shared['"];/g, `import type { Project } from '@ghostwriter/shared';`);
  }

  fs.writeFileSync(f, code);
});
console.log('Fixed types');
