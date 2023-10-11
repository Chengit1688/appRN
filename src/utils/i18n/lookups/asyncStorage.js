import storage from '../storage'

export default {
    name: 'asyncStorage',

    async lookup(options) {
        let found;

        if (options.lookupAsyncStorage) {

            const lng =  await storage
                .load({
                    key: options.lookupAsyncStorage,
                
                    // autoSync (default: true) means if data is not found or has expired,
                    // then invoke the corresponding sync method
                    autoSync: true,
                
                    // syncInBackground (default: true) means if data expired,
                    // return the outdated data first while invoking the sync method.
                    // If syncInBackground is set to false, and there is expired data,
                    // it will wait for the new data and return only after the sync completed.
                    // (This, of course, is slower)
                    syncInBackground: true,
                
                    // you can pass extra params to the sync method
                    // see sync example below
                    syncParams: {
                        extraFetchOptions: {
                        // blahblah
                        },
                        someFlag: true
                    }
                })
                .then(ret => {
                    // found data go to then()
                    return ret.lng
                })
                .catch(err => {
                    // any exception including data not found
                    // goes to catch()
                    switch (err.name) {
                        case 'NotFoundError':
                        // TODO;
                        break;
                        case 'ExpiredError':
                        // TODO
                        break;
                    }
                    return undefined
                });

            if (lng) found = lng;
        }

        return found;
    },

    cacheUserLanguage(lng, options) {
        if (options.lookupAsyncStorage) {
            storage.save({
                key: options.lookupAsyncStorage, // Note: Do not use underscore("_") in key!
                data: {lng}
            });
        }
    }
};