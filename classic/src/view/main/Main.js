Ext.onReady(function () {
    BRC.Utilities.pageOnReady((br_userId == ""));
});


Ext.define('MyApp.view.main.Main', {
        extend: 'Ext.panel.Panel',
        requires:[
            'Ext.layout.container.HBox',
            'Ext.plugin.Viewport',
        ],
        // xtype: 'tabpanel',
        title: '',
        layout: 'hbox',
        id: 'mainView',
        renderTo: 'FakeViewport',
        height:'100%',
        // loading:true,
        //Note: Defines the min size
        fakeViewportMinHeight: 600,
        fakeViewportMinWidth: 982,
        listeners: {
            render: function() {
                Ext.getCmp('mainView').setLoading(true)
            }
        },
        //Note: This is needed to setup the code that adjusts the size of the ExtJs app depending on the window size.
        //need to adusjt margins with a css class check the cuistome sss

        initComponent: function () {
            var t = this;
            BRC.Utilities.fixScreenSize(this);
            t.callParent();
        },

        tbar:[
            {
                text: 'Refresh Data',
                id:'getDatabtn',
                cls: 'barButton x-btn-default-small',
                tooltip: 'Gather all data on inspections and Vendors',
                handler: function() {
                    getData();
                },
                disabled:false,
            },
            {
                text: 'Export/Print Data',
                id:'expDatabtn2',
                cls: 'barButton x-btn-default-small',
                tooltip: 'Opens new Window to print/Save the report as a PDF',
                handler: function() {
                    let body = Ext.dom.Query.selectNode('#reportView-body');
                    plugin.Printer.print(body,true);

                },
                disabled:true,
            },


        ],

        items: [
            {
                xtype: 'panel',
                id:'reportView',
                alias: 'widget.mypanel',
                tbar:[

                ],
                viewModel: {
                    fullData: [
                       ]
                },
                bind: {
                    data: '{fullData}'
                },
                border: 1,
                width: '100%',
                height: '100%',
                // title: 'XTemplate Data Binding Example',
                tpl: [
                    '<div class="masterDiv" id="masterDiv">',
                    '<h1>Most Recent Inspection Status Report (by Vendor)' +
                    '<h2>Overall Percentage of Failed inspections: {totalPercent:number(\'0.0\')}%</h2>',
                    '<div class="navSection">',
                    '<tpl for="orgs">',
                    '<p class="jumpVendor">',
                        '<a href="#{orgid}">',
                        'View {name} {[values.getPercent().per]} %',
                    '</a>',
                    '</p>',

                    '</tpl>',
                    '</div>',
                    '<tpl for="orgs">',

                        '<div class="dataview-org-item">',
                        '<h3 class="vendorName" id="{orgid}">{name}',
                        '</h3>',
                        '<h4 class="vendorName">Vendor Percentage of Failed inspections: {[values.getPercent().per]} %',
                        '</h4>',
                            '<div class="accountData">',
                                '<tpl foreach="accounts">',
                                    '<div class="accountsDiv">',
                                        '<h3 class="accountName">Account: {accountName}',
                                        '</h3>',
                                        '<table class="inspectionTable" id="{parent.orgid}{accountId}">',
                                        '<thead>',
                                            '<tr class="tableHeader">',
                                                '<th onClick="sortTable(0,{parent.orgid}{accountId})" >Building Name</th>',
                                                '<th onClick="sortTable(1,{parent.orgid}{accountId})" >Building ID</th>',
                                                '<th onClick="sortTable(2,{parent.orgid}{accountId})" >Application</th>',
                                                '<th onClick="sortTable(3,{parent.orgid}{accountId})" >BRC Inspection ID</th>',
                                                '<th onClick="sortTable(4,{parent.orgid}{accountId})" >Inspection Date</th>',
                                                '<th onClick="sortTable(5,{parent.orgid}{accountId})" >Flag Color</th>',
                                                '<th onClick="sortTable(6,{parent.orgid}{accountId})" >Failed (Devices)</th>',
                                                '<th onClick="sortTable(6,{parent.orgid}{accountId})" >Failed Percent</th>',
                                                '<th onClick="sortTable(7,{parent.orgid}{accountId})" >Date of last Change</th>',
                                                '<th onClick="sortTable(7,{parent.orgid}{accountId})" >Days since last device change</th>',
                                                // '<th onClick="sortTable(8,{parent.orgid}{accountId})" >Flag Color</th>',
                                                // '<th class="previewCol">Preview</th>',//removed untill fixed on prod
                                            '</tr>',
                                        '</thead>',
                                    '<tbody>',
                                        '<tpl foreach="inspections">',//grouped by buildings
                                            '<tpl for=".">',
                                                '<tr>',
                                                '<td>{buildingName}</td>',
                                                '<td>{identifier}</td>',
                                                '<td>{[appToName(values.app)]}</td>',
                                                '<td>{inspectionId}</td>',
                                                '<td>{[Ext.Date.format(new Date(values.startDate.replace(/\\s/, \'T\')),\"Y-m-d\")]}</td>',
                                                '<td class="{[values.flag == \'10\' ? \'flagRed\':\'flagGreen\']}">{[flagKey[values.flag]]}</td>',
                                                '<td>{failedDevices}</td>',
                                                '<td>{failedPercent}</td>',
                                                '<td>{[Ext.Date.format(new Date(values.endDate.replace(/\\s/, \'T\')),\"Y-m-d\")]}</td>',//last update
                                                '<td>{daysSinceUpdate}</td>',
                                                // '<td class="preview previewCol">', '<button class="button preview" data-appid="{app}" data-inspectionid="{inspectionId}" onClick="{openPreview(this)}">Preview</button>','</td>',//this may not be working for canadian members
                                                '</tr>',
                                            '</tpl>',
                                        '</tpl>',
                                    '</tbody>',
                                        ' </table>',
                                    '<h3 class="vendorPer" > Percentage of Total Inspections Failed (Account): {[values.getPercent().per]} %</h3>',
                                    '</div>',

                                '</tpl>',
                            '</div>',
                        '</div>',
                    '</tpl>',
                    '</div>',
                ],
                autoScroll: true, // add scroll bar if necessary
            }

        ],
    }
);
const requiredPrivlges = [];
let apps = []
let orgs ={}
let masterAppBuildingList = {}
let partnerShipKey = {}
let failedFlags = ['10'] //list of failed ids faded and not  ??
const flagKey = {
    '0':'Unknown',
    '10':'Failed',
    '20':'Passed - Notes',
    '30':'Passed',
    '40':'Passed - Blue',
}
const api = new Api()

if (BRC.Utilities.privsEvent.loaded) {
    afterPrivs();
}
else {
    BRC.Utilities.privsEvent.on('privilegesLoad', afterPrivs, this, {single: true});
}

function privCheck(){
    for (let priv of requiredPrivlges){
        if(!BRC.Utilities.hasPriv(priv)){
            Ext.Msg.alert('Permissions Error','You do not contain the proper Role or permission to use this application');
            return false
        }
    }

    return true
}

function afterPrivs() {
    if(privCheck()){
        apps = BRC.Utilities.applications.map(app => app.id);
        setPartnerships().then(results =>{
                orgInfoSet().then(r=> {
                        Ext.getCmp('mainView').setLoading(false);
                        getData()
                    }
                )

            }
        )
    }
}
function orgInfoSet(){
    //ading org to teh partnership org list for refrence
    return api.orgInfo().then(results =>{
        partnerShipKey[results.responseXML.getElementsByTagName('orgid')[0].textContent] = results.responseXML.getElementsByTagName('name')[0].textContent
    })
}
function setPartnerships(){
    //gets list of all partnerships and creates org id key
    return api.partnershipList().then(results => {
        Array.from(results.responseXML.getElementsByTagName('partnership')).forEach(partnership => {
            partnerShipKey[partnership.getElementsByTagName('partnershiporgid')[0].textContent] = partnership.getElementsByTagName('partnershiporgname')[0].textContent
        })
    })
}
function openPreview(obj){
    api.inspectionGetURL(obj.dataset.appid,obj.dataset.inspectionid).then(function (result) {
        new Ext.Window({
            title : "Preview",
            height: '75%',
            width: '75%',
            layout : 'vbox',
            items : [{
                flex:3,
                width: '100%',
                xtype : "component",
                autoEl : {
                    tag : "iframe",
                    src : result.responseXML.getElementsByTagName(`baseurl`)[0].textContent,
                }
            },


            ]
        }).show();
        })

}
function getData(){

    Ext.getCmp('mainView').setLoading(true)
    Ext.MessageBox.show({
        msg: 'Gathering your data, please wait...',
        progressText: 'Loading...',
        width: 300,
        wait: {
            interval: 200
        },

        // maskClickAction: getMaskClickAction()
    });
    //for each app get app list
    let deviceListCalls = []
    let inspections = apps.map(app => {
        return api.inspectionList(app).then(inspectionResults=>{
            //maybe have teh api do the filter??
            let inspListXml = Array.from(inspectionResults.responseXML.getElementsByTagName('inspection'))
                .filter(inspection => inspection.getElementsByTagName('frequency')[0].textContent === '10')//fillter only annuals ??
            inspListXml.sort((a, b) => a.getElementsByTagName('inspectionid')[0].textContent - b.getElementsByTagName('inspectionid')[0].textContent);
            inspListXml.reverse()//sort by insepcion id
            inspectionSetUp(inspListXml,app)

        })
    })

    Promise.all(inspections).then(test => {
        Promise.all(Object.values(orgs).map(org =>
            org.getFailedInspectionData()
        )).then(r => {
            let totalPercent = getAllpercent().per
            Ext.getCmp('reportView').getViewModel().set('fullData', {
                'totalPercent':totalPercent,
                'orgs':Object.values(orgs)});
            Ext.MessageBox.hide();
            Ext.getCmp('mainView').setLoading(false)
            Ext.getCmp('expDatabtn2').setDisabled(false)

        })//loading flase
    })

    //iterate wtih a sepearte function used by all inspectiion list calls
    //checks to see if it is used yet for thsi app
    //addes its building id ot app list
    //creates orgs if not allready there
    //adds insepcions to org

}

function inspectionSetUp(inspectionXmlArray,appid){
    inspectionXmlArray.forEach(inspectionXml => {
        if ( !masterAppBuildingList[appid]){
            masterAppBuildingList[appid] = []
        }
        if (masterAppBuildingList[appid].indexOf(inspectionXml.getElementsByTagName('buildingid')[0].textContent) === -1){
            masterAppBuildingList[appid].push(inspectionXml.getElementsByTagName('buildingid')[0].textContent)
            orgAdd(inspectionXml,appid)
        }
    })
}

function orgAdd(inspectionXml,appid){
    let inspection = new InspectionClass(inspectionXml,appid)
    if (!orgs[inspection.orgid] ){
        orgs[inspection.orgid] = new Org(inspection.orgid)
    }
    orgs[inspection.orgid].addInspection(inspection)
}

function getAllpercent(){
    let ttl = 0
    let failed = 0
    Object.values(orgs).forEach(org => {
            let deCon = perDiconst(org.getPercent())
            ttl += deCon.ttl
            failed += deCon.failed
        })
    let per = Ext.util.Format.number((failed * 100) / ttl, '0.0');
    return {per,ttl}
}

class Org{
    constructor(orgid) {
        this.orgid = orgid
        this.name = partnerShipKey[orgid] || 'Unknown Vendor '+ orgid
        this.accounts = {}
        //not sure if need other dteailes
    }
    addInspection(inspectionObj){
        if (!this.accounts[inspectionObj.accountId]){
            this.accounts[inspectionObj.accountId] = new Account(inspectionObj.accountId,inspectionObj.accountName)
        }
        this.accounts[inspectionObj.accountId].addInspection(inspectionObj)
    }

    getFailedInspectionData(){
        return Promise.all( Object.values(this.accounts).map(account =>
            account.getFailedInspectionData()
        ))
    }

    getPercent(){
        let ttl = 0
        let failed = 0
        Object.values(this.accounts).forEach(account =>{
            let deCon = perDiconst(account.getPercent())
            ttl += deCon.ttl
            failed += deCon.failed
        })
        let per = Ext.util.Format.number((failed * 100) / ttl, '0.0');
        return {per,ttl}
    }
}

class Account {
    constructor(accountId,accountName) {
        this.accountId = accountId
        this.accountName = accountName
        this.inspections = {} //by building id then in a list/array
    }

    addInspection(inspectionObj){
        if (!this.inspections[inspectionObj.buildingId]){
            this.inspections[inspectionObj.buildingId] = []
        }
        this.inspections[inspectionObj.buildingId].push(inspectionObj)
    }
    getFailedInspectionData(){

        return Promise.all(
             [].concat.apply([], Object.values(this.inspections))

            .filter(inspection => inspection.flag === '10'
            )
            .map(inspection => inspection.getInspectionDeviceData())


    ) //only get failed inspection objects
    }
    getPercent(){
        let ttl = 0
        let failed = 0
        Object.values(this.inspections).forEach(inspectionList =>{
            inspectionList.forEach(inspection => {
                ttl += 1
                failed += failedFlags.indexOf(inspection.flag) === -1 ? 0:1
            } )
        })
        let per = Ext.util.Format.number((failed * 100) / ttl, '0.0');
        return {per,ttl}
    }
}



class InspectionClass{
    constructor(inspectionXml, appid) {
        this.orgid = inspectionXml.getElementsByTagName('orgid')[0].textContent
        this.accountId = inspectionXml.getElementsByTagName('accountid')[0].textContent
        this.accountName = inspectionXml.getElementsByTagName('accountname')[0].textContent
        this.buildingName = inspectionXml.getElementsByTagName('buildingname')[0].textContent
        this.buildingId = inspectionXml.getElementsByTagName('buildingid')[0].textContent
        this.identifier = inspectionXml.getElementsByTagName('identifier')[0].textContent
        this.address = inspectionXml.getElementsByTagName('address')[0].textContent
        this.flag = inspectionXml.getElementsByTagName('statusflagid')[0].textContent //by id // if flag is red need to check devices
        this.startDate = inspectionXml.getElementsByTagName('startdate')[0].textContent
        this.endDate = inspectionXml.getElementsByTagName('enddate')[0].textContent //used to show when the last time teh report was modifed only If it was done on a handheld
        this.daysSinceUpdate = (this.flag === '10') ? this.daySince():0 //days since last enddate if flag is failed
        this.failedDevices = 0
        this.ttlDevices = ''//may not use
        this.failedPercent = 'Passed'
        this.inspectionId = inspectionXml.getElementsByTagName('inspectionid')[0].textContent
        this.app = appid

    }
    daySince(){

        return Ext.Date.diff(new Date(this.endDate),new Date(), "d")
    }
    getInspectionDeviceData(){
        return api.deviceList(this.app, this.inspectionId)
            .then(results => {
                Ext.MessageBox.show({
                    message: 'Gathering Discrepancy Data ' + api.count +' left. please wait...',
                    progressText: 'Loading...',
                    width: 300,
                    wait: {
                        interval: 200
                    },

                    // maskClickAction: getMaskClickAction()
                });
                if(resultCheck(results)) {
                    let deviceListXml = results;
                    this.ttlDevices  =  deviceListXml.responseXML.getElementsByTagName('device').length;
                    this.failedDevices = Array.from(deviceListXml.responseXML.getElementsByTagName('device')).filter(device => (device.getElementsByTagName('tested')[0].textContent === 'true' && device.getElementsByTagName('passed')[0].textContent === 'false')).length
                    this.failedPercent  =  Ext.util.Format.number(this.failedDevices / this.ttlDevices *100, '0.##%')

                }
            } )
    }

}

function perDiconst(data){
    return {
        'ttl': data.ttl,
        'failed': (data.ttl*data.per)/100
    }
}

//i stole this from w3
function sortTable(n,tableid) {
    var table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;

    table = document.getElementById(tableid);

    switching = true;
    // Set the sorting direction to ascending:
    dir = "asc";
    /* Make a loop that will continue until
    no switching has been done: */
    while (switching) {
        // Start by saying: no switching is done:
        switching = false;
        rows = table.rows;
        /* Loop through all table rows (except the
        first, which contains table headers): */
        for (i = 1; i < (rows.length - 1); i++) {
            // Start by saying there should be no switching:
            shouldSwitch = false;
            /* Get the two elements you want to compare,
            one from current row and one from the next: */
            x = rows[i].getElementsByTagName("TD")[n];
            y = rows[i + 1].getElementsByTagName("TD")[n];
            /* Check if the two rows should switch place,
            based on the direction, asc or desc: */
            if (dir == "asc") {
                if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
                    // If so, mark as a switch and break the loop:
                    shouldSwitch = true;
                    break;
                }
            } else if (dir == "desc") {
                if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
                    // If so, mark as a switch and break the loop:
                    shouldSwitch = true;
                    break;
                }
            }
        }
        if (shouldSwitch) {
            /* If a switch has been marked, make the switch
            and mark that a switch has been done: */
            rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
            switching = true;
            // Each time a switch is done, increase this count by 1:
            switchcount ++;
        } else {
            /* If no switching has been done AND the direction is "asc",
            set the direction to "desc" and run the while loop again. */
            if (switchcount == 0 && dir == "asc") {
                dir = "desc";
                switching = true;
            }
        }
    }
}
//this is not used as we went with printing the screen to pdf
//hte cdn is turned off for save and docx
function creatOutput(){
    const doc = new docx.Document();
    let parts =[
        new docx.Paragraph({
            heading: docx.HeadingLevel.TITLE,
            children: [new docx.TextRun({

                text: "Most Recent Inspection Status Report (by Vendor)",
                bold: true,
            }),
            ],
        }),
        new docx.Paragraph({
            children: [new docx.TextRun({
                text: "Overall Percentage of Failed inspections: "+ getAllpercent().per +"%",
                bold: true,
            }),
            ],
        }),
    ]

    Object.values(orgs).forEach(org => {
        parts.push(
            new docx.Paragraph({
                heading: docx.HeadingLevel.HEADING_1,
                spacing: {
                    before: 400,
                },
                children: [
                    new docx.TextRun({
                        text: org.name,
                        bold: true,
                    }),
                ],
             })
        )
        parts.push(
            new docx.Paragraph({
                heading: docx.HeadingLevel.HEADING_3,
                children: [
                    new docx.TextRun({
                        text: "Vendor Percentage of Failed inspections: "+ org.getPercent().per +"%",
                        bold: true,
                    }),
                ],
            })

        )


        Object.values(org.accounts).forEach(account =>{
            let accountTableRows = [
                //header Row
                new docx.TableRow({

                    children: [
                        new docx.TableCell({
                            shading: {
                                fill: "c9c9c9",
                            },
                            children: [new docx.Paragraph("Building Name")],
                        }),
                        new docx.TableCell({
                            shading: {
                                fill: "c9c9c9",
                            },
                            children: [new docx.Paragraph("Building ID")],
                        }),
                        new docx.TableCell({
                            shading: {
                                fill: "c9c9c9",
                            },
                            children: [new docx.Paragraph("Application")],
                        }),
                        new docx.TableCell({
                            shading: {
                                fill: "c9c9c9",
                            },
                            children: [new docx.Paragraph("BRC Inspection ID")],
                        }),
                        new docx.TableCell({
                            shading: {
                                fill: "c9c9c9",
                            },
                            children: [new docx.Paragraph("Inspection Date")],
                        }),
                        new docx.TableCell({
                            shading: {
                                fill: "c9c9c9",
                            },
                            children: [new docx.Paragraph("Flag Color")],
                        }),
                    ],
                })
            ]


                Object.values(account.inspections).forEach(buildingid =>{
                    buildingid.forEach(inspection => {
                        // creat a row for the inspection
                        accountTableRows.push( new docx.TableRow({
                            children: [
                                new docx.TableCell({
                                    children: [new docx.Paragraph(inspection.buildingName)],
                                }),
                                new docx.TableCell({
                                    children: [new docx.Paragraph(inspection.identifier)],
                                }),
                                new docx.TableCell({
                                    children: [new docx.Paragraph(appToName(inspection.app))],
                                }),
                                new docx.TableCell({
                                    children: [new docx.Paragraph(inspection.inspectionId)],
                                }),
                                new docx.TableCell({
                                    children: [new docx.Paragraph(Ext.Date.format(new Date(inspection.startDate),"Y-m-d"))],
                                }),
                                new docx.TableCell({
                                    children: [new docx.Paragraph(flagKey[inspection.flag])],
                                }),
                            ],
                        })
                        )


                    })
                })

            parts.push(new docx.Paragraph({
                spacing: {
                    before: 200,
                },
                children: [
                    new docx.TextRun({
                    text: "Account: "+account.accountName,
                    bold: true,
                }),
                ],
            }))

            parts.push(
                new docx.Table({
                    tableHeader: true,
                    // layout:docx.TableLayoutType.FIXED,
                    rows: accountTableRows
            }))
        })

    })

    doc.addSection({
        properties: {
        },
        children: parts,
    });

    docx.Packer.toBlob(doc).then(blob => {
        saveAs(blob, "test.docx");
    });
}

Ext.define("plugin.Printer", {
    statics: {
        print: function(htmlElement,printAutomatically) {

            var win = window.open('', 'Print Panel');
            win.document.open();
            win.document.write(htmlElement.outerHTML);
            win.document.getElementById("reportView-body").classList.add("clearStylesOutput")
            var elems = win.document.getElementsByClassName("previewCol");
            Array.from(elems).forEach(elem => elem.remove());
            var head =  win.document.head;
            var link =  win.document.createElement("link");
            link.type = "text/css";
            link.rel = "stylesheet";
            link.href = 'vendor-division-annual/resources/custom.css';//this is a special case for the new window opening
            // link.href = 'resources/custom.css';
            link.addEventListener('load', function (){
                win.print()
                win.document.close();
            });
            head.appendChild(link);


        }

    }
});