import { CLOCK_TYPES } from '@/constants';

export const getClockTypeByLink = (link: string) =>
  CLOCK_TYPES.find((x) => x.link == link)!;
