import { compact } from 'lodash';

export const classnames = classes => compact(classes).join(' ');
