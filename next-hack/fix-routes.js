const fs = require('fs');
const path = require('path');

const files = [
  '/Users/mahmudqudrati/code/hack-the-world/next-hack/app/api/content/sections/by-module/[moduleId]/route.ts',
  '/Users/mahmudqudrati/code/hack-the-world/next-hack/app/api/content/type/[type]/route.ts',
  '/Users/mahmudqudrati/code/hack-the-world/next-hack/app/api/enrollments/module/[moduleId]/route.ts',
  '/Users/mahmudqudrati/code/hack-the-world/next-hack/app/api/enrollments/admin/stats/[moduleId]/route.ts',
  '/Users/mahmudqudrati/code/hack-the-world/next-hack/app/api/enrollments/user/[userId]/route.ts',
  '/Users/mahmudqudrati/code/hack-the-world/next-hack/app/api/enrollments/[id]/pause/route.ts',
  '/Users/mahmudqudrati/code/hack-the-world/next-hack/app/api/enrollments/[id]/progress/route.ts',
  '/Users/mahmudqudrati/code/hack-the-world/next-hack/app/api/enrollments/[id]/complete/route.ts',
  '/Users/mahmudqudrati/code/hack-the-world/next-hack/app/api/enrollments/[id]/resume/route.ts',
  '/Users/mahmudqudrati/code/hack-the-world/next-hack/app/api/enrollments/[id]/route.ts',
  '/Users/mahmudqudrati/code/hack-the-world/next-hack/app/api/progress/module/[userId]/[moduleId]/route.ts',
  '/Users/mahmudqudrati/code/hack-the-world/next-hack/app/api/progress/content/[userId]/[contentType]/route.ts',
  '/Users/mahmudqudrati/code/hack-the-world/next-hack/app/api/progress/user/content/[contentId]/route.ts',
  '/Users/mahmudqudrati/code/hack-the-world/next-hack/app/api/progress/overview/[userId]/route.ts',
  '/Users/mahmudqudrati/code/hack-the-world/next-hack/app/api/phases/[id]/route.ts',
  '/Users/mahmudqudrati/code/hack-the-world/next-hack/app/api/modules/phase/[phaseId]/reorder/route.ts',
  '/Users/mahmudqudrati/code/hack-the-world/next-hack/app/api/modules/phase/[phaseId]/route.ts',
  '/Users/mahmudqudrati/code/hack-the-world/next-hack/app/api/modules/[id]/route.ts'
];

files.forEach(filePath => {
  try {
    console.log(`Processing: ${filePath}`);
    
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Remove the interface RouteParams block
    content = content.replace(/interface RouteParams \{[\s\S]*?\n\}\n\n/g, '');
    content = content.replace(/interface RouteParams \{[\s\S]*?\n\}\n/g, '');
    
    // Fix function signatures
    content = content.replace(
      /export async function (GET|POST|PUT|DELETE)\(request: NextRequest, \{ params \}: RouteParams\) \{/g,
      '// eslint-disable-next-line @typescript-eslint/no-explicit-any\nexport async function $1(request: NextRequest, context: any) {\n  const params = context.params;'
    );
    
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Fixed: ${filePath}`);
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error.message);
  }
});

console.log('All files processed!');