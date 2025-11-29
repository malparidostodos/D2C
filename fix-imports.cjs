const fs = require('fs');
const path = require('path');

const fixes = [
    // main.jsx
    { file: 'src/main.jsx', from: "import ErrorBoundary from './components/ErrorBoundary'", to: "import ErrorBoundary from './components/layout/ErrorBoundary'" },

    // Header.jsx  
    { file: 'src/components/layout/Header.jsx', from: "import { supabase } from '../lib/supabase'", to: "import { supabase } from '../../lib/supabase'" },

    // Collaboration.jsx
    { file: 'src/components/Collaboration.jsx', from: "import AnimatedButton from './AnimatedButton'", to: "import AnimatedButton from './ui/AnimatedButton'" },

    // BookingPage.jsx
    { file: 'src/components/pages/BookingPage.jsx', from: "import AnimatedButton from './AnimatedButton'", to: "import AnimatedButton from '../ui/AnimatedButton'" },
    { file: 'src/components/pages/BookingPage.jsx', from: "import { supabase } from '../lib/supabase'", to: "import { supabase } from '../../lib/supabase'" },
    { file: 'src/components/pages/BookingPage.jsx', from: "import VehiclePlateSelector from './VehiclePlateSelector'", to: "import VehiclePlateSelector from '../ui/VehiclePlateSelector'" },

    // LegalLayout.jsx
    { file: 'src/components/legal/LegalLayout.jsx', from: "import Header from '../Header'", to: "import Header from '../layout/Header'" },
    { file: 'src/components/legal/LegalLayout.jsx', from: "import Contact from '../Contact'", to: "import Contact from '../pages/Contact'" },

    // FlavorSlider.jsx
    { file: 'src/components/features/FlavorSlider.jsx', from: 'import { flavorlists } from "../constants"', to: 'import { flavorlists } from "../../constants"' }
];

fixes.forEach(fix => {
    try {
        const filePath = path.join(__dirname, fix.file);
        let content = fs.readFileSync(filePath, 'utf8');

        if (content.includes(fix.from)) {
            content = content.replace(fix.from, fix.to);
            fs.writeFileSync(filePath, content, 'utf8');
            console.log(`✓ Fixed: ${fix.file}`);
        } else {
            console.log(`⚠ Skipped (not found): ${fix.file}`);
        }
    } catch (err) {
        console.error(`✗ Error fixing ${fix.file}:`, err.message);
    }
});

console.log('\nDone!');
