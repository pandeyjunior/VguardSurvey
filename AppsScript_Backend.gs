/*  V-GUARD SURVEY — Google Apps Script backend
 *  ------------------------------------------------------------------
 *  This receives each survey response and appends it as a row to your
 *  Google Sheet. It also serves the data back (as JSON) to the admin
 *  dashboard. Follow SETUP_GUIDE.md to deploy — it takes ~10 minutes.
 *  ------------------------------------------------------------------ */

// The exact column order written to the sheet. Keep in sync with the survey payload.
var COLUMNS = [
  'timestamp','lang','seconds',
  'q1','q2','q3',
  'q4_wiring','q4_switches','q4_switchgear','q4_stab','q4_inverter',
  'q4_fan','q4_cooler','q4_purifier','q4_geyser','q4_lighting',
  'q5','q6','q7','q8','q9','q10','q11','q12','q13','q14','q15'
];

// OPTIONAL: set a passphrase to protect the admin data feed. Leave '' for none.
var ADMIN_KEY = '';

function _sheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sh = ss.getSheetByName('Responses');
  if (!sh) {
    sh = ss.insertSheet('Responses');
    sh.appendRow(COLUMNS);
    sh.getRange(1,1,1,COLUMNS.length).setFontWeight('bold');
    sh.setFrozenRows(1);
  }
  return sh;
}

// Survey POSTs here.
function doPost(e) {
  try {
    var sh = _sheet();
    var p = (e && e.parameter) ? e.parameter : {};
    var row = COLUMNS.map(function(c){ return p[c] != null ? p[c] : ''; });
    sh.appendRow(row);
    return ContentService
      .createTextOutput(JSON.stringify({ok:true}))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ok:false, error:String(err)}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Admin dashboard GETs here to read all responses as JSON.
function doGet(e) {
  var p = (e && e.parameter) ? e.parameter : {};
  if (ADMIN_KEY && p.key !== ADMIN_KEY) {
    return ContentService.createTextOutput(JSON.stringify({ok:false, error:'unauthorised'}))
      .setMimeType(ContentService.MimeType.JSON);
  }
  var sh = _sheet();
  var values = sh.getDataRange().getValues();
  var header = values.shift() || COLUMNS;
  var rows = values.map(function(r){
    var o = {};
    header.forEach(function(h,i){ o[h] = r[i]; });
    return o;
  });
  return ContentService
    .createTextOutput(JSON.stringify({ok:true, count:rows.length, columns:header, rows:rows}))
    .setMimeType(ContentService.MimeType.JSON);
}
