import * as moduleAlias from 'module-alias';
import * as path from 'path';

moduleAlias.addAliases({
  '@': path.resolve(__dirname, '.'),
});
