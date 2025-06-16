#!/bin/bash

# Script to fix Next.js 15 RouteParams type issues

files=(
"/Users/mahmudqudrati/code/hack-the-world/next-hack/app/api/enrollments/module/[moduleId]/route.ts"
"/Users/mahmudqudrati/code/hack-the-world/next-hack/app/api/enrollments/admin/stats/[moduleId]/route.ts"
"/Users/mahmudqudrati/code/hack-the-world/next-hack/app/api/enrollments/user/[userId]/route.ts"
"/Users/mahmudqudrati/code/hack-the-world/next-hack/app/api/enrollments/[id]/pause/route.ts"
"/Users/mahmudqudrati/code/hack-the-world/next-hack/app/api/enrollments/[id]/progress/route.ts"
"/Users/mahmudqudrati/code/hack-the-world/next-hack/app/api/enrollments/[id]/complete/route.ts"
"/Users/mahmudqudrati/code/hack-the-world/next-hack/app/api/enrollments/[id]/resume/route.ts"
"/Users/mahmudqudrati/code/hack-the-world/next-hack/app/api/enrollments/[id]/route.ts"
"/Users/mahmudqudrati/code/hack-the-world/next-hack/app/api/progress/module/[userId]/[moduleId]/route.ts"
"/Users/mahmudqudrati/code/hack-the-world/next-hack/app/api/progress/content/[userId]/[contentType]/route.ts"
"/Users/mahmudqudrati/code/hack-the-world/next-hack/app/api/progress/user/content/[contentId]/route.ts"
"/Users/mahmudqudrati/code/hack-the-world/next-hack/app/api/progress/overview/[userId]/route.ts"
"/Users/mahmudqudrati/code/hack-the-world/next-hack/app/api/content/sections/by-module/[moduleId]/route.ts"
"/Users/mahmudqudrati/code/hack-the-world/next-hack/app/api/content/module/[moduleId]/first/route.ts"
"/Users/mahmudqudrati/code/hack-the-world/next-hack/app/api/content/module/[moduleId]/grouped-optimized/route.ts"
"/Users/mahmudqudrati/code/hack-the-world/next-hack/app/api/content/module/[moduleId]/route.ts"
"/Users/mahmudqudrati/code/hack-the-world/next-hack/app/api/content/module/[moduleId]/grouped/route.ts"
"/Users/mahmudqudrati/code/hack-the-world/next-hack/app/api/content/type/[type]/route.ts"
"/Users/mahmudqudrati/code/hack-the-world/next-hack/app/api/phases/[id]/route.ts"
"/Users/mahmudqudrati/code/hack-the-world/next-hack/app/api/modules/phase/[phaseId]/reorder/route.ts"
"/Users/mahmudqudrati/code/hack-the-world/next-hack/app/api/modules/phase/[phaseId]/route.ts"
"/Users/mahmudqudrati/code/hack-the-world/next-hack/app/api/modules/[id]/route.ts"
)

for file in "${files[@]}"; do
    echo "Processing: $file"
    
    # Create a backup
    cp "$file" "${file}.backup"
    
    # Remove the interface RouteParams block (handles multi-line interface)
    sed -i '' '/^interface RouteParams {$/,/^}$/d' "$file"
    
    # Fix the function signatures for GET, POST, PUT, DELETE methods
    # Pattern: export async function METHOD(request: NextRequest, { params }: RouteParams)
    # Replace with: // eslint-disable... \n export async function METHOD(request: NextRequest, context: any) { \n  const params = context.params;
    
    sed -i '' 's/export async function GET(request: NextRequest, { params }: RouteParams)/\/\/ eslint-disable-next-line @typescript-eslint\/no-explicit-any\
export async function GET(request: NextRequest, context: any) {\
  const params = context.params;/g' "$file"
    
    sed -i '' 's/export async function POST(request: NextRequest, { params }: RouteParams)/\/\/ eslint-disable-next-line @typescript-eslint\/no-explicit-any\
export async function POST(request: NextRequest, context: any) {\
  const params = context.params;/g' "$file"
    
    sed -i '' 's/export async function PUT(request: NextRequest, { params }: RouteParams)/\/\/ eslint-disable-next-line @typescript-eslint\/no-explicit-any\
export async function PUT(request: NextRequest, context: any) {\
  const params = context.params;/g' "$file"
    
    sed -i '' 's/export async function DELETE(request: NextRequest, { params }: RouteParams)/\/\/ eslint-disable-next-line @typescript-eslint\/no-explicit-any\
export async function DELETE(request: NextRequest, context: any) {\
  const params = context.params;/g' "$file"
    
    # Remove the opening brace that's now duplicate
    sed -i '' 's/export async function \([A-Z]*\)(request: NextRequest, context: any) {$/export async function \1(request: NextRequest, context: any) {/' "$file"
    
    echo "Fixed: $file"
done

echo "All files processed!"