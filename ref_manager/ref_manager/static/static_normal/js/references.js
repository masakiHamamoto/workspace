$(document).ready(function() {
    var $TABLE = $('#table');

    $('.table-add').click(function () {
	var $clone = $TABLE.find('tr.hide').clone(true).removeClass('hide table-line');
	$TABLE.find('table').append($clone);
    });

    $('.table-remove').click(function () {
	$(this).parents('tr').detach();
    });

/*  // Turn all existing rows into a loopable array
  $rows.each(function () {
    var $td = $(this).find('td');
    var h = {};
    
    // Use the headers from earlier to name our hash keys
    headers.forEach(function (header, i) {
      h[header] = $td.eq(i).text();   
    });
    
    data.push(h);
  });
    */
    
  var references = [];

  function getReferences(success, error) {
    $.get( "/references/", function(rawData) {
      if(rawData.error && rawData.error != null) {
        error(rawData.error);
      } else {
        success(rawData.data);
      }
    })
    .fail(error);
  }

  function overwriteReferences(referenceData) {
    references = referenceData;
    clearAllReferences();
    for(int i = 0; i < referenceData.length; i++) {
      var reference = referenceData[i];
      addReferenceToUI(reference);
    }
  }

  function clearAllReferences(){
    console.log("References cleared!");
    //we don't have the DOM done yet, so just simulate htis TODO
  }

  function addReferenceToUI(reference) {
    console.log(JSON.stringify(reference));
    //we don't have the DOM done yet, so just print elements TODO
  }

  function updateReferences() {
    getReferences(overwriteReferences, console.log);
  }


  function deleteReference(redid) {
    var ind = getReferencePositionFromId(refid);
    if(ind != -1) {
      references.splice(ind, 1);
    }
  }

  function getReferencePositionFromId(refid) {
    var ind = -1;
    var arr = $.grep(references, function(elem, index) {
      if(refid.equals(elem.refid)) {
        ind = index;
        return true;
      } else {
        return false;
      }
    });
    return ind;
  }

  //TODO integrate this function into DOM
  //DELETE
  function deleteReferenceOnServer() {
      var refid = "1234"; //TODO really get the reference from the DOM
      var sendObj = {};
      sendObj["refids"] = [refid];
      $.ajax({
          type: "DELETE",
          url: "/references/",
          data: JSON.stringify(sendObj),
          success: function(data) {
            deleteReference(refid);
            overwriteReferences(references);
          }
      });
  }

  //GET
  function getReferences(success, error) {
    $.getJSON( "/references/", function(rawData) {
      rawData = JSON.parse(rawData);
      if(rawData.error && rawData.error != null) {
        error(rawData.error);
      } else {
        success(rawData.data);
      }
    })
    .fail(error);
  }

  //PUT
  function addReferenceToServer() {
    var reference = {};
    reference["title"] = "testtitle";
    reference["link"] = "http://google.com";
    reference["notes"] = "Some reference thing";
    $.ajax({
      type: "PUT",
      url: "/referenes/",
      data: JSON.stringify(reference),
      success: function(newRefIdStr) {
        newRefId = JSON.parse(newRefIdStr)["refid"];
        reference["refid"] = newRefId;
        references.push(reference);
        overwriteReferences(references);
      }
    });
  }

  //POST
  function updateReferenceOnServer() {
    var reference = {};
    reference["title"] = "testtitle";
    reference["link"] = "http://google.com";
    reference["notes"] = "Some reference thing";
    reference["refid"] = "alsfmaselm13";
    $.ajax({
      type: "POST",
      url: "/referenes/",
      data: JSON.stringify(reference),
      success: function() {
        deleteReference(refid);
        references.push(reference);
        overwriteReferences(references);
      }
    });
  }

  updateReferences();
});
