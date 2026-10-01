import * as migration_20260831_125625 from './20260831_125625';
import * as migration_20260831_131238 from './20260831_131238';
import * as migration_20260831_134139 from './20260831_134139';
import * as migration_20260831_140033_credit_requests from './20260831_140033_credit_requests';
import * as migration_20260930_152958_properties_drafts from './20260930_152958_properties_drafts';
import * as migration_20261001_152725_credit_partner from './20261001_152725_credit_partner';

export const migrations = [
  {
    up: migration_20260831_125625.up,
    down: migration_20260831_125625.down,
    name: '20260831_125625',
  },
  {
    up: migration_20260831_131238.up,
    down: migration_20260831_131238.down,
    name: '20260831_131238',
  },
  {
    up: migration_20260831_134139.up,
    down: migration_20260831_134139.down,
    name: '20260831_134139',
  },
  {
    up: migration_20260831_140033_credit_requests.up,
    down: migration_20260831_140033_credit_requests.down,
    name: '20260831_140033_credit_requests',
  },
  {
    up: migration_20260930_152958_properties_drafts.up,
    down: migration_20260930_152958_properties_drafts.down,
    name: '20260930_152958_properties_drafts',
  },
  {
    up: migration_20261001_152725_credit_partner.up,
    down: migration_20261001_152725_credit_partner.down,
    name: '20261001_152725_credit_partner'
  },
];
