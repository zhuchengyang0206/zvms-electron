const configPath = "./config.json";

let { ipcRenderer } = window.require('electron');

export default {
    saveState: async (con) => {
        // console.log("SADFdsjfhsdjsdhjfdshjfdshfjhd");
        ipcRenderer.once('file-write-complete', (event, arg) => {
            // console.log(arg);
            if (arg.err){
                console.error(arg.err);
                return undefined;
            }
        })
        ipcRenderer.send('file-write-req', {
            "path": configPath,
            "data": JSON.stringify(con.$store.state)
        });
    },
    loadState: async (con) => {
        ipcRenderer.once('file-read-complete', (event, arg) => {
            // console.log(arg);
            if (arg.err){
                console.error(arg.err);
                return undefined;
            }
            con.$store.commit("token", JSON.parse(arg.data).token);
            con.$store.commit("lastSeenVol", JSON.parse(arg.data).lastSeenVol);
            // console.log(con.$store);
            // console.log(arg.data);
        })
        ipcRenderer.send('file-read-req', configPath);
    }
}