#!/usr/bin/env node
/** Quick CLI: node tools/cli.mjs "မင်္ဂလာပါ။" */
import { textToPhonemes } from '../dist/sagapyaw.mjs';

const text = process.argv.slice(2).join(' ') || 'မင်္ဂလာပါ။';
const { phon, errors } = textToPhonemes(text);

console.log(phon);
if (errors.length) console.error(`parse errors: ${errors.join(' ')}`);
