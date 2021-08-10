import create, { UseStore } from 'zustand';
import { persist } from 'zustand/middleware';

import { Clock } from '@/pages/api/[type]/[id]';

type State = {
  clockIds: number[];
  setClockIds: (ids: number[]) => void;
  clocks: Clock[];
  addClock: (clock: Clock) => void;
};

const stores: { [key: string]: UseStore<State> } = {};

const getStore = (type: string) => {
  if (!(type in stores))
    stores[type] = create<State>(
      persist(
        (set) => ({
          clockIds: [],
          setClockIds: (ids) => {
            set({ clockIds: ids });
          },
          clocks: [],
          addClock: (clock) =>
            set((state) => ({ clocks: [...state.clocks, clock] })),
        }),
        {
          name: `${type}-clockids-storage`, // unique name
          getStorage: () => sessionStorage,
        },
      ),
    );

  return stores[type];
};

export default getStore;
