import fs from 'node:fs';
const url=new URL(process.env.PAGES_URL);
const root=url.pathname.replace(/\/?$/,'/');
const file='_config.yml';
fs.writeFileSync(file,fs.readFileSync(file,'utf8').replace(/^url:.*$/m,'url: '+url.href).replace(/^root:.*$/m,'root: '+root));
