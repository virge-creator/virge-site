import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Mapping of posts to their images and tags
const postMeta = {
  'a2a-commerce-agent-to-agent-shopping-2026': {
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=450&fit=crop',
    tags: ['ai', 'ecommerce', 'automation', 'agents']
  },
  'adobe-ceo-exits-ai-disruption-creative-software': {
    image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=450&fit=crop',
    tags: ['ai', 'business', 'creative']
  },
  'agentic-ai-conference-2026-docker-sandboxes-enterprise-security': {
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=450&fit=crop',
    tags: ['ai', 'agents', 'security', 'enterprise']
  },
  'agentic-ai-enterprise-orchestration-security': {
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=450&fit=crop',
    tags: ['ai', 'agents', 'enterprise', 'orchestration']
  },
  'ai-agentic-coding-tools-claude-2026': {
    image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=450&fit=crop',
    tags: ['ai', 'coding', 'automation', 'claude']
  },
  'ai-agents-2026-from-demo-to-daily-work': {
    image: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&h=450&fit=crop',
    tags: ['ai', 'agents', 'automation', 'productivity']
  },
  'ai-agents-autonomous-crypto-wallets': {
    image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&h=450&fit=crop',
    tags: ['ai', 'agents', 'crypto', 'blockchain']
  },
  'ai-content-enrichment-ecommerce': {
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=450&fit=crop',
    tags: ['ai', 'ecommerce', 'content', 'automation']
  },
  'anythingllm-self-hosted-ai-workspace': {
    image: 'https://images.unsplash.com/photo-1518186285589-2f7649de83e0?w=800&h=450&fit=crop',
    tags: ['ai', 'llm', 'self-hosted', 'workspace']
  },
  'aws-ai-coding-outages-enterprise-risks': {
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=450&fit=crop',
    tags: ['cloud', 'aws', 'ai', 'enterprise']
  },
  'collectiviq-multi-model-ai-consensus': {
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=450&fit=crop',
    tags: ['ai', 'llm', 'consensus', 'multi-model']
  },
  'enterprise-sso-oauth2-aws-cognito-keycloak': {
    image: 'https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?w=800&h=450&fit=crop',
    tags: ['sso', 'oauth2', 'security', 'enterprise']
  },
  'exo-mac-studio-cluster-llm': {
    image: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=800&h=450&fit=crop',
    tags: ['llm', 'hardware', 'cluster', 'mac']
  },
  'gartner-rag-domain-specific-ai-2026': {
    image: 'https://images.unsplash.com/photo-1555255707-c07966088b7b?w=800&h=450&fit=crop',
    tags: ['rag', 'enterprise', 'ai', 'gartner']
  },
  'gitnexus-code-knowledge-graph': {
    image: 'https://images.unsplash.com/photo-1516116216624-8e28d5840eac?w=800&h=450&fit=crop',
    tags: ['coding', 'knowledge-graph', 'git', 'ai']
  },
  'google-nano-banana-2-image-generation': {
    image: 'https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8?w=800&h=450&fit=crop',
    tags: ['ai', 'image-generation', 'google', 'ml']
  },
  'hybrid-search-surf-orchestrator-core': {
    image: 'https://images.unsplash.com/photo-1518186285589-2f7649de83e0?w=800&h=450&fit=crop',
    tags: ['search', 'hybrid', 'orchestration', 'ai']
  },
  'llm-inference-hardware-broken-patterson-2026': {
    image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=450&fit=crop',
    tags: ['llm', 'hardware', 'inference', 'performance']
  },
  'llm-referral-traffic-seo-reality-check-2026': {
    image: 'https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?w=800&h=450&fit=crop',
    tags: ['llm', 'seo', 'traffic', 'marketing']
  },
  'mit-llm-training-efficiency-tlt': {
    image: 'https://images.unsplash.com/photo-1507146426996-ef05306b995a?w=800&h=450&fit=crop',
    tags: ['llm', 'training', 'efficiency', 'research']
  },
  'n8n-vs-make-workflow-automation-2026': {
    image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=450&fit=crop',
    tags: ['automation', 'workflow', 'n8n', 'comparison']
  },
  'openai-microsoft-uk-ai-safety-coalition': {
    image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&h=450&fit=crop',
    tags: ['ai', 'safety', 'openai', 'policy']
  },
  'openai-pentagon-deal-anthropic-ban': {
    image: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=800&h=450&fit=crop',
    tags: ['ai', 'policy', 'openai', 'government']
  },
  'qwen-25-most-used-open-source-llm': {
    image: 'https://images.unsplash.com/photo-1555255707-c07966088b7b?w=800&h=450&fit=crop',
    tags: ['llm', 'open-source', 'qwen', 'ai']
  },
  'rag-architectures-enterprise-2026': {
    image: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=800&h=450&fit=crop',
    tags: ['rag', 'enterprise', 'llm', 'architecture']
  },
  'reddit-ai-shopping-search-ecommerce': {
    image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&h=450&fit=crop',
    tags: ['ai', 'ecommerce', 'search', 'reddit']
  },
  'samsung-73-billion-ai-chips-2026': {
    image: 'https://images.unsplash.com/photo-1555664424-778a1e5e1b48?w=800&h=450&fit=crop',
    tags: ['ai', 'hardware', 'chips', 'samsung']
  },
  'sap-crewai-ai-agents-rag-developer-challenge-2026': {
    image: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&h=450&fit=crop',
    tags: ['ai', 'agents', 'rag', 'sap']
  },
  'webmcp-chrome-ai-agents-websites-2026': {
    image: 'https://images.unsplash.com/photo-1516116216624-8e28d5840eac?w=800&h=450&fit=crop',
    tags: ['ai', 'agents', 'browser', 'automation']
  },
  'why-dutch-tech-companies-need-ai-automation': {
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=450&fit=crop',
    tags: ['ai', 'automation', 'business', 'netherlands']
  },
  'yann-lecun-ami-labs-world-models-2026': {
    image: 'https://images.unsplash.com/photo-1507146426996-ef05306b995a?w=800&h=450&fit=crop',
    tags: ['ai', 'research', 'world-models', 'ml']
  }
};

function fixPost(filePath, slug) {
  const content = fs.readFileSync(filePath, 'utf8');
  const meta = postMeta[slug];
  
  if (!meta) {
    console.log(`⚠️  No metadata for ${slug}`);
    return;
  }
  
  const lines = content.split('\n');
  
  // Find frontmatter boundaries
  let startIdx = -1;
  let endIdx = -1;
  
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].trim() === '---') {
      if (startIdx === -1) {
        startIdx = i;
      } else {
        endIdx = i;
        break;
      }
    }
  }
  
  if (startIdx === -1 || endIdx === -1) {
    console.log(`❌ Could not find frontmatter for ${slug}`);
    return;
  }
  
  // Parse frontmatter and remove unwanted fields
  const frontmatterLines = [];
  const fieldsToRemove = ['heroImage', 'category', 'image', 'tags'];
  
  for (let i = startIdx + 1; i < endIdx; i++) {
    const line = lines[i];
    const isUnwanted = fieldsToRemove.some(field => line.trim().startsWith(`${field}:`));
    if (!isUnwanted) {
      frontmatterLines.push(line);
    }
  }
  
  // Add our fields
  frontmatterLines.push(`image: "${meta.image}"`);
  frontmatterLines.push(`tags: ${JSON.stringify(meta.tags)}`);
  
  // Reconstruct file
  const newLines = [
    '---',
    ...frontmatterLines,
    '---',
    ...lines.slice(endIdx + 1)
  ];
  
  const newContent = newLines.join('\n');
  fs.writeFileSync(filePath, newContent, 'utf8');
  console.log(`✅ Fixed ${slug}`);
}

// Process EN posts
const enDir = path.join(__dirname, 'src/pages/en/blog');
const enFiles = fs.readdirSync(enDir).filter(f => f.endsWith('.md'));

console.log('Fixing EN posts...');
enFiles.forEach(file => {
  const slug = file.replace('.md', '');
  fixPost(path.join(enDir, file), slug);
});

// Process NL posts
const nlDir = path.join(__dirname, 'src/pages/nl/blog');
const nlFiles = fs.readdirSync(nlDir).filter(f => f.endsWith('.md'));

console.log('\nFixing NL posts...');
nlFiles.forEach(file => {
  const slug = file.replace('.md', '');
  fixPost(path.join(nlDir, file), slug);
});

console.log('\n✨ Done!');
