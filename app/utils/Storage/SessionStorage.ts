module openmaths {
    export class SessionStorage {
        static set(key: string, value: any) {
            let setValue: string = JSON.stringify(value);

            window.sessionStorage.setItem(key, setValue);
            return true;
        }

        static get(key: string) {
            let getValue = window.sessionStorage.getItem(key);

            return getValue ? JSON.parse(getValue) : false;
        }

        static remove(key: string) {
            if (openmaths.SessionStorage.get(key)) {
                window.sessionStorage.removeItem(key);
                return true;
            }

            return false;
        }
    }
}