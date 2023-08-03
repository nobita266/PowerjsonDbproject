// "use strict";
// console.log("hello");
var jpdbBaseURL = "http://api.login2explore.com:5577";
var jpdbIRL = "/api/irl";
var jpdbIML = "/api/iml";
var shipDBName = "DELIVERY-DB";
var shipRelationName = "SHIPMENT-TABLE";
var connToken = "90931360|-31949321161037347|90950240";

$("#shipId").focus();
//  for saverecord in local storage

function saveRecNo2LS(jsonObj) {
  var lvData = JSON.parse(jsonObj.data);
  console.log(lvData);
  localStorage.setItem("recno", lvData.rec_no);
}

//  for finding the shipno
function getShipIdAsjsonObj(jsonObj) {
  var shipid = $("#shipId").val();
  var jsonStr = {
    shipmentno: shipid,
  };
  return JSON.stringify(jsonStr);
}
// for filling data

function fillData(jsonObj) {
  saveRecNo2LS(jsonObj);
  var record = JSON.parse(jsonObj.data).record;
  $("#description").val(record.productdescrption);
  $("#source").val(record.productsource);
  $("#destination").val(record.productdestination);
  $("#shipdate").val(record.shippingDate);
  $("#expectdate").val(record.expectedDeliveryDate);
}
// create getbyrequest
function createGET_BY_KEYRequest(
  connToken,
  shipDBName,
  shipRelationName,
  jsonStrObj
) {
  var getRequest = {
    token: connToken,
    dbName: shipDBName,
    cmd: "GET_BY_KEY",
    rel: shipRelationName,
    jsonStr: JSON.parse(jsonStrObj),
  };
  return JSON.stringify(getRequest);
}
// Function to create an UPDATE record request
function createUPDATERecordRequest(
  connToken,
  jsonStrObj,
  shipDBName,
  shipRelationName,
  recno
) {
  var updateRequest = {
    token: connToken,
    dbName: shipDBName,
    cmd: "UPDATE",
    rel: shipRelationName,
    jsonStr: jsonStrObj,
    rec_no: recno,
  };
  console.log(JSON.stringify(updateRequest));
  return JSON.stringify(updateRequest);
}
//Function to execute a command
function executeCommand(reqString, jpdbBaseURL, apiEndPointUrl) {
  var url = jpdbBaseURL + apiEndPointUrl;
  var jsonObj;
  console.log(url);
  console.log(reqString);
  $.post(url, reqString, function (result) {
    console.log("Response:", result);
    jsonObj = JSON.parse(result);
  }).fail(function (result) {
    console.log("Error Response:", result);
    var dataJsonObj = result.responseText;
    jsonObj = JSON.parse(dataJsonObj);
  });
  return jsonObj;
}

// function executeCommand(reqString, jpdbBaseURL, apiEndPointUrl) {
//   return new Promise(function (resolve, reject) {
//     var url = jpdbBaseURL + apiEndPointUrl;

//     $.post(url, reqString)
//       .done(function (result) {
//         console.log("Success Response:", result);
//         try {
//           var jsonObj = JSON.parse(result);
//           resolve(jsonObj);
//         } catch (error) {
//           console.error("Error parsing JSON response:", error);
//           reject(error);
//         }
//       })
//       .fail(function (result) {
//         console.log("Error Response:", result);
//         var dataJsonObj = result.responseText;
//         console.log("Data received from server:", dataJsonObj);
//         try {
//           var jsonObj = JSON.parse(dataJsonObj);
//           reject(jsonObj);
//         } catch (error) {
//           console.error("Error parsing JSON response:", error);
//           reject(error);
//         }
//       });
//   });
// }

// for reset form
function resetForm() {
  $("#shipId").val("");
  $("#description").val("");
  $("#source").val("");
  $("#destination").val("");
  $("#shipdate").val("");
  $("#expectdate").val("");
  $("#shipId").prop("disabled", false);
  $("#save").prop("disabled", true);
  $("#change").prop("disabled", true);
  $("#reset").prop("disabled", true);
  $("#shipId").focus();
}
// for validate data
function validateData() {
  var shipid, description, source, destination, shipdate, expectdate;
  shipid = $("#shipId").val();
  description = $("#description").val();
  source = $("#source").val();
  destination = $("#destination").val();
  shipdate = $("#shipdate").val();
  expectdate = $("#expectdate").val();
  if (shipid === "") {
    alert("Shipping no is missing");
    $("#shipId").focus();
    return "";
  }
  if (description === "") {
    alert("description is missing");
    $("#description").focus();
    return "";
  }
  if (source === "") {
    alert("Source is missing");
    $("#source").focus();
    return "";
  }
  if (destination === "") {
    alert("destination is missing");
    $("#destination").focus();
    return "";
  }
  if (shipdate === "") {
    alert("Shiping-date is missing");
    $("#shipdate").focus();
    return "";
  }
  if (expectdate === "") {
    alert("Expected-delivery-date is missing");
    $("#expectdate").focus();
    return "";
  }
  var jsonStrObj = {
    shipmentno: shipid,
    productdescrption: description,
    productsource: source,
    productdestination: destination,
    shippingDate: shipdate,
    expectedDeliveryDate: expectdate,
  };
  return jsonStrObj;
}
function validateData2(temprecno) {
  var shipid, description, source, destination, shipdate, expectdate;
  shipid = $("#shipId").val();
  description = $("#description").val();
  source = $("#source").val();
  destination = $("#destination").val();
  shipdate = $("#shipdate").val();
  expectdate = $("#expectdate").val();
  if (shipid === "") {
    alert("Shipping no is missing");
    $("#shipId").focus();
    return "";
  }
  if (description === "") {
    alert("description is missing");
    $("#description").focus();
    return "";
  }
  if (source === "") {
    alert("Source is missing");
    $("#source").focus();
    return "";
  }
  if (destination === "") {
    alert("destination is missing");
    $("#destination").focus();
    return "";
  }
  if (shipdate === "") {
    alert("Shiping-date is missing");
    $("#shipdate").focus();
    return "";
  }
  if (expectdate === "") {
    alert("Expected-delivery-date is missing");
    $("#expectdate").focus();
    return "";
  }
  var jsonStrObj = {
    // rec_no: temprecno,
    productdescrption: description,
    productsource: source,
    productdestination: destination,
    shippingDate: shipdate,
    expectedDeliveryDate: expectdate,
  };
  var jsonobj2 = JSON.stringify(jsonStrObj);
  var jsonobj3 = '{"' + temprecno + '":' + jsonobj2 + "}";
  return JSON.parse(jsonobj3);
}
// for tooget the already saved data
function getShip() {
  var shipIDJSonObj = getShipIdAsjsonObj();
  var getRequest = createGET_BY_KEYRequest(
    connToken,
    shipDBName,
    shipRelationName,
    shipIDJSonObj
  );
  jQuery.ajaxSetup({ async: false });
  var resJsonObj = executeCommand(getRequest, jpdbBaseURL, jpdbIRL);
  jQuery.ajaxSetup({ async: true });
  if (resJsonObj.status === 400) {
    // $("#shipID").prop("disabled", false);
    $("#reset").prop("disabled", false);
    $("#save").prop("disabled", false);
    $("#description").focus();
  } else if (resJsonObj.status === 200) {
    $("#shipId").prop("disabled", true);
    fillData(resJsonObj);
    $("#change").prop("disabled", false);
    $("#reset").prop("disabled", false);
    $("#description").focus();
  }
}

// create put request
function createPUTRequest(connToken, jsonObj, shipDBName, shipRelationName) {
  var putRequest =
    "{\n" +
    '"token" : "' +
    connToken +
    '",' +
    '"dbName": "' +
    shipDBName +
    '",\n' +
    '"cmd" : "PUT",\n' +
    '"rel" : "' +
    shipRelationName +
    '",' +
    '"jsonStr": \n' +
    jsonObj +
    "\n" +
    "}";
  return putRequest;
}
// for save the new data
function saveData() {
  //   console.log("savedata");

  var jsonStrObj = validateData();
  //   console.log(jsonStrObj);
  if (jsonStrObj === "") {
    return "";
  }
  jsonStrObj = JSON.stringify(jsonStrObj);

  var putRequest = createPUTRequest(
    connToken,
    jsonStrObj,
    shipDBName,
    shipRelationName
  );
  alert(putRequest);
  jQuery.ajaxSetup({ async: false });
  console.log(putRequest);
  var resJsonObj = executeCommand(putRequest, jpdbBaseURL, jpdbIML);
  console.log(resJsonObj);
  jQuery.ajaxSetup({ async: false });
  resetForm();
  $("#shipId").focus();
}

// chsnge the updated data
function changeData() {
  $("#change").prop("disabled", true);
  var trecno = localStorage.getItem("recno");
  console.log(trecno);
  var jsonchg = validateData2(trecno);

  //   jsonchg = { 2: { productsource: "hjsdsabcd" } };
  //   if (jsonchg === "") {
  //     return;
  //   }
  //   var temopstr = JSON.stringify(jsonchg);

  var updateRequest = createUPDATERecordRequest(
    connToken,
    jsonchg,
    shipDBName,
    shipRelationName,
    localStorage.getItem("recno")
  );
  jQuery.ajaxSetup({ async: false });
  var resJsonObj = executeCommand(updateRequest, jpdbBaseURL, jpdbIML);
  jQuery.ajaxSetup({ async: true });
  console.log(resJsonObj);
  resetForm();
  $("#shipId").focus();
}
