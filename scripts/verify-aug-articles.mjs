import { createClient } from '@supabase/supabase-js';
import fs from 'fs'; import os from 'os';
const H = os.homedir();
const url = fs.readFileSync(H+'/.relocost/supabase_url','utf8').trim();
const key = fs.readFileSync(H+'/.relocost/supabase_service_role_key','utf8').trim();
const sb = createClient(url,key,{auth:{persistSession:false}});
const slugs = [
  'zhizn-v-marokko-dlya-rossiyan-2026',
  'zhizn-v-egipte-dlya-rossiyan-2026',
  'zhizn-v-vilnyuse-2026',
  'zhizn-v-rumynii-dlya-rossiyan-2026',
  'pereezd-v-panamu-2026',
  'kak-perevezti-veshchi-pri-pereezde',
  'arenda-zhilya-v-evrope-sravnenie-2026',
  'kak-najti-rabotu-v-evrope-2026',
  'pereezd-s-roditelyami-za-rubezh-2026',
  'zhizn-v-indonezii-dlya-rossiyan-2026'
];
const {data,error} = await sb.from('blog_posts').select('slug,title,published,tag').in('slug',slugs).order('created_at',{ascending:false});
if(error){ console.error(error.message); process.exit(1); }
console.log(`Found: ${data.length}/10`);
data.forEach(r => console.log(r.published ? '[OK]' : '[UNPUB]', r.tag.padEnd(10), r.slug));
