declare module 'react' {
  export type FC<P = {}> = (props: P) => any;
  export type ReactNode = any;
  export type Dispatch<A> = any;
  export type SetStateAction<S> = S | ((prevState: S) => S);
  export function createContext<T>(defaultValue: T): any;
  export function useState<S>(initial: S): [S, Dispatch<SetStateAction<S>>];
  export function useEffect(effect: () => any, deps?: any[]): void;
  export function useContext<T>(context: any): T;
  const React: {
    useState: typeof useState;
    useEffect: typeof useEffect;
    createContext: typeof createContext;
    useContext: typeof useContext;
  };
  export default React;
}
