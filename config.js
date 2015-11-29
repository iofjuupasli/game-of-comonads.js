import most from 'most';
import { tail } from 'ramda';


export const scale$ = most.of(8);
export const size$ = most.create(add => {
    const getHash = () => parseInt(tail(window.location.hash), 10) || 100;
    add(getHash());
    const handler = e => {
        e.preventDefault();
        add(getHash());
    };
    window.addEventListener('hashchange', handler);
    return () => window.removeEventListener('hashchange', handler);
});
