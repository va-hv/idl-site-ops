const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'app', 'page.tsx');
if (!fs.existsSync(filePath)) {
  console.error('app/page.tsx not found!');
  process.exit(1);
}

let content = fs.readFileSync(filePath, 'utf8');

const oldFilter = `  const filteredModules = INITIAL_MODULES.filter((m) => {
    const matchesSearch = m.title.toLowerCase().includes(searchQuery.toLowerCase()) || m.description.toLowerCase().includes(searchQuery.toLowerCase())
    if (selectedCategory === 'ALL') return matchesSearch
    return matchesSearch && m.category.toLowerCase().includes(selectedCategory.toLowerCase().split(' ')[0])
  })`;

const newFilter = `  const filteredModules = INITIAL_MODULES.filter((m) => {
    const matchesSearch = m.title.toLowerCase().includes(searchQuery.toLowerCase()) || m.description.toLowerCase().includes(searchQuery.toLowerCase())
    if (selectedCategory === 'ALL') return matchesSearch
    
    const catLower = m.category.toLowerCase()
    const selectedLower = selectedCategory.toLowerCase()
    
    if (selectedLower.includes('workforce') || selectedLower.includes('hr')) {
      return matchesSearch && (catLower.includes('workforce') || catLower.includes('hr') || catLower.includes('people') || catLower.includes('labor') || catLower.includes('engagement') || catLower.includes('learning'))
    }
    if (selectedLower.includes('safety') || selectedLower.includes('compliance')) {
      return matchesSearch && (catLower.includes('safety') || catLower.includes('whs') || catLower.includes('compliance') || catLower.includes('quality') || catLower.includes('security'))
    }
    if (selectedLower.includes('engineering') || selectedLower.includes('maintenance')) {
      return matchesSearch && (catLower.includes('engineering') || catLower.includes('maintenance') || catLower.includes('rme') || catLower.includes('facilities') || catLower.includes('it'))
    }
    if (selectedLower.includes('operations') || selectedLower.includes('intelligence')) {
      return matchesSearch && (catLower.includes('operations') || catLower.includes('excellence') || catLower.includes('reporting') || catLower.includes('admin') || catLower.includes('procurement') || catLower.includes('document'))
    }
    return matchesSearch && catLower.includes(selectedLower.split(' ')[0])
  })`;

if (content.includes(oldFilter)) {
  content = content.replace(oldFilter, newFilter);
  fs.writeFileSync(filePath, content, 'utf8');
  console.log('✅ Successfully updated app/page.tsx filter logic!');
} else {
  console.log('⚠️ Could not find exact filter snippet. Please verify app/page.tsx.');
}
