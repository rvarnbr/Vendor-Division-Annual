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
        loading:true,
        //Note: Defines the min size
        fakeViewportMinHeight: 600,
        fakeViewportMinWidth: 982,

        //Note: This is needed to setup the code that adjusts the size of the ExtJs app depending on the window size.
        //need to adusjt margins with a css class check the cuistome sss

        initComponent: function () {
            var t = this;
            BRC.Utilities.fixScreenSize(this);
            t.callParent();
        },

        tbar:[
            {
                text: 'Get Data',
                id:'getDatabtn',
                cls: 'barButton x-btn-default-small',
                tooltip: 'Gather all data on inspections and orgs',
                handler: function() {
                    getData();
                },
                disabled:false,
            },
        ],

        items: [
            // {
            //     xtype: 'panel',
            //     id:'headerPanel',
            //     collapsible:false,
            //     bodyBorder:false,
            //     header:false,
            //     viewModel: {
            //         data: [
            //             {name:'test1'},
            //             {name:'test2'},
            //             {name:'test3'},
            //             {name:'test4'},
            //
            //
            //         ]
            //     },
            //     bind: {
            //         data: '{data}'
            //     },
            //     border: 1,
            //     tpl: [
            //         '<tpl for=".">',
            //         '<div>test</div>',
            //         'First Name: {name} <br>',
            //         'Last Name: {lName}',
            //         '<hr>',
            //         '</tpl>'
            //     ],
            //     // tpl: [
            //     //     '<h1>This is a test of teh header</h1>',
            //     //     '<tpl for=".">',
            //     //     '<div class="dataview-org-item">',
            //     //     '<div class="container">{name}',
            //     //     '</div>',
            //     //     //
            //     //     // '<img src="resources/icons/pngwingblank.png" class="smallImage"/>',
            //     //     // '<div id="top-icon" style="left: 50px; top: 15px; position: absolute">',
            //     //     // '<img src="{[this.getImage(values.appid)]}" class="smallImageIcon"/>',
            //     //     // '</div>',
            //     //     // '<tpl  if="this.healthCheck(details)">',
            //     //     // '<div id="right1-icon" style="left: 180px; top: 0px; position: absolute">',
            //     //     //
            //     //     // '<img src="resources/icons/meidcal300px.png" class="smallImageIcon"/>',
            //     //     // '</div>',
            //     //     // '</tpl>',
            //     //     // '<h3 class="name">{name}</h3>',
            //     //     // // '<span class="txt-owned">{[values.owned? \' Your Org already owns this Report Type\':\'Add to request cart for a quote\']} </span>',
            //     //     // '</span>',
            //     //     // '<div class="overlay">',
            //     //     // '<div class="text">{description}</div>',
            //     //     // '<span class="previewLink">',
            //     //     // '<button class="button preview" data-name="{name}" data-link="{link}" onClick="{openPreview(this)}">Preview</button>',
            //     //     // // '<a  class="button" href="{[this.test(values)]}" >Preview</a>',
            //     //     // '</span>',
            //     //     // '</div>',
            //     //     // '</div>',
            //     //     //
            //     //     // '<span class="cartBtn {[this.inCart(values.inCart)]} {[values.owned? \'owned-disabled\':\'\']}">',
            //     //     // '<button  class="button {[values.inCart? \'cart-disabled\':\'\']} {[values.owned? \'owned-disabled\':\'\']}" data-id="{id}" data-owned="{owned}" onClick="{addToCart(this)}" >{[this.cartStatus(values.owned,values.inCart)]}</button>',
            //     //     // '</span>',
            //     //     '</div>',
            //     //     '</tpl>',
            //     // ],
            //     tbar:[
            //         // {
            //         //     text: 'Get poop',
            //         //     id:'fart',
            //         //     cls: 'barButton x-btn-default-small',
            //         //     tooltip: 'Gather all data on inspections and orgs',
            //         //     handler: function() {
            //         //         let tpl = new Ext.XTemplate(
            //         //             '<p>Name: {name}</p>',
            //         //             '<p>Title: {title}</p>',
            //         //             '<p>Company: {company}</p>',
            //         //             '<p>Kids: ',
            //         //             '<tpl for="kids">',     // interrogate the kids property within the data
            //         //             '<p>{name}</p>',
            //         //             '</tpl></p>'
            //         //         );
            //         //         // Ext.getCmp('headerPanel').html
            //         //         tpl.append(Ext.getCmp('headerPanel').body,{
            //         //             name: 'Don Griffin',
            //         //             title: 'Senior Technomage',
            //         //             company: 'Sencha Inc.',
            //         //             drinks: ['Coffee', 'Water', 'More Coffee'],
            //         //             kids: [
            //         //                 { name: 'Aubrey',  age: 17 },
            //         //                 { name: 'Joshua',  age: 13 },
            //         //                 { name: 'Cale',    age: 10 },
            //         //                 { name: 'Nikol',   age: 5 },
            //         //                 { name: 'Solomon', age: 0 }
            //         //             ]
            //         //         })
            //         //     },
            //         //     disabled:false,
            //         // },
            //     ],
            //
            //     width: 300,
            //     height: 150,
            // },
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
                title: 'XTemplate Data Binding Example',
                tpl: [
                    '<div class="masterDiv">',
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
                        '<h3 class="vendorName" id="{orgid}">Vendor Name: {name}',
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
                                                '<th>Preview</th>',
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
                                                '<td>{[Ext.Date.format(new Date(values.startDate),\"Y-m-d\")]}</td>',
                                                '<td class="{[values.flag == \'10\' ? \'flagRed\':\'flagGreen\']}">{[flagKey[values.flag]]}</td>',
                    '<td class="preview">', '<button class="button preview" data-appid="{app}" data-inspectionid="{inspectionId}" onClick="{openPreview(this)}">Preview</button>','</td>',
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
            Ext.getCmp('mainView').setLoading(false);
            }
        )

    }
}


function setPartnerships(){
    //gets list of all partnerships and creates org id key
    return api.partnershipList().then(results => {
        Array.from(results.responseXML.getElementsByTagName('partnership')).forEach(partnership => {
            partnerShipKey[partnership.getElementsByTagName('partnershiporgid')[0].textContent] = partnership.getElementsByTagName('partnershiporgname')[0].textContent
        })
    })
}

function getData(){
    //for each app get app list
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
        let totalPercent = getAllpercent().per
        Ext.getCmp('reportView').getViewModel().set('fullData', {
            'totalPercent':totalPercent,
            'orgs':Object.values(orgs)});
        //loading flase
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
        this.name = partnerShipKey[orgid] || 'UnknownName'
        this.accounts = {}
        //not sure if need other dteailes
    }
    addInspection(inspectionObj){
        if (!this.accounts[inspectionObj.accountId]){
            this.accounts[inspectionObj.accountId] = new Account(inspectionObj.accountId,inspectionObj.accountName)
        }
        this.accounts[inspectionObj.accountId].addInspection(inspectionObj)
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
        this.flag = inspectionXml.getElementsByTagName('statusflagid')[0].textContent //by id
        this.startDate = inspectionXml.getElementsByTagName('startdate')[0].textContent
        this.inspectionId = inspectionXml.getElementsByTagName('inspectionid')[0].textContent
        this.app = appid

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