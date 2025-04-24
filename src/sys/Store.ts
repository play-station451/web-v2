import { create } from "zustand";
import { WindowConfig, cmprops } from "./types";
import { init } from '@paralleldrive/cuid2';
import { updateInfo } from "./gui/AppIsland";

interface WindowState {
  windows: WindowConfig[], wid?: string, pid?: string;
  matchedWindows: any;
  addWindow: (config: WindowConfig) => void;
  killWindow: (wid: any) => void;
  removeWindow: (wid: any) => void;
  arrange: (wid: any) => void;
  minimize: (wid: any) => void;
  getWindow: (wid: any) => void;
  currentPID?: string;
}

interface MenuProps {
  x: number;
  y: number;
  options: any[];
}

interface ContextMenuState {
  menu: MenuProps;
  setContextMenu: (options: any) => void;
  clearContextMenu: () => void;
}

export const createPID = () => {
  const chars = '0123456789';
  let result = '';
  const length = Math.floor(Math.random() * (5 - 1 + 1)) + 1;
  const idGen = (): string => {
    for (let i = 0; i < length; i++) {
      result += chars[Math.floor(Math.random() * chars.length)];
    }
    return result;
  }
  return idGen();
}

export const createWID = () => {
  const cuid = init({
    length: 10
  })
  return "w-" + cuid()
}

const useWindowStore = create<WindowState>()((set) => ({
  windows: [],
  matchedWindows: [],
  addWindow: (config: WindowConfig) => set((state) => {
    const indexes = state.windows.map((w) => w.zIndex ?? 0);
    config.zIndex = Math.max(...indexes) + 1;
    config.focused = true;
    if (config.zIndex === -Infinity) {
      // This will be removed in the future but this is a temporary fix - XSTARS
      config.zIndex = 2;
    }
    state.windows.forEach((w) => {
      if (w.wid !== config.wid) {
        w.focused = false;
        if (w.zIndex !== undefined) {
          w.zIndex -= 1;
        }
      }
    });

    // @ts-expect-error
    const matched = state.matchedWindows.findIndex(group =>
      // @ts-expect-error
      group.some(w => (typeof w.title === 'string' ? w.title : w.title?.text) === (typeof config.title === 'string' ? config.title : config.title?.text))
    )

    if (matched !== -1) {
      state.matchedWindows[matched].push(config);
    } else {
      state.matchedWindows.push([config]);
    }

    config.wid = createWID();
    config.pid = createPID();

    set({ currentPID: config.pid });
    window.dispatchEvent(new CustomEvent("selwin-upd", { detail: typeof config.title === 'string' ? config.title : config.title?.text }));

    return {
      windows: [...state.windows, config],
      matchedWindows: [...state.matchedWindows]
    };
  }),
  killWindow: (pid: string) =>
    set((state: any) => {
      const windows = state.windows.filter((w: any) => w.pid !== pid);
      const matchedWindows = state.matchedWindows.map((group: any) => {
        const newGroup = group.filter((w: any) => w.pid !== pid);
        return newGroup.length > 0 ? newGroup : null;
      }).filter((group: any) => group !== null);
      const indexes = windows.map((w: any) => w.zIndex ?? 0);
      const highest = Math.max(...indexes);
      const win = windows.find((w: any) => w.zIndex === highest);
      if (win) {
        win.focused = true;
        updateInfo({appname: typeof win.title === 'string' ? win.title : win.title?.text});
        window.dispatchEvent(new CustomEvent("selwin-upd", { detail: typeof win.title === 'string' ? win.title : win.title?.text }));
      }

      return {
        windows,
        matchedWindows,
      }
    }),
  removeWindow: (wid: string) => {
    set((state: any) => {
      const windows = state.windows.filter((w: any) => w.wid !== wid);
      const matchedWindows = state.matchedWindows.map((group: any) => {
        const newGroup = group.filter((w: any) => w.wid !== wid);
        return newGroup.length > 0 ? newGroup : null;
      }).filter((group: any) => group !== null);
      const indexes = windows.map((w: any) => w.zIndex ?? 0);
      const highest = Math.max(...indexes);
      const win = windows.find((w: any) => w.zIndex === highest);
      if (win) {
        win.focused = true;
        updateInfo({appname: typeof win.title === 'string' ? win.title : win.title?.text});
        window.dispatchEvent(new CustomEvent("selwin-upd", { detail: typeof win.title === 'string' ? win.title : win.title?.text }));
      }

      return {
        windows,
        matchedWindows,
      }
    })
  },
  arrange: (wid: string) => set((state: WindowState) => {
    const window = state.windows.find((w) => w.wid === wid);
    if (!window) return state;
    set({ currentPID: window.pid });

    const indexes = state.windows.map((w) => w.zIndex ?? 0);
    window.zIndex = Math.max(...indexes) + 1;
    window.focused = true;
    state.windows.forEach((w) => {
      if (w.wid !== wid) {
        w.focused = false;
        if (w.zIndex !== undefined) {
          w.zIndex -= 1;
        }
      }
    });

    return {
      windows: state.windows
    };
  }),
  minimize: (wid: string) => set((state: WindowState) => {
    const window = state.windows.find((w) => w.wid === wid);
    if (!window) return state;
    window.focused = false;
    return {
      windows: state.windows
    };
  }),
  getWindow: (wid: string) => {
    const state = useWindowStore.getState();
    return state.windows.find((w) => w.wid === wid);
  }
}));

const useContextMenuStore = create<ContextMenuState>()((set) => ({
  menu: { x: 0, y: 0, options: [] },
  setContextMenu: (options: any) => set({ menu: options }),
  clearContextMenu: () => set({ menu: { x: 0, y: 0, options: [] } })
}));

export { useWindowStore, useContextMenuStore };