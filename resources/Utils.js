
const arrayToObject = (array, keyField) =>
    array.reduce((obj, item) => {
        obj[item[keyField]] = item;
        return obj
    }, {});

const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

function appToName(appid) {
    const appKey = {'F1': 'FireScan', 'P1': 'SprinklerScan', 'E1': 'SafetyScan', 'S1': 'SuppressionScan',
        'C1': 'SecurityScan', 'H1': 'HVACScan', 'I1': 'BRForms'
    };
    return appKey[appid]
}

function appNameToid(appName) {
    const appKey = {'FireScan': 'F1', 'SprinklerScan': 'P1', 'SafetyScan': 'E1', 'SuppressionScan': 'S1',
        'SecurityScan': 'C1', 'HVACScan': 'H1', 'BRForms': 'I1',
    };
    return appKey[appName]
}


function responseCheck(response) {
    let xmlResponse = response.responseText;
    let error = xmlResponse.substring(xmlResponse.indexOf('<error>') + 7, xmlResponse.indexOf('</error>'));

    if (error !== '200 OK') {
        BRC.Utilities.onResponseError(response);
    }
}

class Api {
    constructor(){
        this.apiTime = Date.now();//last time a call was made
        this.waitTime = 800;
        this.calls = [];//datetime stamps of apicalls
        this.maxCallsMin = 35;
        this.slowdonwTime = 4000

    }

    apiWait(){//asynch api limter limts to .8 secs per call still haveing issues wiht after a long delay it will fire all request at same itme sometimes
        this.calls = this.calls.filter(timestamp => timestamp > Date.now() - 60000);
        if (this.calls.length > this.maxCallsMin){
            this.waitTime = this.slowdonwTime
        }else{
            this.waitTime = 800;
        }

        let waite = Math.max(0, (this.waitTime - (Date.now() - this.apiTime)));//can either be called now or
        this.apiTime = Date.now() + waite ;//last time a call was made

        return new Promise(function(resolve){return setTimeout(resolve, waite)})
    }

//apis
    appCheck() {//thsi is laoded by default by hte site utitlties
        this.apiWait();
        let allowedApps = [];
        Ext.Ajax.request({
            url: '/api/?a=userPrivilegeList',
            async: false,
            success:  function(response){
                let xml = response.responseXML;
                let apps = xml.getElementsByTagName('application');

                for (let i = 0; i < apps.length; i++) {
                    allowedApps.push(apps[i].textContent);
                }
            }
        });
        return allowedApps
    }

    userBuildingApplicationList() {
        return this.apiWait().then(result => {
            return Ext.Ajax.request({
                url: '/api/?a=userBuildingApplicationList',
                async: true,
                success: function(response){ this.responseCheck(response)}

            });
        })
    }


    inspectionList(appid,) {
        return this.apiWait().then(result => {
            return Ext.Ajax.request({
                url: '/api/?a=inspectionList&appid='+appid,
                async: true,
                success: function(response){ this.responseCheck(response)}

            });
        })
    }

    buildingList() {
        return this.apiWait().then(result => {
            return Ext.Ajax.request({
                url: '/api/?a=buildingList',
                async: true,
                success:  function(response){ this.responseCheck(response)}
            });
        })
    }

    partnershipList() {
        return this.apiWait().then(result => {
            return Ext.Ajax.request({
                url: '/api/?a=partnershipList',
                async: true,//changed
                success: function(response){ this.responseCheck(response)}

            });
        })
    }

    deviceList(appid,inspectionid) {
        return this.apiWait().then(result => {
            return Ext.Ajax.request({
                url: '/api/?a=deviceList&appid=' + appid + '&inspid=' + inspectionid,
                async: true,
                success: function(response){ this.responseCheck(response)}

            })
        })
    }

    inspectionGet(appid,buildingid){
        return this.apiWait().then(result => {
            return Ext.Ajax.request({
                url: '/api/?a=inspectionGet&appid=' + appid + '&buildingid=' + buildingid,
                async: true,
                success: function(response){ this.responseCheck(response)}

            })
        })
    }

    inspectionGetURL(appid,inspectionid){
        return this.apiWait().then(result => {
            return Ext.Ajax.request({
                url: '/api/?a=reportUrlGenerate&appid='+ appid+'&inspectionid='+inspectionid+'&jsembed=1&summaryreport=1',
                async: true,
                success: function(response){ this.responseCheck(response)}

            })
        })
    }

}

