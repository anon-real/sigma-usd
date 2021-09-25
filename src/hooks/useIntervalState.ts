
import { useCallback, useEffect, useRef, useState } from 'react';


export const useIntervalState = <A>(load: () => Promise<A>, delay?: number): A | undefined => {

    const [state, setState] = useState<A | undefined>();

    const loadRef = useRef(load);

    useEffect(() => {
        loadRef.current = load;
    }, [load]);

    const update = useCallback(() => loadRef.current().then(setState), [])

    useEffect(() => {
        if (delay === undefined) {
            return;
        }

        const id = setInterval(update, delay);

        return () => clearInterval(id);
    }, [delay]);

    useEffect(() => { update() }, []);

    return state;
};
